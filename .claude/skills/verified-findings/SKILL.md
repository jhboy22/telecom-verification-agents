---
name: verified-findings
description: Look up or record behaviour already confirmed by testing and official vendor answers. Use before any technical judgment ("was this seen before", "what did the vendor say", recurring issues).
---

# verified-findings

Check this record before answering. Details and flows live in `kb/Wiki/`.
When the user reports a new test result, update only the matching entry and report the change in one line.
Anything not recorded is `[needs-confirmation]`.

## Entry format
```
- <short behaviour statement>. Condition: <package, NF, config>. Source: <log file:line | mail date | wiki page>. [verified | vendor-confirmed]
```

## `[verified]`
- Example: TCP abnormal-close counters spike right after an IP pool is added → check routing for the new pool first (downlink packets not reaching the UE). Source: kb/Wiki/<page>.md. [verified]

## `[vendor-confirmed]`
- Example: a message pushed back during an ongoing procedure is resumed after it completes; check whether the resumed procedure uses a resource (e.g. TEID) before its allocation response arrives. Source: vendor QA answer, kb/Raw/<mail>.md. [vendor-confirmed]

## Rules
- One behaviour per line, with condition and source. No source, no entry.
- When a later package may behave differently, state the package and keep the old entry.
