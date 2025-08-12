// src/api/http.js - COMPLETE ENVIRONMENT-AWARE VERSION (ESLint Fixed)
import { useMemo } from 'react';

// API configuration
const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    baseURL: isDevelopment 
      ? 'http://localhost:8080'  // Local development
      : 'https://employee-management-api-nql8.onrender.com', // Production
    timeout: 30000, // 30 seconds
  };
};

export function useHttp() {
  return useMemo(() => {
    return async function http(url, opts = {}) {
      const config = getApiConfig();
      const headers = new Headers();
      
      // Get stored credentials for Basic Auth
      const username = localStorage.getItem('auth-username');
      const password = localStorage.getItem('auth-password');
      
      if (username && password) {
        const credentials = btoa(`${username}:${password}`);
        headers.set('Authorization', `Basic ${credentials}`);
      }
      
      // Set Content-Type for requests with body
      if (opts.body) {
        headers.set('Content-Type', 'application/json');
      }

      // Merge any additional headers
      if (opts.headers) {
        for (const [key, value] of Object.entries(opts.headers)) {
          headers.set(key, value);
        }
      }

      // Build complete URL
      const fullURL = url.startsWith('http') ? url : `${config.baseURL}${url}`;

      console.log('🚀 HTTP Request:', {
        environment: process.env.NODE_ENV,
        url: fullURL,
        method: opts.method || 'GET',
        headers: Object.fromEntries(headers),
        body: opts.body ? JSON.parse(opts.body) : undefined
      });

      try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const res = await fetch(fullURL, { 
          ...opts, 
          headers,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('✅ HTTP Response:', {
          status: res.status,
          statusText: res.statusText,
          ok: res.ok,
          url: res.url
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('❌ HTTP Error Response:', errorText);
          throw new Error(errorText || `HTTP ${res.status}: ${res.statusText}`);
        }
        
        // Handle No Content response
        if (res.status === 204) {
          console.log('📭 No Content Response');
          return null;
        }

        // ✅ FIX: Parse JSON response - moved responseText outside try block
        const responseText = await res.text();
        
        try {
          if (!responseText || responseText.trim() === '') {
            console.log('📭 Empty Response Body');
            return null;
          }
          
          const jsonData = JSON.parse(responseText);
          console.log('📄 Parsed Response:', jsonData);
          return jsonData;

        } catch (jsonError) {
          console.error('❌ JSON Parsing Error:', {
            error: jsonError.message,
            responseText: responseText?.substring(0, 200) + '...' // ✅ Now accessible
          });
          throw new Error('Server returned invalid JSON response');
        }

      } catch (error) {
        if (error.name === 'AbortError') {
          console.error('⏰ Request Timeout');
          throw new Error('Request timeout - please try again');
        }
        
        console.error('❌ Network Error:', {
          name: error.name,
          message: error.message,
          url: fullURL
        });
        
        // Handle specific error cases
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error - check your internet connection');
        }
        
        throw error;
      }
    };
  }, []);
}
