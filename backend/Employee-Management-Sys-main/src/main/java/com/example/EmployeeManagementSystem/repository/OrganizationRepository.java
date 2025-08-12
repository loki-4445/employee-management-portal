package com.example.EmployeeManagementSystem.repository;

import com.example.EmployeeManagementSystem.model.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByCode(String code); // already used earlier
    boolean existsByCode(String code);              // <--- add this line
}
