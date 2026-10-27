# 9 Team lead | PDU session reject after PCF timeout (synthetic example)

> Synthetic data for illustration. No real network, operator or vendor material.

## Conclusion
- PKG-B rejects the session when the SM Policy create response is late; PKG-A applies local policy and continues. [verified] smf_example_masked.log:142
- The SM Policy Association is set up during PDU Session Establishment, and the SMF may apply local policy when dynamic PCC is not deployed. [spec] TS 23.502 §4.3.2.2.1 (step 7)
- Whether the local-policy path should also apply on a PCF timeout is not stated there → vendor inquiry draft. [needs-confirmation]
- TC.FR100.01 added to measure the timeout threshold in both packages. (card 4)

## Gate
| Claim | Member | Source | Result |
|---|---|---|---|
| Reject cause in PKG-B | 7 | smf_example_masked.log:142 | accepted |
| Local policy option in the standard | 1 | TS 23.502 §4.3.2.2.1 | accepted |
| "Same as an older issue" | 2 | none | rejected → [needs-confirmation], ledger line added |
