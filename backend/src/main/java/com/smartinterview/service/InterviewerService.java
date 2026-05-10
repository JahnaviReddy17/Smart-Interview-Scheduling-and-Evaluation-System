package com.smartinterview.service;

import com.smartinterview.dto.SubmitEvaluationRequest;
import com.smartinterview.entity.*;
import com.smartinterview.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterviewerService {

    private static final Logger log = LoggerFactory.getLogger(InterviewerService.class);
    private final InterviewRepository interviewRepository;
    private final EvaluationRepository evaluationRepository;
    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final GeminiService geminiService;

    public InterviewerService(InterviewRepository interviewRepository, EvaluationRepository evaluationRepository,
                              UserRepository userRepository, CandidateRepository candidateRepository,
                              GeminiService geminiService) {
        this.interviewRepository = interviewRepository;
        this.evaluationRepository = evaluationRepository;
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
        this.geminiService = geminiService;
    }

    public List<Interview> getMyInterviews(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return interviewRepository.findByInterviewerId(user.getId());
    }

    public Interview startInterview(Long interviewId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
        interview.setStatus(Interview.Status.IN_PROGRESS);
        return interviewRepository.save(interview);
    }

    public Evaluation submitEvaluation(SubmitEvaluationRequest req, String username) {
        User evaluator = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Interview interview = interviewRepository.findById(req.getInterviewId())
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        double interviewerFinalScore = (req.getTechnicalScore() + req.getCommunicationScore() + req.getProblemSolvingScore()) / 3.0;

        GeminiService.GeminiEvaluationResult aiResult = geminiService.evaluateCandidate(
                interview.getCandidate().getSkills(),
                interview.getCandidate().getResumeSummary(),
                req.getTechnicalScore(),
                req.getCommunicationScore(),
                req.getProblemSolvingScore(),
                req.getComments()
        );
        
        log.info("AI evaluation for interview {}: score={}, feedback={}", 
            req.getInterviewId(), aiResult.score(), aiResult.feedback());

        double computedFinalScore = (interviewerFinalScore + aiResult.score()) / 2.0;

        Evaluation evaluation = Evaluation.builder()
                .interview(interview)
                .evaluator(evaluator)
                .technicalScore(req.getTechnicalScore())
                .communicationScore(req.getCommunicationScore())
                .problemSolvingScore(req.getProblemSolvingScore())
                .finalScore(Math.round(computedFinalScore * 10.0) / 10.0)
                .aiScore(aiResult.score())
                .aiFeedback(aiResult.feedback() == null || aiResult.feedback().isEmpty() ? "No specific feedback generated." : aiResult.feedback())
                .comments(req.getComments())
                .build();

        interview.setStatus(Interview.Status.COMPLETED);
        interviewRepository.save(interview);

        interview.getCandidate().setStatus(Candidate.Status.INTERVIEWED);
        candidateRepository.save(interview.getCandidate());

        return evaluationRepository.save(evaluation);
    }
}
