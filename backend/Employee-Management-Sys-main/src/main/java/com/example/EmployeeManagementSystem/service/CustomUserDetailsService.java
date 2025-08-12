package com.example.EmployeeManagementSystem.service;

import com.example.EmployeeManagementSystem.model.User;
import com.example.EmployeeManagementSystem.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("🔍 Loading user details for: " + username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("❌ User not found: " + username);
                    return new UsernameNotFoundException("User not found: " + username);
                });
        
        System.out.println("✅ User loaded successfully: " + user.getUsername());
        System.out.println("User active status: " + user.getIsActive());
        
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPasswordHash())
                .authorities("ROLE_USER")
                .accountExpired(false)
                .accountLocked(!user.getIsActive())
                .credentialsExpired(false)
                .disabled(!user.getIsActive())
                .build();
    }
}
