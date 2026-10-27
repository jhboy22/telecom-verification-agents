---
name: evidence-request-checklist
description: When the equipment cannot be accessed directly, produce the full list of commands and logs to request from on-site staff before analysis. Use for "what should we collect", "which commands to check", "evidence request".
---

# evidence-request-checklist

Goal: one complete request to on-site staff, minimizing round trips.

## Steps
1. Classify the symptom: L1/L2 (VLAN, ARP, BFD) / L3 (BGP, routing) / N4 (PFCP) / N2 (NGAP) / SBI / session (PDU).
2. Output the matching rows below plus the common items. Vendor CLI commands only if confirmed in `vendor/cli/`; otherwise "needs confirmation".
3. Remind that collected material goes through `log-sanitizer` before leaving the team.

## Always request
- Time of occurrence (time zone, range), target node, package version
- Changes just before (config / patch / test step)
- Logs ±10 minutes around the event

## By symptom
| Symptom | Evidence |
|---|---|
| BFD flap / down | BFD session state and timers, interface counters, peer router BFD state, logs |
| ARP / gateway MAC mismatch | ARP tables on both ends, interface MAC, VLAN config, gateway MAC table |
| N4 (PFCP) failure | PFCP session / association state, PFCP PCAP for the window, error cause |
| N2 (NGAP) failure | NGAP PCAP, AMF log, UE context |
| PDU session failure | SMF log (SUPI masked), N4/N11 messages, cause code |
| Performance / counters | Counter values before and after (delta) |

## Output
Table `no | node | item | format (screen / text / PCAP) | reason` plus one masking reminder line.
