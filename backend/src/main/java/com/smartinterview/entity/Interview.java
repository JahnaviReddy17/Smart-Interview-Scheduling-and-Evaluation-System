package com.smartinterview.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "interviewer_id", nullable = false)
    private User interviewer;

    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    private Integer duration;
    private String meetingLink;
    private String jobRole;

    @Enumerated(EnumType.STRING)
    private Status status = Status.SCHEDULED;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    }

    public Interview() {}

    public Interview(Long id, Candidate candidate, User interviewer, LocalDateTime scheduledAt, Integer duration, String meetingLink, String jobRole, Status status, LocalDateTime createdAt) {
        this.id = id;
        this.candidate = candidate;
        this.interviewer = interviewer;
        this.scheduledAt = scheduledAt;
        this.duration = duration;
        this.meetingLink = meetingLink;
        this.jobRole = jobRole;
        this.status = status != null ? status : Status.SCHEDULED;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Candidate getCandidate() { return candidate; }
    public void setCandidate(Candidate candidate) { this.candidate = candidate; }
    public User getInterviewer() { return interviewer; }
    public void setInterviewer(User interviewer) { this.interviewer = interviewer; }
    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder Pattern
    public static InterviewBuilder builder() {
        return new InterviewBuilder();
    }

    public static class InterviewBuilder {
        private Long id;
        private Candidate candidate;
        private User interviewer;
        private LocalDateTime scheduledAt;
        private Integer duration;
        private String meetingLink;
        private String jobRole;
        private Status status = Status.SCHEDULED;
        private LocalDateTime createdAt = LocalDateTime.now();

        public InterviewBuilder id(Long id) { this.id = id; return this; }
        public InterviewBuilder candidate(Candidate candidate) { this.candidate = candidate; return this; }
        public InterviewBuilder interviewer(User interviewer) { this.interviewer = interviewer; return this; }
        public InterviewBuilder scheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; return this; }
        public InterviewBuilder duration(Integer duration) { this.duration = duration; return this; }
        public InterviewBuilder meetingLink(String meetingLink) { this.meetingLink = meetingLink; return this; }
        public InterviewBuilder jobRole(String jobRole) { this.jobRole = jobRole; return this; }
        public InterviewBuilder status(Status status) { this.status = status; return this; }
        public InterviewBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Interview build() {
            return new Interview(id, candidate, interviewer, scheduledAt, duration, meetingLink, jobRole, status, createdAt);
        }
    }
}