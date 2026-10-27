---
name: tc-writer
description: Write test case documents and result files, or complete a TC after the fact from CLI logs. Use for "write a TC", "organize test results", "Pass/Fail judgment", "complete TC from log".
---

# tc-writer

> Before starting, read the member-4 lines in `board/error-ledger.md`.

## Format
- Steps, sequences, commands, JSON/HTTP examples are always code blocks.
- First line of every TC or result block: `# TC-ID | Title`.
- No prose numbered lists. Tables are markdown tables.
- Corrections come as a complete copy-ready block, not an explanation.

## TC IDs
- Feature TC: `TC.FR<nnn>.<seq>` (e.g. TC.FR120.01)
- Change-note TC: `<PKG>_CN<nnn>_TC<seq>`

## File layout
- File name: `YYYYMMDD_<FR>_<case>_<summary>.txt` (no special characters, spaces → `_`).
- Sections: 1. Test conditions (package / environment / simulator) → 2. Scenario → 3. TC content (preconditions / input / execution / expected result) → 4. Test result → 5. Test log.
- One file per test case. Give a file-name block (file name only) and a TC block for each case. Never merge cases into one block.
- A result block has `[Test result]` on its second line, so it can be pasted under section 4 as is.
- Raw logs are never modified. Analysis goes to a separate file.

## Log-based completion
1. Receive logs → `log-triage` for timeline and causes → Pass/Fail with log line evidence.
2. Complete the TC. Commands and parameters only from the CLI reference. Cite the requirement document when scope or expected result comes from it.
3. Compare with `verified-findings`; propose a new record if the behaviour is new.

## Judgment
- Windows where a control turns on mid-interval are judged with a time-weighted expected value, not the steady-state value.
- Untested items and constraints are listed, never hidden.
- Evidence levels: `[spec]` / `[verified]` / `[vendor-confirmed]` / `[needs-confirmation]`.
