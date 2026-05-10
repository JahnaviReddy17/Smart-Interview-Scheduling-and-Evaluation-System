package com.smartinterview.service;

import com.smartinterview.entity.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendWelcomeEmail(Candidate candidate, String plainPassword) {
        if (fromEmail == null || fromEmail.isBlank()) {
            log.info("Email skipped (no mail config): Welcome email for {}", candidate.getFullName());
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(candidate.getEmail());
            message.setSubject("Welcome to SmartInterview - Your Account Credentials");
            message.setText(String.format(
                "Hello %s,\n\nAn account has been created for you on the SmartInterview platform.\n\n" +
                "Login Credentials:\n" +
                "Username: %s\n" +
                "Password: %s\n\n" +
                "You can use these credentials to log in and track your interview status.\n\n" +
                "Best regards,\nSmartInterview Team",
                candidate.getFullName(),
                candidate.getApplicantUser().getUsername(),
                plainPassword
            ));
            mailSender.send(message);
            log.info("Welcome email sent to {}", candidate.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email: {}", e.getMessage());
        }
    }

    public void sendInterviewScheduledEmail(Candidate candidate, Interview interview) {
        if (fromEmail == null || fromEmail.isBlank()) {
            log.info("Email skipped (no mail config): Interview scheduled for {}", candidate.getFullName());
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(candidate.getEmail());
            message.setSubject("SmartInterview - Your Interview Has Been Scheduled");
            message.setText(String.format(
                "Hello %s,\n\nYour interview for %s has been scheduled.\n\n" +
                "Details:\n" +
                "Date: %s\n" +
                "Duration: %d minutes\n" +
                "Join Link: %s\n\n" +
                "Login to your dashboard using your registered username (%s) to view more details.\n\n" +
                "Best regards,\nSmartInterview Team",
                candidate.getFullName(),
                candidate.getJobRole(),
                interview.getScheduledAt(),
                interview.getDuration(),
                interview.getMeetingLink(),
                candidate.getApplicantUser().getUsername()
            ));
            mailSender.send(message);
            log.info("Interview scheduled email sent to {}", candidate.getEmail());
        } catch (Exception e) {
            log.error("Failed to send scheduled email: {}", e.getMessage());
        }
    }

    public void sendInterviewCancelledEmail(Candidate candidate, Interview interview) {
        if (fromEmail == null || fromEmail.isBlank()) {
            log.info("Email skipped (no mail config): Interview cancelled for {}", candidate.getFullName());
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(candidate.getEmail());
            message.setSubject("SmartInterview - Your Interview Has Been Cancelled");
            message.setText(String.format(
                "Hello %s,\n\nWe regret to inform you that your interview for %s scheduled on %s has been cancelled by the recruiter.\n\nWe will reach out to you if there are any further updates.\n\nBest regards,\nSmartInterview Team",
                candidate.getFullName(),
                candidate.getJobRole(),
                interview.getScheduledAt()
            ));
            mailSender.send(message);
            log.info("Cancellation email sent to {}", candidate.getEmail());
        } catch (Exception e) {
            log.error("Failed to send cancellation email: {}", e.getMessage());
        }
    }
}
