package com.smartinterview.controller;

import com.smartinterview.dto.*;
import com.smartinterview.entity.*;
import com.smartinterview.repository.UserRepository;
import com.smartinterview.service.HrService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/hr")
public class HrController {

    private final HrService hrService;
    private final UserRepository userRepository;

    public HrController(HrService hrService, UserRepository userRepository) {
        this.hrService = hrService;
        this.userRepository = userRepository;
    }

    private User getCurrentUser(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(hrService.getDashboard(getCurrentUser(userDetails)));
    }

    @GetMapping("/candidates")
    public ResponseEntity<List<Candidate>> getCandidates(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(hrService.getCandidates(getCurrentUser(userDetails)));
    }

    @PostMapping("/candidates")
    public ResponseEntity<Candidate> createCandidate(@AuthenticationPrincipal UserDetails userDetails, @RequestBody CreateCandidateRequest request) {
        return ResponseEntity.ok(hrService.createCandidate(request, getCurrentUser(userDetails)));
    }

    @GetMapping("/interviews")
    public ResponseEntity<List<Interview>> getInterviews(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(hrService.getInterviews(getCurrentUser(userDetails)));
    }

    @PostMapping("/interviews")
    public ResponseEntity<Interview> scheduleInterview(@AuthenticationPrincipal UserDetails userDetails, @RequestBody ScheduleInterviewRequest request) {
        return ResponseEntity.ok(hrService.scheduleInterview(request, getCurrentUser(userDetails)));
    }

    @PatchMapping("/interviews/{id}/cancel")
    public ResponseEntity<Interview> cancelInterview(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        return ResponseEntity.ok(hrService.cancelInterview(id, getCurrentUser(userDetails)));
    }

    @PutMapping("/interviews/{id}/reschedule")
    public ResponseEntity<Interview> rescheduleInterview(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id, @RequestBody RescheduleInterviewRequest request) {
        return ResponseEntity.ok(hrService.rescheduleInterview(id, request, getCurrentUser(userDetails)));
    }

    @GetMapping("/evaluations")
    public ResponseEntity<List<Evaluation>> getEvaluations(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(hrService.getEvaluations(getCurrentUser(userDetails)));
    }

    @PatchMapping("/evaluations/{id}/decision")
    public ResponseEntity<Evaluation> makeDecision(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id, @RequestBody HrDecisionRequest request) {
        return ResponseEntity.ok(hrService.makeDecision(id, request, getCurrentUser(userDetails)));
    }

    @GetMapping("/interviewers")
    public ResponseEntity<List<User>> getInterviewers() {
        return ResponseEntity.ok(hrService.getInterviewers());
    }
}
