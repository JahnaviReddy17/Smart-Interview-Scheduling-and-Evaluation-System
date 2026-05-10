package com.smartinterview.dto;

import java.time.LocalDateTime;

public class RescheduleInterviewRequest {
    private LocalDateTime scheduledAt;
    private Integer duration;
    private String meetingLink;
    private Long interviewerId;

    public RescheduleInterviewRequest() {}

    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    public Long getInterviewerId() { return interviewerId; }
    public void setInterviewerId(Long interviewerId) { this.interviewerId = interviewerId; }
}
