package com.smartinterview.repository;

import com.smartinterview.entity.Interview;
import com.smartinterview.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByInterviewerId(Long interviewerId);
    List<Interview> findByCandidateApplicantUserId(Long userId);
    long countByStatus(Interview.Status status);
    List<Interview> findByCandidateCreatedByHr(User hr);
    long countByCandidateCreatedByHrAndStatus(User hr, Interview.Status status);
}
