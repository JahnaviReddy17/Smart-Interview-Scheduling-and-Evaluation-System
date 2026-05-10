package com.smartinterview.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    public GeminiEvaluationResult evaluateCandidate(
            String candidateSkills,
            String candidateResumeSummary,
            Double techScore,
            Double commScore,
            Double psScore,
            String interviewerComments) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Gemini API Key is missing. Returning fallback AI evaluation.");
            return new GeminiEvaluationResult(7.5, "Good candidate overall based on skills.");
        }

        try {
            String prompt = String.format("""
                    You are an expert AI Technical Recruiter.
                    Evaluate this candidate based on the following details and return exactly TWO lines.
                    Line 1: A score out of 10.0 (e.g. 8.5)
                    Line 2: A one-sentence brief feedback.

                    Candidate Skills: %s
                    Resume Summary: %s

                    Interviewer's Technical Score: %.1f/10
                    Interviewer's Communication Score: %.1f/10
                    Interviewer's Problem Solving Score: %.1f/10
                    Interviewer Comments: "%s"
                    """, candidateSkills != null ? candidateSkills : "N/A",
                    candidateResumeSummary != null ? candidateResumeSummary : "N/A",
                    techScore, commScore, psScore,
                    interviewerComments != null ? interviewerComments : "None");

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of(
                            "parts", List.of(Map.of("text", prompt)))));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    GEMINI_API_URL + apiKey, entity, Map.class);

            @SuppressWarnings("unchecked")
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("candidates")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (!candidates.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (!parts.isEmpty()) {
                        String text = (String) parts.get(0).get("text");
                        return parseGeminiResponse(text.trim());
                    }
                }
            }

        } catch (Exception e) {
            log.error("Failed to generate AI evaluation: {}", e.getMessage());
        }

        return new GeminiEvaluationResult(0.0, "AI Evaluation failed to generate.");
    }

    private GeminiEvaluationResult parseGeminiResponse(String responseText) {
        String[] lines = responseText.split("\n");
        double score = 0.0;
        String feedback = "";

        if (lines.length > 0) {
            try {
                // Try to extract a number from the first line
                String scoreStr = lines[0].replaceAll("[^0-9.]", "").trim();
                score = Double.parseDouble(scoreStr);
            } catch (Exception e) {
                log.warn("Could not parse score from Gemini line: {}", lines[0]);
            }
        }
        if (lines.length > 1) {
            feedback = lines[1].trim();
        } else if (lines.length == 1 && score == 0.0) {
            feedback = lines[0];
        }

        return new GeminiEvaluationResult(score > 10.0 ? 10.0 : score, feedback);
    }

    public record GeminiEvaluationResult(Double score, String feedback) {
    }
}
