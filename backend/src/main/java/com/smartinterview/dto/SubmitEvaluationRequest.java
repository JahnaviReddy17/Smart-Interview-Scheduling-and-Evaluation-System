package com.smartinterview.dto;

public class SubmitEvaluationRequest {
    private Long interviewId;
    private Double technicalScore;
    private Double communicationScore;
    private Double problemSolvingScore;
    private String comments;

    public SubmitEvaluationRequest() {}

    public Long getInterviewId() { return interviewId; }
    public void setInterviewId(Long interviewId) { this.interviewId = interviewId; }
    public Double getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(Double technicalScore) { this.technicalScore = technicalScore; }
    public Double getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(Double communicationScore) { this.communicationScore = communicationScore; }
    public Double getProblemSolvingScore() { return problemSolvingScore; }
    public void setProblemSolvingScore(Double problemSolvingScore) { this.problemSolvingScore = problemSolvingScore; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}
