package com.example.EmployeeManagementSystem.dto;

public class DtoEmployee {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;

    // No-arg constructor
    public DtoEmployee() {}

    // All-args constructor (this is what you need)
    public DtoEmployee(Long id, String firstname, String lastname, String email) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstname() { return firstname; }
    public void setFirstname(String firstname) { this.firstname = firstname; }

    public String getLastname() { return lastname; }
    public void setLastname(String lastname) { this.lastname = lastname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
