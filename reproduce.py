"""Reproduce the portfolio's synthetic analyses. Python 3 standard library only."""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def read(path):
    return json.loads((ROOT / path).read_text())

def routing():
    rows = read("data/cases.json")
    assert len({r["id"] for r in rows}) == len(rows)
    assert all(0 <= r["confidence"] <= 1 for r in rows)
    print("TICKET ROUTING — authored synthetic predictions, not a model run")
    for threshold in (0.90, 0.95):
        auto = [r for r in rows if not r["urgent_flag"] and r["confidence"] >= threshold]
        correct = sum(r["predicted_queue"] == r["expected_queue"] for r in auto)
        urgent = sum(r["urgent"] for r in auto)
        print(f"threshold={threshold:.2f}: automated={len(auto)}/{len(rows)}, correct={correct}/{len(auto)}, urgent_misses={urgent}")
        expected = (9, 7, 1) if threshold == .90 else (4, 4, 1)
        assert (len(auto), correct, urgent) == expected


if __name__ == "__main__":
    routing()
