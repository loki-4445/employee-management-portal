package com.example.EmployeeManagementSystem.dto;



public record RegisterRequest(
    String username,
    String email,
    String password,
    Long organizationId  // Optional - can be null
) {}