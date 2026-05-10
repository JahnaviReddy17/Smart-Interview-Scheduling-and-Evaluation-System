package com.smartinterview.controller;

import com.smartinterview.dto.SubmitEvaluationRequest;
import com.smartinterview.entity.*;
import com.smartinterview.service.InterviewerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/interviewer")
public class InterviewerController {

    private final InterviewerService interviewerService;

    public InterviewerController(InterviewerService interviewerService) {
        this.interviewerService = interviewerService;
    }

    @GetMapping("/interviews")
    public ResponseEntity<List<Interview>> getMyInterviews(Principal principal) {
        return ResponseEntity.ok(interviewerService.getMyInterviews(principal.getName()));
    }

    @PatchMapping("/interviews/{id}/start")
    public ResponseEntity<Interview> startInterview(@PathVariable Long id) {
        return ResponseEntity.ok(interviewerService.startInterview(id));
    }

    @PostMapping("/evaluations")
    public ResponseEntity<Evaluation> submitEvaluation(@RequestBody SubmitEvaluationRequest request, Principal principal) {
        return ResponseEntity.ok(interviewerService.submitEvaluation(request, principal.getName()));
    }
}
