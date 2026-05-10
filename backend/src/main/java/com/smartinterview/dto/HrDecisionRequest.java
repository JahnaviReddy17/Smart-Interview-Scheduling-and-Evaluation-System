package com.smartinterview.dto;

import com.smartinterview.entity.Evaluation;

public class HrDecisionRequest {
    private Evaluation.HrDecision decision;

    public HrDecisionRequest() {}

    public Evaluation.HrDecision getDecision() { return decision; }
    public void setDecision(Evaluation.HrDecision decision) { this.decision = decision; }
}
