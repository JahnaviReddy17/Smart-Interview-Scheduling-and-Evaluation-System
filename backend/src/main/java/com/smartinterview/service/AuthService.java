package com.smartinterview.service;

import com.smartinterview.dto.*;
import com.smartinterview.repository.UserRepository;
import com.smartinterview.security.JwtService;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, UserDetailsService userDetailsService,
                       UserRepository userRepository, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        System.out.println("Login attempt - Username: [" + request.getUsername() + "], Password: [" + request.getPassword() + "]");
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            System.out.println("Authentication SUCCESS for: " + request.getUsername());
        } catch (org.springframework.security.core.AuthenticationException e) {
            System.out.println("Authentication FAILED for: " + request.getUsername() + " - " + e.getMessage());
            throw e;
        }

        var userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(userDetails);

        return new LoginResponse(
                token,
                user.getRole().name(),
                user.getUsername(),
                user.getFullName(),
                user.getId()
        );
    }

    public java.util.List<String> listAllUsernames() {
        return userRepository.findAll().stream()
                .map(u -> u.getUsername() + " (Role: " + u.getRole() + ", Active: " + u.isActive() + ")")
                .toList();
    }
}
