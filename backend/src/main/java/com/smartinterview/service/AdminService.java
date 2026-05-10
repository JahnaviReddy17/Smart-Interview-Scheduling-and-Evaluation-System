package com.smartinterview.service;

import com.smartinterview.dto.CreateUserRequest;
import com.smartinterview.entity.User;
import com.smartinterview.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final InterviewRepository interviewRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository, CandidateRepository candidateRepository,
                        InterviewRepository interviewRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
        this.interviewRepository = interviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, Object> getDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCandidates", candidateRepository.count());
        stats.put("totalInterviews", interviewRepository.count());
        stats.put("totalHR", userRepository.findByRole(User.Role.HR).size());
        stats.put("totalInterviewers", userRepository.findByRole(User.Role.INTERVIEWER).size());
        stats.put("scheduledInterviews", interviewRepository.countByStatus(com.smartinterview.entity.Interview.Status.SCHEDULED));
        stats.put("completedInterviews", interviewRepository.countByStatus(com.smartinterview.entity.Interview.Status.COMPLETED));
        stats.put("pending", candidateRepository.findAll().stream().filter(c -> c.getStatus() == com.smartinterview.entity.Candidate.Status.PENDING).count());
        stats.put("interviewed", candidateRepository.findAll().stream().filter(c -> c.getStatus() == com.smartinterview.entity.Candidate.Status.INTERVIEWED).count());
        stats.put("selected", candidateRepository.findAll().stream().filter(c -> c.getStatus() == com.smartinterview.entity.Candidate.Status.SELECTED).count());
        stats.put("rejected", candidateRepository.findAll().stream().filter(c -> c.getStatus() == com.smartinterview.entity.Candidate.Status.REJECTED).count());
        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(CreateUserRequest req) {
        if (userRepository.existsByUsername(req.getUsername()))
            throw new RuntimeException("Username already taken");

        User user = User.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .email(req.getEmail())
                .role(req.getRole())
                .department(req.getDepartment())
                .build();
        return userRepository.save(user);
    }

    public User toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }
}
