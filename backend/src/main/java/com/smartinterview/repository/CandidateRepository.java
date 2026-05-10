package com.smartinterview.repository;

import com.smartinterview.entity.Candidate;
import com.smartinterview.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByApplicantUserId(Long userId);
    boolean existsByEmail(String email);
    List<Candidate> findByCreatedByHr(User hr);
    long countByCreatedByHr(User hr);
}
