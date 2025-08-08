package com.example.EmployeeManagementSystem.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication; // CORRECT import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.EmployeeManagementSystem.model.Employee;
import com.example.EmployeeManagementSystem.model.User;
import com.example.EmployeeManagementSystem.service.EmployeeService;
import com.example.EmployeeManagementSystem.service.UserService;
@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;
    
    @Autowired
    private UserService userService;  // Add this

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees(Authentication auth) {
        // ✅ Get username from Spring Security UserDetails
        String username = auth.getName();
        
        // ✅ Load your custom User entity using the username
        User user = userService.findByUsername(username);
        
        // ✅ Now get employees for this user's organization
        List<Employee> employees = employeeService.getEmployeesByOrganization(
            user.getOrganization().getId()
        );
        return ResponseEntity.ok(employees);
    }

  @PostMapping
public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee, Authentication auth) {
    try {
        System.out.println("Received employee data: " + employee);
        
        String username = auth.getName();
        User user = userService.findByUsername(username);
        
        // Set the organization and timestamps
        employee.setOrganization(user.getOrganization());
        employee.setCreatedAt(LocalDateTime.now());
        employee.setUpdatedAt(LocalDateTime.now());
        
        // Validate required fields
        if (employee.getFirstname() == null || employee.getFirstname().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        if (employee.getLastname() == null || employee.getLastname().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        if (employee.getEmail() == null || employee.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        
        Employee saved = employeeService.saveEmployee(employee);
        System.out.println("Employee saved successfully: " + saved.getId());
        
        // ✅ Make sure we return the complete employee object
        return ResponseEntity.ok(saved);
        
    } catch (Exception e) {
        System.err.println("Error creating employee: " + e.getMessage());
        e.printStackTrace();
        // ✅ Return proper error response
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}



    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long id) {
        Employee employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, 
                                                  @RequestBody Employee employee) {
        try {
            Employee existing = employeeService.getEmployeeById(id);
            
            // Update fields
            existing.setFirstname(employee.getFirstname());
            existing.setLastname(employee.getLastname());
            existing.setEmail(employee.getEmail());
            existing.setEmployeeCode(employee.getEmployeeCode());
            existing.setDepartment(employee.getDepartment());
            existing.setPosition(employee.getPosition());
            existing.setHireDate(employee.getHireDate());
            existing.setUpdatedAt(LocalDateTime.now());
            
            Employee updated = employeeService.saveEmployee(existing);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Error updating employee: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
