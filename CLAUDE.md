# Telecom Verification Agents — project instructions

> Template. Replace the bracketed parts with your own environment.
> Keep this file short: detailed rules live in `.claude/skills/` and `.claude/agents/`.

## 0. Context

- Team: [your company / team], verifying [vendor] 5G Core software (AMF/SMF/UPF) for [operator].
- Work: SW DVT/SVT test design, execution, Pass/Fail judgment, result reports and vendor inquiries.
- Do not store personal names in files or answers. Keep organization and role only.

## 1. Principles

- Base explanations on 3GPP Release 18, citing TS number and clause.
- Never guess. Anything unconfirmed is marked `[needs-confirmation]`.
- Read only the clauses you need. Do not load whole specs or re-read the same file.

### Spec priority

- 5G procedures: TS 23.502 first. 4G: TS 23.401 first.
- EPC/5GC interworking: TS 23.502 §4.11 → TS 23.501 §5.17 → TS 29.244 (PFCP) → TS 24.501 (NAS).
- Also common: TS 29.512 (N7), TS 29.510 (NRF), TS 38.413 (NGAP).

## 2. Evidence levels (every technical claim carries one)

| Tag | Meaning |
|---|---|
| `[spec]` | Direct 3GPP clause citation (e.g. TS 23.502 §4.3.2) |
| `[verified]` | Observed in a real test, with log file:line |
| `[vendor-confirmed]` | Official vendor QA answer, with source |
| `[needs-confirmation]` | Unconfirmed or inferred |

Vendor-proprietary behaviour is labelled "vendor-specific (non-3GPP)".

## 3. Output format

- Procedures, sequences, commands and JSON/HTTP examples go in code blocks whose first line is `# TC-ID | Title`.
- Corrections are delivered as a complete, copy-ready revised block.
- Raw logs are never modified; analysis goes to a copy or a separate file.

## 4. Skills and team

| Situation | Skill / agent |
|---|---|
| Needs spec + past cases + log/call flow + test method together | `team-lead` (dispatches agents 1–8) |
| 3GPP citation | `3gpp-cite` |
| Log timeline / cause codes | `log-triage` |
| PCAP (PFCP/NGAP/SBI) | `pcap-analysis` |
| Test cases and Pass/Fail judgment | `tc-writer` |
| Past test results and vendor answers | `verified-findings` |
| What to collect when you cannot access the equipment | `evidence-request-checklist` |
| Masking before anything leaves the team | `log-sanitizer` |

Chat commands (hook `team-router.js`): `#analyze` (full team), `#testroom` (TC and judgment only, no subagents), `#direct` / `#all` (one message only), `#learn` (record what this chat confirmed, after approval).

## 5. Environment

- Equipment is not directly accessible. Logs, captures and configs are collected by people → generate the collection list first with `evidence-request-checklist`.
- Material layout: `specs/` (3GPP text), `vendor/` (design docs, CLI reference), `kb/` (knowledge base), `board/` (team blackboard).
