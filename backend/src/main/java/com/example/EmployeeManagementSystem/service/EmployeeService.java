package com.example.EmployeeManagementSystem.service;

import com.example.EmployeeManagementSystem.model.Employee;
import java.util.List;

public interface EmployeeService {
    List<Employee> getEmployeesByOrganization(Long organizationId);
    Employee saveEmployee(Employee employee);
    Employee getEmployeeById(Long id);
    void deleteEmployee(Long id);
}