# Telecom Verification Agents

A Claude Code setup that works like a small 5G Core verification team: 9 roles, 8 skills, 2 hooks and a shared blackboard.
It is built for engineers who verify AMF/SMF/UPF software releases before they reach a live mobile network.

It was extracted from a toolkit used daily on commercial 5G Standalone core verification cycles.
Everything operator- or vendor-specific has been removed. You plug in your own specs, CLI reference and logs.

## Why

Verification engineers in a mobile core have to read four things side by side: the 3GPP specs, vendor design documents, the vendor CLI reference and raw equipment logs.
A general chat assistant mixes these up, guesses clause numbers and invents CLI parameters.
This setup forces every claim to carry a source and an evidence level, and it turns each user correction into a rule so the same mistake does not happen twice.

## What is inside

```
.claude/
  skills/
    team-lead/                  # 9: orchestrator + verification gate
    3gpp-cite/                  # TS / clause citation, Release 18 baseline
    log-triage/                 # timeline + cause codes (24.501, 38.413, 29.244, 29.500)
    pcap-analysis/              # tshark recipes for PFCP / NGAP / SBI
    tc-writer/                  # TC format, one file per case, Pass/Fail with log evidence
    verified-findings/          # record of test-confirmed and vendor-confirmed behaviour
    evidence-request-checklist/ # what to ask on-site staff when you cannot log in
    log-sanitizer/              # SUPI/GPSI/PEI/IP/MAC/secret masking (+ sanitize.py)
  agents/                       # members 1-8
  hooks/
    team-router.js              # chat commands + keyword routing to skills and members
    correction-memo.js          # user corrections -> error ledger -> agent rules
  settings.json
board/
  README.md                     # card format and member table
  error-ledger.md               # every correction, by member number
  templates/procedure.md
  cards/20260101_example_pdu_reject/  # synthetic example
CLAUDE.md                       # project instructions template
```

## The team

| No. | Member | Role |
|---|---|---|
| 9 | Team lead (main session) | Dispatches members, runs the verification gate, writes the conclusion |
| 1 | Standards researcher | Finds the 3GPP Rel-18 clause that defines expected behaviour |
| 2 | Knowledge librarian | Finds past test results, vendor answers and recorded mistakes |
| 3 | Mail analyst | Read-only mail triage, issue table, draft next actions |
| 4 | TC designer | Designs tests for each difference; checks CLI syntax against the reference |
| 5 | Material manager | New material, duplicates, index gaps, config integrity (report only) |
| 6 | Skill scout | Turns repeated work into rule or skill recommendations (never installs) |
| 7 | Call-flow analyst | Extracts message order and timing from logs and PCAPs |
| 8 | Procedure writer | Install / rollback / evidence-collection procedures |

Members never talk to each other. Each writes one card in `board/cards/<date>_<topic>/`; the lead merges them.

## How a request flows

```
user request
  -> 0_request.md            (lead: request, inputs, known paths)
  -> 1_std.md + 2_kb.md      (in parallel)
  -> 7_flow.md               (when logs arrive)
  -> 9_lead.md               (gate: every claim needs TS clause / log file:line / KB path)
  -> 4_tc.md                 (tests for the differences found)
  -> answer: conclusion, call flow, spec basis, test method, mail drafts (never sent automatically)
```

## Evidence levels

| Tag | Meaning |
|---|---|
| `[spec]` | Direct 3GPP clause citation |
| `[verified]` | Observed in a real test, with log file:line |
| `[vendor-confirmed]` | Official vendor QA answer |
| `[needs-confirmation]` | Unconfirmed or inferred |

A claim with no source is sent back once. If it still has none, it ships as `[needs-confirmation]`, never as fact.

## Chat commands

| Command | Effect |
|---|---|
| `#analyze` | This chat dispatches the full team (1, 2, 5 then 4, 7) |
| `#testroom` | This chat does TC design and judgment only, no subagents |
| `#direct` / `#all` | Override for one message |
| `#learn` | Proposes what to record from this chat (findings, ledger, rules); writes after approval |

Without a command, `team-router.js` matches the request to skills and decides the team size.

## Getting started

1. Copy `.claude/`, `board/` and `CLAUDE.md` into your project.
2. Fill the bracketed parts of `CLAUDE.md`.
3. Put your material in the paths the agents expect: `specs/rel18/` (3GPP text, with `specs/INDEX.md`), `vendor/cli/` (CLI reference), `kb/` (your knowledge base).
4. Check the sanitizer: `python -I .claude/skills/log-sanitizer/sanitize.py --selftest`.
5. Open Claude Code and try: `#analyze why is PDU session establishment rejected in logs/<file>`.

Requirements: Claude Code, Node.js (hooks), Python 3 (sanitizer), tshark (PCAP skill, optional).

## Safety rules built in

- Raw logs are never modified; analysis goes to copies.
- Anything leaving the team goes through `log-sanitizer`; the mapping file is git-ignored.
- Mail is read-only; replies are drafts the user sends.
- Agents never move, delete or install; they propose and the lead acts after approval.
- CLI commands come only from the vendor reference, never from memory.

## License

MIT
