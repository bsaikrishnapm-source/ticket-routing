# Ticket Routing: Automation With Guardrails

**Status:** Completed independent case study. **Domain:** Enterprise service operations. **Demonstrates:** AI product judgment, requirements, evaluation, and release governance.

## Recommendation

Do not release autonomous routing. Start with agent-visible suggestions and mandatory confirmation. A hypothetical confidence threshold of 0.90 routes two tickets to the wrong team and misses an urgent hardware case.

## Scenario

A fictional service desk routes requests to Identity, Network, or Hardware. A triage agent needs faster assignment without quietly sending urgent or ambiguous requests into the wrong queue.

The policy under evaluation sends flagged urgent requests to human review. For other requests, it automatically accepts a suggested queue when confidence meets the threshold. Remaining requests go to review.

## Evaluated results

| Policy threshold | Automated / total | Correct automated / automated | Wrong automated | Urgent cases automated |
| --- | --- | --- | --- | --- |
| 0.90 | 9 / 20 (45%) | 7 / 9 (77.8%) | 2 | 1 |
| 0.95 | 4 / 20 (20%) | 4 / 4 (100%) | 0 | 1 |

The stricter threshold removes the two queue errors but still misses T18, a swollen battery case. A correct queue is not enough: the ticket requires urgent review. Confidence does not substitute for hazard detection.

## Artifacts

- [Product requirements and acceptance criteria](PRD.md)
- [Evaluation rubric, failures, and release memo](EVALUATION.md)
- [20 labeled synthetic cases](data/cases.json)
- [Executable policy evaluation](reproduce.py)

## What this proves—and what it does not

The constructed example demonstrates how a product release decision changes when coverage, accuracy, and critical exceptions are evaluated together. It does not measure any real AI model or estimate production accuracy. Ground-truth labels, predictions, confidence scores, and urgency flags are authored synthetic inputs.

## Next decision

Authorize only an offline evaluation using representative, appropriately approved historical cases. A prospective agent-assist pilot would require verified labels, a tested urgent-review path, and monitoring ownership.

## Run locally

Requires Python 3. No additional packages or API keys are needed.

```bash
git clone https://github.com/bsaikrishnapm-source/ticket-routing.git
cd ticket-routing
python3 reproduce.py
```

[View the full product management portfolio](https://github.com/bsaikrishnapm-source/bsaikrishnapm-source)
