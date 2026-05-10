package com.smartinterview.service;

import com.smartinterview.entity.Candidate;
import com.smartinterview.entity.User;
import com.smartinterview.repository.CandidateRepository;
import com.smartinterview.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, CandidateRepository candidateRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        createUserIfNotExists("admin", "admin123", "System Administrator", "admin@smartinterview.com", User.Role.ADMIN, "IT");
        User hr1 = createUserIfNotExists("hr1", "hr123", "Sarah Johnson", "hr@smartinterview.com", User.Role.HR, "Human Resources");
        createUserIfNotExists("interviewer1", "int123", "Mike Chen", "interviewer@smartinterview.com", User.Role.INTERVIEWER, "Engineering");
        
        // Assign hr1 to any "orphaned" candidates for demonstration
        candidateRepository.findAll().forEach(c -> {
            if (c.getCreatedByHr() == null) {
                c.setCreatedByHr(hr1);
                candidateRepository.save(c);
            }
        });
        
        log.info("Default accounts ready — admin/admin123 | hr1/hr123 | interviewer1/int123");
    }

    private User createUserIfNotExists(String username, String password, String fullName, String email, User.Role role, String dept) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            user = User.builder()
                    .username(username)
                    .fullName(fullName)
                    .email(email)
                    .role(role)
                    .department(dept)
                    .password(passwordEncoder.encode(password))
                    .active(true)
                    .build();
            log.info("Creating default user: {}", username);
            return userRepository.save(user);
        }
        
        // Ensure password matches and user is active
        if (!passwordEncoder.matches(password, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(password));
            log.info("Resetting password for user: {}", username);
        }
        
        if (!user.isActive()) {
            user.setActive(true);
            log.info("Activating user: {}", username);
        }
        
        return userRepository.save(user);
    }
}
