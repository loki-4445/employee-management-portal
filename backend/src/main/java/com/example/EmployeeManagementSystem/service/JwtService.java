package com.example.EmployeeManagementSystem.service;

import com.example.EmployeeManagementSystem.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms:86400000}")
    private long expirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("orgId", user.getOrganization().getId())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isValid(String token) {
        try {
            System.out.println("🔍 Validating token: " + token.substring(0, 20) + "...");
            Claims claims = extractAllClaims(token);
            System.out.println("✅ Token claims extracted successfully");
            System.out.println("Subject: " + claims.getSubject());
            System.out.println("Expiration: " + claims.getExpiration());
            System.out.println("Current time: " + new Date());
            
            // Check if token is expired
            if (claims.getExpiration().before(new Date())) {
                System.out.println("❌ Token EXPIRED");
                return false;
            }
            
            System.out.println("✅ Token is VALID");
            return true;
            
        } catch (Exception e) {
            System.out.println("❌ Token validation failed: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    } 

   
}
