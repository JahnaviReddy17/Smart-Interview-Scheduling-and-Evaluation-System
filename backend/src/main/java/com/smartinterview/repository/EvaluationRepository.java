package com.smartinterview.repository;

import com.smartinterview.entity.Evaluation;
import com.smartinterview.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    Optional<Evaluation> findByInterviewId(Long interviewId);
    List<Evaluation> findByHrDecisionIsNull();
    Optional<Evaluation> findByInterviewCandidateApplicantUserId(Long userId);
    long countByHrDecisionIsNull();
    List<Evaluation> findByInterviewCandidateCreatedByHr(User hr);
    long countByInterviewCandidateCreatedByHrAndHrDecisionIsNull(User hr);
}
