---
title: A/B testing toolkit
outcome: Showed that moving the Cookie Cats gate to level 40 cut day-7 retention by 4.31% across 90,189 players, so the change should not ship.
role: Data Science
stack: [Python, SciPy, pandas, FastAPI, Streamlit, Plotly, Docker]
metrics:
  - { value: "−4.31%", label: "day-7 retention, BH-adjusted p = 0.0047" }
  - { value: "90,189", label: "players analysed" }
  - { value: "3.88%", label: "minimum detectable effect" }
repo: https://github.com/melvinmathew9991/ab-testing-platform
tier: featured
order: 6
---

## The problem

An A/B test answers one question: did the change help, and should we ship it? The statistics aren't the hard part. The discipline around them is, and it's what teams without an experimentation platform tend to skip: checking the traffic split before reading results, correcting for testing several metrics at once, and not reporting a flat result as "no effect" when the test couldn't have detected one.

This toolkit builds that discipline in as defaults, then proves the point on a real experiment: the Cookie Cats mobile game test that moved the first gate from level 30 to level 40, with 90,189 players. The naive read is "no significant difference". The correct read is a day-7 retention drop that survives correction.

## What I built

One statistical library, delivered three ways, a command-line tool, a FastAPI service and a Streamlit interface, all returning the same numbers:

- **Trust checks first.** Five checks, including sample-ratio mismatch, run before any result can be read. A failed critical check makes the answer unusable everywhere, not a footnote.
- **The full metric family.** Two-proportion z-tests and Welch's t-tests, 10,000-draw bootstrap intervals, permutation tests, Benjamini-Hochberg correction across metrics, and a Bayesian check.
- **Planning tools.** Sample-size and sensitivity calculations, plus sequential testing boundaries for experiments that are checked as they run.
- **Verified against references, not recorded output.** Welch's test matches SciPy to 1e-12, and six calibration tests simulate A/A experiments to confirm the false-positive rate really is 5% end to end.

## Results

**The finding: do not ship gate 40.**

| Metric | Gate 30 | Gate 40 | Change | p (BH-corrected) | Verdict |
| --- | --- | --- | --- | --- | --- |
| Day-1 retention | 44.82% | 44.23% | −1.32% | 0.1116 | no effect |
| Day-7 retention | 19.02% | 18.20% | −4.31% | 0.0047 | regression |
| Game rounds (capped at 99th percentile) | 49.14 | 48.85 | −0.57% | 0.6152 | no effect |

The Bayesian route agrees: the probability that gate 40 is better on day-7 retention is 0.00097.

Three things a naive analysis would get wrong:

- **One player distorted engagement.** Raw average rounds differ by −2.21%. Remove a single account with 49,854 rounds (the median is 16) and the gap almost disappears. Capping at the 99th percentile keeps every player in their group and gives −0.57%.
- **90,000 players isn't automatically "enough".** This test could detect a 3.88% change in day-7 retention at 80% power, and the observed −4.31% only just clears it. Detecting a 2% change would need 336,718 players. The day-1 result isn't evidence of no effect; the test couldn't have seen a small one.
- **Checking daily would have misled.** Replayed as eight interim looks, a fixed p < 0.05 threshold "fires" at every look, even at 12.5% of traffic, where the proper sequential boundary requires a much stronger signal.

The traffic split is 49.56% / 50.44% (p = 0.0086). That fails a naive 0.05 threshold, so the check uses a stricter 0.001 and reports the imbalance openly rather than hiding it.

## Limitations

- **Not deployed.** The Cloud Run deployment is scripted and syntax-checked but has never been run.
- **Two variants only,** and no ratio metrics with a varying denominator.
- **One dataset.** Every end-to-end claim rests on Cookie Cats.
- **Tests.** 186 are collected, but 4 need a running API and never execute in CI, so 182 run.
- **An open defect** I recorded against my own work: small segments are silently skipped in segment analysis.

## What I'd do next

1. Record skipped segments so the output says what wasn't tested.
2. Run the deployment, with a budget alert, and tune it from what a real instance shows.
3. Add delta-method variance for ratio metrics and multi-arm support.
