---
name: log-sanitizer
description: Mask sensitive data in logs, configs or PCAP text before analysis or sharing. Use for "mask", "remove sensitive info", "before sending logs".
---

# log-sanitizer

Required before anything leaves the team. The original is never modified; a `*_masked.*` copy is created.

```bash
python -I .claude/skills/log-sanitizer/sanitize.py <input> [<input> ...]
```

Writes `<name>_masked<ext>` and `<name>_map.json` next to each input. The map file is never shared.

## Masked by default
| Item | Token |
|---|---|
| IPv4 / IPv6 | `IP_n` / `IP6_n` (same value → same token) |
| IMSI / SUPI | `SUPI_n` |
| MSISDN / GPSI | `GPSI_n` |
| IMEI / PEI | `PEI_n` |
| MAC | `MAC_n` |
| password / secret / key / token values | `***` |

## Kept (needed for analysis)
Cause codes, timestamps, PDU Session ID, VLAN ID, ports, message names, NF type.

## Steps
1. Run the script.
2. Report remaining suspicious strings (host names, node names) and ask the user whether to mask them.
3. Report counts per item.

## Rules
- Never quote unmasked content in the conversation.
