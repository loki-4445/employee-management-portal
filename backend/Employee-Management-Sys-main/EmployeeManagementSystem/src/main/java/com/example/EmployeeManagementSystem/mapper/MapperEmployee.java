package com.example.EmployeeManagementSystem.mapper;

import com.example.EmployeeManagementSystem.dto.DtoEmployee;
import com.example.EmployeeManagementSystem.model.Employee;

public class MapperEmployee {
    
    public static Employee mapToEmployee(DtoEmployee dto) {
        Employee e = new Employee();           // uses no-arg ctor
        e.setId(dto.getId());                  // optional
        e.setFirstname(dto.getFirstname());
        e.setLastname(dto.getLastname());
        e.setEmail(dto.getEmail());
        return e;
    }

    public static DtoEmployee mapToDtoEmployee(Employee employee) {
        return new DtoEmployee(
                employee.getId(),
                employee.getFirstname(),
                employee.getLastname(),
                employee.getEmail()
        );
    }
}
