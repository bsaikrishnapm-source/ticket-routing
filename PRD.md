# Product Requirements — Assisted Ticket Routing

## Problem and user

Service-desk triage agents must choose an ownership queue while recognizing ambiguous and urgent requests. The scenario assumes manual assignment delays useful work; this is a hypothesis, not observed customer research.

## Goal and non-goals

Goal: reduce triage effort while preserving queue quality and urgent escalation.
Non-goals: autonomous incident resolution, changing access permissions, producing diagnostic certainty, or replacing established incident escalation policies.

## First release

Offer one queue suggestion with supporting ticket text, an uncertainty indicator, and explicit Accept / Change / Escalate actions. All suggestions require human confirmation. Show “No suggestion available” on timeout or malformed response; keep manual assignment functional.

| Requirement | Acceptance criterion |
| --- | --- |
| Queue allowlist | A suggestion outside Identity, Network, Hardware is rejected and logged |
| Human confirmation | Opening a ticket or viewing a suggestion never changes ownership |
| Urgent review | A detected security, outage, or physical-safety concern displays an escalation action and blocks automatic assignment |
| Manual override | An agent can change the queue and record a reason before submission |
| Idempotency | Retrying a confirmed assignment with the same request key produces one recorded change |
| Stale state | If ownership changed after the ticket was loaded, submission asks the agent to refresh |
| Auditability | Record ticket reference, policy version, suggested queue, decision, timestamp, and override reason |
| Access boundary | Retrieve only tickets the agent is authorized to view; do not place full ticket bodies in analytics events |

## Metrics

Primary prospective pilot metric: median triage time from ticket opened to confirmed assignment, compared with a concurrent control.
Quality guardrails: reassignment within 24 hours, urgent escalation misses, and override reasons. Track suggestion availability separately so missing suggestions cannot inflate acceptance rates.

Proposed pilot target: at least 15% lower median triage time without more than a one-percentage-point increase in 24-hour reassignments. Any confirmed urgent escalation miss pauses the pilot. These are design targets, not observed results.

## Operational flow

Ticket opened → authorized context loaded → suggestion validated → agent reviews → confirmed assignment → audit event. Any failure returns to manual triage. An urgent concern branches into the existing escalation workflow.

## Delivery and rollback

Product owns release criteria; service operations owns labels and escalation policy; engineering owns validation and audit events. Begin in an internal sandbox, then offline replay, then a consented agent-assist pilot if gates pass. Disable suggestions with a feature flag on critical errors while preserving manual triage.

## Key trade-off

Mandatory confirmation limits speed gains but makes uncertainty visible and preserves operational control. Do not expose an uncalibrated score as a probability of correctness.
