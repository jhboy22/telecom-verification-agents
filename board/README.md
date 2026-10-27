# Team blackboard

Members (subagents) never talk to each other. Each writes a card file; the team lead (main session) reads and merges them.

## Members

| No. | Member | Definition | Does |
|---|---|---|---|
| 9 | Team lead | `.claude/skills/team-lead` | Dispatch · verification gate · conclusion · error ledger |
| 1 | Standards researcher | `.claude/agents/std-researcher.md` | 3GPP Rel-18 clause text |
| 2 | Knowledge librarian | `.claude/agents/kb-librarian.md` | Past cases · vendor answers · mistake warnings |
| 3 | Mail analyst | `.claude/agents/mail-analyst.md` | Read-only mail triage → issue table → draft next actions |
| 4 | TC designer | `.claude/agents/tc-designer.md` | Test method · TC drafts · CLI syntax check |
| 5 | Material manager | `.claude/agents/librarian-ops.md` | New material · duplicates · index gaps · config integrity |
| 6 | Skill scout | `.claude/agents/skill-scout.md` | Repeated work → rule or skill recommendations (no install) |
| 7 | Call-flow analyst | `.claude/agents/callflow-artist.md` | Logs → message order and timing · diagram |
| 8 | Procedure writer | `.claude/agents/procedure-writer.md` | Install / rollback / collection procedures |

## Cards

- Location: `board/cards/YYYYMMDD_<topic>/<no>_<role>.md` (e.g. `20260101_example/1_std.md`).
- The lead creates the folder and writes `0_request.md` with the request and input paths.
- Each member writes only its own card and reads the others.
- Card format:

```
# <no> <member> | <topic>
## Conclusion (max 3 lines)
## Evidence (one source per claim: TS clause / log file:line / KB path)
## Unknown ([needs-confirmation]; "not in material" if absent)
```

- Size: 20 lines per card (TC code blocks excepted). Do not copy source text at length; leave `file:line`.
- The lead's conclusion is `9_lead.md`, including rejected items.

## Error ledger

`board/error-ledger.md`: one line per user correction or gate rejection. Members read their own lines before every task.
