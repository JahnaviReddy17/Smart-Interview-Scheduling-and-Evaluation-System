package com.smartinterview.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations")
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "interview_id", unique = true)
    private Interview interview;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "evaluator_id")
    private User evaluator;

    private Double technicalScore;
    private Double communicationScore;
    private Double problemSolvingScore;
    private Double finalScore;
    
    private Double aiScore;
    
    @Column(length = 2000)
    private String aiFeedback;

    @Column(length = 2000)
    private String comments;

    @Enumerated(EnumType.STRING)
    private HrDecision hrDecision;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum HrDecision {
        SELECTED, REJECTED
    }

    public Evaluation() {}

    public Evaluation(Long id, Interview interview, User evaluator, Double technicalScore, Double communicationScore, Double problemSolvingScore, Double finalScore, Double aiScore, String aiFeedback, String comments, HrDecision hrDecision, LocalDateTime createdAt) {
        this.id = id;
        this.interview = interview;
        this.evaluator = evaluator;
        this.technicalScore = technicalScore;
        this.communicationScore = communicationScore;
        this.problemSolvingScore = problemSolvingScore;
        this.finalScore = finalScore;
        this.aiScore = aiScore;
        this.aiFeedback = aiFeedback;
        this.comments = comments;
        this.hrDecision = hrDecision;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Interview getInterview() { return interview; }
    public void setInterview(Interview interview) { this.interview = interview; }
    public User getEvaluator() { return evaluator; }
    public void setEvaluator(User evaluator) { this.evaluator = evaluator; }
    public Double getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(Double technicalScore) { this.technicalScore = technicalScore; }
    public Double getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(Double communicationScore) { this.communicationScore = communicationScore; }
    public Double getProblemSolvingScore() { return problemSolvingScore; }
    public void setProblemSolvingScore(Double problemSolvingScore) { this.problemSolvingScore = problemSolvingScore; }
    public Double getFinalScore() { return finalScore; }
    public void setFinalScore(Double finalScore) { this.finalScore = finalScore; }
    public Double getAiScore() { return aiScore; }
    public void setAiScore(Double aiScore) { this.aiScore = aiScore; }
    public String getAiFeedback() { return aiFeedback; }
    public void setAiFeedback(String aiFeedback) { this.aiFeedback = aiFeedback; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public HrDecision getHrDecision() { return hrDecision; }
    public void setHrDecision(HrDecision hrDecision) { this.hrDecision = hrDecision; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder Pattern
    public static EvaluationBuilder builder() {
        return new EvaluationBuilder();
    }

    public static class EvaluationBuilder {
        private Long id;
        private Interview interview;
        private User evaluator;
        private Double technicalScore;
        private Double communicationScore;
        private Double problemSolvingScore;
        private Double finalScore;
        private Double aiScore;
        private String aiFeedback;
        private String comments;
        private HrDecision hrDecision;
        private LocalDateTime createdAt = LocalDateTime.now();

        public EvaluationBuilder id(Long id) { this.id = id; return this; }
        public EvaluationBuilder interview(Interview interview) { this.interview = interview; return this; }
        public EvaluationBuilder evaluator(User evaluator) { this.evaluator = evaluator; return this; }
        public EvaluationBuilder technicalScore(Double technicalScore) { this.technicalScore = technicalScore; return this; }
        public EvaluationBuilder communicationScore(Double communicationScore) { this.communicationScore = communicationScore; return this; }
        public EvaluationBuilder problemSolvingScore(Double problemSolvingScore) { this.problemSolvingScore = problemSolvingScore; return this; }
        public EvaluationBuilder finalScore(Double finalScore) { this.finalScore = finalScore; return this; }
        public EvaluationBuilder aiScore(Double aiScore) { this.aiScore = aiScore; return this; }
        public EvaluationBuilder aiFeedback(String aiFeedback) { this.aiFeedback = aiFeedback; return this; }
        public EvaluationBuilder comments(String comments) { this.comments = comments; return this; }
        public EvaluationBuilder hrDecision(HrDecision hrDecision) { this.hrDecision = hrDecision; return this; }
        public EvaluationBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Evaluation build() {
            return new Evaluation(id, interview, evaluator, technicalScore, communicationScore, problemSolvingScore, finalScore, aiScore, aiFeedback, comments, hrDecision, createdAt);
        }
    }
}