package com.example.EmployeeManagementSystem.service.impl;

import com.example.EmployeeManagementSystem.dto.RegisterRequest;
import com.example.EmployeeManagementSystem.model.Organization;
import com.example.EmployeeManagementSystem.model.User;
import com.example.EmployeeManagementSystem.repository.OrganizationRepository;
import com.example.EmployeeManagementSystem.repository.UserRepository;
import com.example.EmployeeManagementSystem.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository repo;
    private final OrganizationRepository orgRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authMgr;
    @Override
    public User getByUsername(String username) {
        return repo.findByUsername(username)
                   .orElseThrow(() ->
                       new RuntimeException("User not found: " + username));
    }
    @Override
    public User findByUsername(String username) {
        return repo.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    public UserServiceImpl(UserRepository repo,
                           OrganizationRepository orgRepo,
                           PasswordEncoder encoder,
                           AuthenticationManager authMgr) {
        this.repo     = repo;
        this.orgRepo  = orgRepo;
        this.encoder  = encoder;
        this.authMgr  = authMgr;
    }

    /* ---------- PUBLIC API ---------- */

    @Override
    public User authenticate(String username, String rawPassword) {
        authMgr.authenticate(new UsernamePasswordAuthenticationToken(username, rawPassword));
        return repo.findByUsername(username)
                   .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User createUser(RegisterRequest req) {
        if (repo.findByUsername(req.username()).isPresent())
            throw new IllegalArgumentException("Username already exists");
        if (repo.findByEmail(req.email()).isPresent())
            throw new IllegalArgumentException("Email already exists");

        Organization org = (req.organizationId() == null)
                ? createNewOrg()                       // always unique now
                : orgRepo.findById(req.organizationId())
                         .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        User u = new User();
        u.setUsername(req.username());
        u.setEmail(req.email());
        u.setPasswordHash(encoder.encode(req.password()));
        u.setOrganization(org);
        u.setIsActive(true);
        u.setCreatedAt(LocalDateTime.now());

        return repo.save(u);
    }

    /* ---------- HELPERS ---------- */

    /** Always returns a brand-new organization with a non-colliding code. */
    private Organization createNewOrg() {
        String code;
        do {
            code = "ORG-" + UUID.randomUUID()
                                 .toString()
                                 .substring(0, 8)
                                 .toUpperCase();           // example: ORG-3F9A21B7
        } while (orgRepo.existsByCode(code));              // paranoia loop

        Organization org = new Organization();
        org.setName("Organization " + code);
        org.setCode(code);
        org.setCreatedAt(LocalDateTime.now());
        return orgRepo.save(org);
    }
}
