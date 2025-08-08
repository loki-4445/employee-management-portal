package com.example.EmployeeManagementSystem.dto;

public class MessageResponse {
    private String message;
    private long timestamp;

    public MessageResponse() {
        this.timestamp = System.currentTimeMillis();
    }

    public MessageResponse(String message) {
        this.message = message;
        this.timestamp = System.currentTimeMillis();
    }

    // Getters and setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
