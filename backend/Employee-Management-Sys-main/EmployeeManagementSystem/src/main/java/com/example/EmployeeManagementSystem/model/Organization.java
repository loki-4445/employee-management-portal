package com.example.EmployeeManagementSystem.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String code;

    private String description;
    private String address;
    private String contactEmail;
    private String phone;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // ✅ Prevent circular references and lazy loading issues
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "organization"})
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "organization"})
    private List<Employee> employees = new ArrayList<>();

    // ... all your getters and setters remain the same
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String d) { this.description = d; }

    public String getAddress() { return address; }
    public void setAddress(String a) { this.address = a; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String e) { this.contactEmail = e; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime t) { this.createdAt = t; }

    public List<User> getUsers() { return users; }
    public void setUsers(List<User> u) { this.users = u; }

    public List<Employee> getEmployees() { return employees; }
    public void setEmployees(List<Employee> e) { this.employees = e; }
}
