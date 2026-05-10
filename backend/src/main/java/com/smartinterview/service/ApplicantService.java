package com.smartinterview.service;

import com.smartinterview.entity.*;
import com.smartinterview.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicantService {

    private final CandidateRepository candidateRepository;
    private final InterviewRepository interviewRepository;
    private final EvaluationRepository evaluationRepository;
    private final UserRepository userRepository;

    public ApplicantService(CandidateRepository candidateRepository, InterviewRepository interviewRepository,
                            EvaluationRepository evaluationRepository, UserRepository userRepository) {
        this.candidateRepository = candidateRepository;
        this.interviewRepository = interviewRepository;
        this.evaluationRepository = evaluationRepository;
        this.userRepository = userRepository;
    }

    public Candidate getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return candidateRepository.findByApplicantUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    public List<Interview> getMyInterviews(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return interviewRepository.findByCandidateApplicantUserId(user.getId());
    }

    public Evaluation getResult(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return evaluationRepository.findByInterviewCandidateApplicantUserId(user.getId())
                .orElse(null);
    }
}
