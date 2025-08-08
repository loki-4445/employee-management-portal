import { useMemo } from 'react';

export function useHttp() {
  return useMemo(() => {
    return async function http(url, opts = {}) {
      const headers = new Headers();
      
      const username = localStorage.getItem('auth-username');
      const password = localStorage.getItem('auth-password');
      
      if (username && password) {
        const credentials = btoa(`${username}:${password}`);
        headers.set('Authorization', `Basic ${credentials}`);
      }
      
      if (opts.body) {
        headers.set('Content-Type', 'application/json');
      }

      if (opts.headers) {
        for (const [key, value] of Object.entries(opts.headers)) {
          headers.set(key, value);
        }
      }

      console.log('HTTP Request:', {
        url,
        method: opts.method || 'GET',
        headers: Object.fromEntries(headers),
        body: opts.body
      });

      const res = await fetch(url, { 
        ...opts, 
        headers 
      });

      console.log('HTTP Response:', {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok
      });

      if (!res.ok) {
        const errorText = await res.text();
     
        throw new Error(errorText || res.statusText);
      }
      
      if (res.status === 204) {
        return null;
      }

      // ✅ Better JSON parsing with error handling
      try {
        const responseText = await res.text();
        console.log('Raw response:', responseText);
        
        if (!responseText) {
          return null;
        }
        
        return JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        console.error('Response text was:', await res.text());
        throw new Error('Server returned invalid JSON response');
      }
    };
  }, []);
}
