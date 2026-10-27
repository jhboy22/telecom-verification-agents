---
name: log-triage
description: Build a time-ordered timeline and cause-code table from AMF/SMF/UPF logs. Use for "log analysis", "timeline", "cause code", "why did it fail".
---

# log-triage

> Before starting, read the member-7 lines in `board/error-ledger.md`.

Input is a sanitized log. If it is raw, run `log-sanitizer` first.

## Steps
1. Large files: never read whole. Grep by time window, SUPI token, PDU Session ID, `error|fail|reject|cause|timeout`.
2. Sort the hits by time → timeline table (time | NF | message / event | result).
3. Extract the cause at the failure point and confirm its meaning in the standard:
   - 5GSM / 5GMM cause: TS 24.501
   - NGAP cause: TS 38.413
   - PFCP cause: TS 29.244
   - SBI ProblemDetails: TS 29.500 / service TS
   - Vendor-specific codes: vendor documents; if absent, "vendor code, needs confirmation".
4. Up to 3 root-cause hypotheses, each with its log lines and the extra evidence needed (`evidence-request-checklist`).

## Output
1. Summary (1–2 lines) 2. Timeline table 3. Cause table (code | meaning | TS) 4. Hypotheses / evidence needed

## Rules
- Nothing that is not in the log. Every line carries its line number or timestamp.
- Clause numbers only when certain; otherwise document number only.
