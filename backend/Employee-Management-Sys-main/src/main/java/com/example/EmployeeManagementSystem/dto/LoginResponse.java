package com.example.EmployeeManagementSystem.dto;

public record LoginResponse(
        String token,
        Long   id,
        String username,
        String email,
        Long   organizationId,
        String organizationName) {}