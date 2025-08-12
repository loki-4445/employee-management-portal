package com.example.EmployeeManagementSystem.security;

import com.example.EmployeeManagementSystem.service.JwtService;
import com.example.EmployeeManagementSystem.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtRequestFilter(JwtService jwtService, 
                           CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }
    

    @Override
protected void doFilterInternal(HttpServletRequest request, 
                              HttpServletResponse response, 
                              FilterChain chain)
        throws ServletException, IOException {

    final String requestTokenHeader = request.getHeader("Authorization");
    
    System.out.println("=== JWT Filter Debug ===");
    System.out.println("Request URI: " + request.getRequestURI());
    System.out.println("Authorization Header: " + requestTokenHeader);

    String username = null;
    String jwtToken = null;

    if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
        jwtToken = requestTokenHeader.substring(7);
        System.out.println("Extracted Token: " + jwtToken.substring(0, 20) + "...");
        
        try {
            username = jwtService.extractUsername(jwtToken);
            System.out.println("Extracted Username: " + username);
        } catch (Exception e) {
            System.out.println("Token extraction error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        try {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            System.out.println("User loaded: " + userDetails.getUsername());
            
            boolean isValid = jwtService.isValid(jwtToken);
            System.out.println("Token is valid: " + isValid);
            
            if (isValid) {
                UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("Authentication set successfully");
            }
        } catch (Exception e) {
            System.out.println("Authentication setup error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    System.out.println("Final auth status: " + (SecurityContextHolder.getContext().getAuthentication() != null));
    System.out.println("========================");
    
    chain.doFilter(request, response);
}

    
}
