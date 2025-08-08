	package com.example.EmployeeManagementSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;  // Correct import
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.authentication.BadCredentialsException;


import com.example.EmployeeManagementSystem.dto.ErrorResponse;
import com.example.EmployeeManagementSystem.dto.LoginRequest;
import com.example.EmployeeManagementSystem.dto.LoginResponse;
import com.example.EmployeeManagementSystem.dto.MessageResponse;
import com.example.EmployeeManagementSystem.dto.RegisterRequest;
import com.example.EmployeeManagementSystem.model.User;
import com.example.EmployeeManagementSystem.service.JwtService;
import com.example.EmployeeManagementSystem.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;
    
//    @PostMapping("/login")
//public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
//    try {
//        User user = userService.authenticate(
//            loginRequest.username(), 
//            loginRequest.password()
//        );
//        
//        String token = jwtService.generateToken(user);
//        
//        return ResponseEntity.ok(new LoginResponse(
//            token,
//            user.getId(),
//            user.getUsername(),
//            user.getEmail(),
//            user.getOrganization().getId(),
//            user.getOrganization().getName()
//        ));
//    } catch (BadCredentialsException e) {
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//            .body(new ErrorResponse("Invalid credentials"));
//    } catch (Exception e) {
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//            .body(new ErrorResponse("Authentication failed: " + e.getMessage()));
//    }
//}
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate user with username/password
            User user = userService.authenticate(
                loginRequest.username(), 
                loginRequest.password()
            );
            
            // Return success response WITHOUT JWT token
            return ResponseEntity.ok(new LoginResponse(
                "authenticated",  // Instead of JWT token
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getOrganization().getId(),
                user.getOrganization().getName()
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Invalid credentials"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Authentication failed: " + e.getMessage()));
        }
    }


    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.createUser(request);
            return ResponseEntity.ok(new MessageResponse("User registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }
}
