package com.smartinterview.controller;

import com.smartinterview.entity.*;
import com.smartinterview.service.ApplicantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/applicant")
public class ApplicantController {

    private final ApplicantService applicantService;

    public ApplicantController(ApplicantService applicantService) {
        this.applicantService = applicantService;
    }

    @GetMapping("/profile")
    public ResponseEntity<Candidate> getProfile(Principal principal) {
        return ResponseEntity.ok(applicantService.getProfile(principal.getName()));
    }

    @GetMapping("/interviews")
    public ResponseEntity<List<Interview>> getMyInterviews(Principal principal) {
        return ResponseEntity.ok(applicantService.getMyInterviews(principal.getName()));
    }

    @GetMapping("/result")
    public ResponseEntity<Evaluation> getResult(Principal principal) {
        return ResponseEntity.ok(applicantService.getResult(principal.getName()));
    }
}
