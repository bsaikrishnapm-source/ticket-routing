# Evaluation and Release Memo

## Method

Use the 20 authored records in data/cases.json. Expected queue is the scenario label. Confidence and predicted queue are fictional classifier outputs. Urgent is the expected safety label; urgent_flag is a simulated detector output. They differ intentionally for T18.

Policy: urgent_flag means review; otherwise confidence at or above the threshold means automatic assignment. Everything else is reviewed.

Metrics:
- Coverage = automated cases / all cases.
- Selective queue accuracy = correctly assigned automated cases / automated cases.
- Urgent miss = an urgent case allowed through automation.
- Detector recall = flagged urgent cases / urgent cases = 4/5 = 80%.

## Error analysis

| Cases | Failure | Product implication |
| --- | --- | --- |
| T10, T11 | High-confidence Network suggestions for Identity problems | Confidence is not calibrated evidence; inspect identity/network ambiguity |
| T18 | Correct Hardware queue but missing urgency flag | Queue accuracy hides a critical operational failure |
| T12 | Wrong suggestion below the threshold | Human review contains this example; measure agent correction behavior next |

## Threshold sensitivity

At 0.90, nine cases automate, seven queue labels match, and T18 still needs urgent review. At 0.95, only four cases automate and all queue labels match, but T18 still passes. Raising the threshold trades coverage for apparent accuracy without fixing urgency.

## Release gates

Before an agent-assist pilot, collect representative authorized cases, independently review labels, preserve a holdout set, and test missing fields, outages, permission denial, and replayed submissions. Do not tune the policy against the holdout.

Before considering any future automatic routing: zero critical misses in the agreed test suite, calibrated confidence, queue accuracy with uncertainty bounds, evidence across segments, and a tested rollback procedure. A small error-free sample is not a production guarantee.

## Decision

No-go for autonomous routing. Proceed only with a design review of the agent-assist PRD and a properly scoped offline evaluation. No production trial or business improvement is claimed.
