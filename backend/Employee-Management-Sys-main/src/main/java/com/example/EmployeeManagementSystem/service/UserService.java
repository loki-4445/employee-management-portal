package com.example.EmployeeManagementSystem.service;

import com.example.EmployeeManagementSystem.dto.RegisterRequest;
import com.example.EmployeeManagementSystem.model.User;

public interface UserService {
    User authenticate(String username, String rawPassword);
    User createUser(RegisterRequest req);
    User getByUsername(String username);    
    User findByUsername(String username);  // ← ADD THIS LINE
}
