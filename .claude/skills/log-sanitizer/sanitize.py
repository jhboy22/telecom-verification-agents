"""Mask subscriber identifiers, addresses and secrets in text logs.

usage: python -I sanitize.py <file> [<file> ...]   -> <name>_masked<ext>, <name>_map.json
       python -I sanitize.py --selftest
"""
import json
import re
import sys
from pathlib import Path

HEX = r"[0-9a-fA-F]{1,4}"
# Order matters: prefixed identifiers before the bare 15-digit IMSI, MAC before IPv6.
RULES = [
    ("SECRET", re.compile(r"(?i)\b(password|passwd|pwd|secret|token|api[_-]?key)(\s*[:=]\s*)(\S+)")),
    ("PEI", re.compile(r"(?i)\bimei(?:sv)?-\d{14,16}\b")),
    ("GPSI", re.compile(r"(?i)\bmsisdn-\d{10,15}\b")),
    ("SUPI", re.compile(r"(?i)\bimsi-\d{15}\b|\b\d{15}\b")),
    ("MAC", re.compile(r"\b(?:[0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}\b")),
    # ponytail: requires "::" or 8 groups so HH:MM:SS timestamps survive; add a real parser if odd forms slip through.
    ("IP6", re.compile(rf"(?<![\w:])(?:(?:{HEX}:){{7}}{HEX}|(?:{HEX}:)*{HEX}?::(?:{HEX}:)*{HEX}?)(?![\w:])")),
    ("IP", re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b")),
]


def sanitize(text):
    mapping, counts = {}, {}

    def token(kind, value):
        key = f"{kind}:{value}"
        if key not in mapping:
            counts[kind] = counts.get(kind, 0) + 1
            mapping[key] = f"{kind}_{counts[kind]}"
        return mapping[key]

    for kind, rx in RULES:
        if kind == "SECRET":
            text = rx.sub(lambda m: m.group(1) + m.group(2) + "***", text)
        else:
            text = rx.sub(lambda m, k=kind: token(k, m.group(0)) if len(m.group(0)) > 2 else m.group(0), text)
    return text, {v: k.split(":", 1)[1] for k, v in mapping.items()}


def selftest():
    src = ("12:34:56 SMF imsi-450001234567890 from 10.1.2.3 to 10.1.2.3 "
           "mac aa:bb:cc:dd:ee:ff v6 2001:db8::1 msisdn-821012345678 "
           "imei-35123456789012 password=hunter2 cause=26")
    out, m = sanitize(src)
    assert "12:34:56" in out and "cause=26" in out, out
    assert out.count("IP_1") == 2 and "IP_2" not in out, out
    for leak in ("450001234567890", "10.1.2.3", "aa:bb", "2001:db8", "821012345678", "35123456789012", "hunter2"):
        assert leak not in out, leak
    assert m["SUPI_1"] == "imsi-450001234567890"
    print("selftest ok")


def main(paths):
    for p in map(Path, paths):
        out, m = sanitize(p.read_text(encoding="utf-8", errors="replace"))
        p.with_name(f"{p.stem}_masked{p.suffix}").write_text(out, encoding="utf-8")
        p.with_name(f"{p.stem}_map.json").write_text(json.dumps(m, indent=1, ensure_ascii=False), encoding="utf-8")
        kinds = {}
        for t in m:
            kinds[t.rsplit("_", 1)[0]] = kinds.get(t.rsplit("_", 1)[0], 0) + 1
        print(p.name, kinds or "nothing masked")


if __name__ == "__main__":
    if sys.argv[1:] == ["--selftest"]:
        selftest()
    elif sys.argv[1:]:
        main(sys.argv[1:])
    else:
        sys.exit(__doc__)
