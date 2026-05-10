package com.smartinterview.service;

import com.smartinterview.dto.*;
import com.smartinterview.entity.*;
import com.smartinterview.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class HrService {

    private static final Logger log = LoggerFactory.getLogger(HrService.class);
    private final CandidateRepository candidateRepository;
    private final InterviewRepository interviewRepository;
    private final EvaluationRepository evaluationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public HrService(CandidateRepository candidateRepository, InterviewRepository interviewRepository,
                     EvaluationRepository evaluationRepository, UserRepository userRepository,
                     PasswordEncoder passwordEncoder, EmailService emailService) {
        this.candidateRepository = candidateRepository;
        this.interviewRepository = interviewRepository;
        this.evaluationRepository = evaluationRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public Map<String, Object> getDashboard(User hr) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCandidates", candidateRepository.countByCreatedByHr(hr));
        stats.put("scheduledInterviews", interviewRepository.countByCandidateCreatedByHrAndStatus(hr, Interview.Status.SCHEDULED));
        stats.put("completedInterviews", interviewRepository.countByCandidateCreatedByHrAndStatus(hr, Interview.Status.COMPLETED));
        stats.put("pendingDecisions", evaluationRepository.countByInterviewCandidateCreatedByHrAndHrDecisionIsNull(hr));
        return stats;
    }

    public List<Candidate> getCandidates(User hr) {
        return candidateRepository.findByCreatedByHr(hr);
    }

    public Candidate createCandidate(CreateCandidateRequest req, User hr) {
        if (userRepository.existsByUsername(req.getUsername()))
            throw new RuntimeException("Username already taken");

        User applicantUser = User.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .email(req.getEmail())
                .role(User.Role.APPLICANT)
                .build();
        applicantUser = userRepository.save(applicantUser);

        Candidate candidate = Candidate.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .jobRole(req.getJobRole())
                .experience(req.getExperience())
                .skills(req.getSkills())
                .resumeSummary(req.getResumeSummary())
                .applicantUser(applicantUser)
                .createdByHr(hr)
                .build();
        candidate = candidateRepository.save(candidate);

        // Send credentials immediately upon creation
        emailService.sendWelcomeEmail(candidate, req.getPassword());
        
        log.info("Candidate created and welcome email triggered: {}", candidate.getEmail());
        return candidate;
    }

    public List<Interview> getInterviews(User hr) {
        return interviewRepository.findByCandidateCreatedByHr(hr);
    }

    public Interview scheduleInterview(ScheduleInterviewRequest req, User hr) {
        Candidate candidate = candidateRepository.findById(req.getCandidateId())
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        
        if (candidate.getCreatedByHr() == null || !candidate.getCreatedByHr().getId().equals(hr.getId())) {
            throw new RuntimeException("Unauthorized: This candidate does not belong to you.");
        }

        User interviewer = userRepository.findById(req.getInterviewerId())
                .orElseThrow(() -> new RuntimeException("Interviewer not found"));

        Interview interview = Interview.builder()
                .candidate(candidate)
                .interviewer(interviewer)
                .scheduledAt(req.getScheduledAt())
                .duration(req.getDuration())
                .meetingLink(req.getMeetingLink())
                .jobRole(candidate.getJobRole())
                .build();

        interview = interviewRepository.save(interview);
        candidate.setStatus(Candidate.Status.SCHEDULED);
        candidateRepository.save(candidate);

        emailService.sendInterviewScheduledEmail(candidate, interview);
        return interview;
    }

    public Interview cancelInterview(Long interviewId, User hr) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        if (interview.getCandidate().getCreatedByHr() == null || !interview.getCandidate().getCreatedByHr().getId().equals(hr.getId())) {
            throw new RuntimeException("Unauthorized: This interview does not belong to your candidate.");
        }

        if (interview.getStatus() != Interview.Status.SCHEDULED) {
            throw new RuntimeException("Only scheduled interviews can be cancelled.");
        }

        interview.setStatus(Interview.Status.CANCELLED);
        interview = interviewRepository.save(interview);

        Candidate candidate = interview.getCandidate();
        candidate.setStatus(Candidate.Status.PENDING);
        candidateRepository.save(candidate);

        log.info("Cancelling interview ID: {} for candidate: {}", interviewId, candidate.getEmail());
        emailService.sendInterviewCancelledEmail(candidate, interview);

        return interview;
    }

    public Interview rescheduleInterview(Long interviewId, RescheduleInterviewRequest req, User hr) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        if (interview.getCandidate().getCreatedByHr() == null || !interview.getCandidate().getCreatedByHr().getId().equals(hr.getId())) {
            throw new RuntimeException("Unauthorized: This interview does not belong to your candidate.");
        }

        if (req.getInterviewerId() != null && !interview.getInterviewer().getId().equals(req.getInterviewerId())) {
            User newInterviewer = userRepository.findById(req.getInterviewerId())
                    .orElseThrow(() -> new RuntimeException("New interviewer not found"));
            interview.setInterviewer(newInterviewer);
        }

        interview.setScheduledAt(req.getScheduledAt());
        interview.setDuration(req.getDuration());
        interview.setMeetingLink(req.getMeetingLink());
        interview.setStatus(Interview.Status.SCHEDULED);

        interview = interviewRepository.save(interview);

        Candidate candidate = interview.getCandidate();
        candidate.setStatus(Candidate.Status.SCHEDULED);
        candidateRepository.save(candidate);

        emailService.sendInterviewScheduledEmail(candidate, interview);

        return interview;
    }

    public List<Evaluation> getEvaluations(User hr) {
        return evaluationRepository.findByInterviewCandidateCreatedByHr(hr);
    }

    public Evaluation makeDecision(Long evaluationId, HrDecisionRequest req, User hr) {
        Evaluation eval = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));

        if (eval.getInterview().getCandidate().getCreatedByHr() == null || !eval.getInterview().getCandidate().getCreatedByHr().getId().equals(hr.getId())) {
            throw new RuntimeException("Unauthorized: This evaluation does not belong to your candidate.");
        }

        eval.setHrDecision(req.getDecision());
        eval.getInterview().getCandidate().setStatus(
                req.getDecision() == Evaluation.HrDecision.SELECTED
                        ? Candidate.Status.SELECTED : Candidate.Status.REJECTED
        );
        candidateRepository.save(eval.getInterview().getCandidate());
        return evaluationRepository.save(eval);
    }

    public List<User> getInterviewers() {
        return userRepository.findByRole(User.Role.INTERVIEWER);
    }
}
