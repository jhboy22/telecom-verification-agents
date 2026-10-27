---
name: pcap-analysis
description: Summarize PFCP (N4), NGAP (N2) and SBI (HTTP/2) flows from a PCAP with tshark. Use for "pcap analysis", "N4 flow", "NGAP sequence".
---

# pcap-analysis

Requires `tshark` locally. Only text output from tshark is brought into the conversation; the PCAP itself stays local and follows `log-sanitizer` rules.

## Commands (field names vary by tshark version; check with `tshark -G fields | grep <proto>`)
```bash
# Protocol hierarchy overview
tshark -r in.pcap -q -z io,phs
# PFCP (N4)
tshark -r in.pcap -Y pfcp -T fields -e frame.time_relative -e ip.src -e ip.dst -e pfcp.msg_type -e pfcp.cause
# NGAP (N2)
tshark -r in.pcap -Y ngap -T fields -e frame.time_relative -e ip.src -e ip.dst -e ngap.procedureCode
# SBI (HTTP/2)
tshark -r in.pcap -Y http2 -T fields -e frame.time_relative -e ip.src -e ip.dst -e http2.headers.method -e http2.headers.path -e http2.headers.status
```

## Steps
1. Overview → pick protocol, filter by time and IP.
2. Sequence table: time | src→dst | message | cause/status.
3. Interpret failure causes with `log-triage` (TS mapping).
4. Point out missing or delayed messages against TS 23.502 / 29.244 / 38.413 (`3gpp-cite`).

## Rules
- Never read thousands of packets at once. Filter and limit with `head`.
- State that encrypted (TLS) segments cannot be analysed.
