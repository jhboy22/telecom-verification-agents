---
name: 3gpp-cite
description: Attach a 3GPP Release 18 basis (TS number and clause) to an answer or report. Use for "spec basis", "3GPP reference", "which TS".
---

# 3gpp-cite

## Steps
1. Local first: `specs/INDEX.md` → `specs/rel18/`, Grep for the clause.
2. Not available locally → give the TS number only and mark "clause number needs confirmation".

## Citation format
`TS 23.502 v18.x §4.3.2 (PDU Session Establishment)`. Version and clause only when confirmed.

## Common mapping (document level)
| Topic | TS |
|---|---|
| Architecture | 23.501 |
| Procedures (registration / session) | 23.502 |
| NAS (5GMM/5GSM) | 24.501 |
| NGAP (N2) | 38.413 |
| PFCP (N4) | 29.244 |
| SMF / AMF SBI | 29.502 / 29.518 |
| SBI common, ProblemDetails | 29.500 |
| PCC | 23.503, 29.512 |
| NRF | 29.510 |
| Charging | 32.255 / 32.290 |

## Rules
- Release 18 baseline. State it when another release is meant.
- Vendor extensions are labelled "vendor-specific (non-3GPP), <package>, <document>".
- Never invent a clause number.
