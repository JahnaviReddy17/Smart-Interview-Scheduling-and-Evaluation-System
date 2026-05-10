package com.smartinterview.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true)
    private String email;

    private String phone;

    @Column(nullable = false)
    private String jobRole;

    private String experience;
    private String skills;
    private String resumeSummary;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User applicantUser;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_hr_id")
    private User createdByHr;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PENDING, SCHEDULED, INTERVIEWED, SELECTED, REJECTED
    }

    public Candidate() {}

    public Candidate(Long id, String fullName, String email, String phone, String jobRole, String experience, String skills, String resumeSummary, Status status, User applicantUser, User createdByHr, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.jobRole = jobRole;
        this.experience = experience;
        this.skills = skills;
        this.resumeSummary = resumeSummary;
        this.status = status != null ? status : Status.PENDING;
        this.applicantUser = applicantUser;
        this.createdByHr = createdByHr;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public String getResumeSummary() { return resumeSummary; }
    public void setResumeSummary(String resumeSummary) { this.resumeSummary = resumeSummary; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public User getApplicantUser() { return applicantUser; }
    public void setApplicantUser(User applicantUser) { this.applicantUser = applicantUser; }
    public User getCreatedByHr() { return createdByHr; }
    public void setCreatedByHr(User createdByHr) { this.createdByHr = createdByHr; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder Pattern
    public static CandidateBuilder builder() {
        return new CandidateBuilder();
    }

    public static class CandidateBuilder {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String jobRole;
        private String experience;
        private String skills;
        private String resumeSummary;
        private Status status = Status.PENDING;
        private User applicantUser;
        private User createdByHr;
        private LocalDateTime createdAt = LocalDateTime.now();

        public CandidateBuilder id(Long id) { this.id = id; return this; }
        public CandidateBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public CandidateBuilder email(String email) { this.email = email; return this; }
        public CandidateBuilder phone(String phone) { this.phone = phone; return this; }
        public CandidateBuilder jobRole(String jobRole) { this.jobRole = jobRole; return this; }
        public CandidateBuilder experience(String experience) { this.experience = experience; return this; }
        public CandidateBuilder skills(String skills) { this.skills = skills; return this; }
        public CandidateBuilder resumeSummary(String resumeSummary) { this.resumeSummary = resumeSummary; return this; }
        public CandidateBuilder status(Status status) { this.status = status; return this; }
        public CandidateBuilder applicantUser(User applicantUser) { this.applicantUser = applicantUser; return this; }
        public CandidateBuilder createdByHr(User createdByHr) { this.createdByHr = createdByHr; return this; }
        public CandidateBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Candidate build() {
            return new Candidate(id, fullName, email, phone, jobRole, experience, skills, resumeSummary, status, applicantUser, createdByHr, createdAt);
        }
    }
}