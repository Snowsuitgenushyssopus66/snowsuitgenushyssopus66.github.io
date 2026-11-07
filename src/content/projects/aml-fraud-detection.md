---
title: AML fraud detection pipeline
outcome: Ranks 6.36M payment transactions so a 250-a-day review queue catches 95.1% of fraud with zero false positives.
role: AI/ML Engineering
stack: [Python, LightGBM, DuckDB, FastAPI, Docker, Google Cloud Run, Streamlit, GitHub Actions]
metrics:
  - { value: "0.9974", label: "PR-AUC on 0.13% fraud prevalence" }
  - { value: "95.1%", label: "recall at zero false positives, 250 reviews a day" }
  - { value: "234", label: "automated tests" }
repo: https://github.com/melvinmathew9991/aml-fraud-detection-pipeline
demo:
  - { label: "Live API", url: "https://fraud-api-amj2cl4jhq-uc.a.run.app/docs" }
  - { label: "Dashboard", url: "https://aml-fraud-detection-pipeline.streamlit.app/" }
tier: featured
order: 1
---

## The problem

A fraud team can only review so many alerts a day. A model that scores well on a leaderboard metric is not useful unless it fills that fixed review queue with as much real fraud, and as few false alarms, as possible. So the question this project answers is not "how accurate is the model" but "how many reviewers do we need, and what do we lose at each staffing level".

The data is PaySim: 6.36 million simulated mobile-money transactions, of which 0.13% are fraud.

## What I built

A complete decision system, not just a model:

- **Features in SQL.** DuckDB window functions compute per-account history, with every window ending one row *before* the transaction being scored, so no feature can see the future. Inputs are schema-checked with pandera on ingest.
- **Honest model selection.** Eight models across three expanding-window, time-ordered folds, tuned with Optuna and tracked in MLflow. LightGBM was selected.
- **A threshold set by capacity.** The decision threshold comes from how many alerts reviewers can handle per day, not from a default of 0.5.
- **One scoring path.** A versioned, checksummed model bundle feeds a single inference module used by both the FastAPI service and the Streamlit dashboard, so training and serving cannot drift apart.
- **Live deployment.** The API runs on Google Cloud Run, deployed from GitHub Actions with keyless Workload Identity Federation. The dashboard runs on Streamlit Community Cloud.
- **Drift monitoring.** A PSI detector checks every feature and the model score across 31 time windows, and a daily scheduled job probes the deployed service.

## Results

| Measure | Result |
| --- | --- |
| PR-AUC (LightGBM, 3 folds) | 0.9974 ± 0.0045 |
| Recall at 250 reviews/day | 95.1%, with zero false positives |
| Going from 250 to 500 reviews/day | catches the last 208 frauds at 3,835 false positives, about 18 per extra fraud |
| Scoring latency, p95 (local) | 4.9 ms |
| Container image | 367.5 MB, down from 518.9 MB |
| Memory after a scored request | 71.96 MiB, down from 190.7 MiB |
| Automated tests | 234 passing |

## What the data really says

Before trusting the 0.9974, I checked how hard the problem actually is. A three-condition rule on raw columns, with no model at all, flags 8,008 transactions: every one of them fraud, catching 97.5% of all fraud with zero false positives. The model's real contribution on the deployed fold is the last 125 frauds.

The reason is a quirk of the simulator. PaySim writes arithmetically consistent balances for the fraud it creates and leaves most normal transactions inconsistent, so the model's top feature is effectively detecting which part of the simulator wrote the row. The README states this before any accuracy number: on this dataset, the model is a component and the decision system around it is the product.

## Limitations

- **No authentication** on the public API yet.
- **A fixed threshold.** Across the monitoring windows the alert queue swings from 272 to 4,594 a day against a capacity of 500, so the threshold needs to follow volume.
- **Weak model comparison.** The five tree models are statistically tied, and three folds are too few for a significance test to mean much.
- **Simulated data.** PaySim's separability makes the headline metrics a property of the dataset, which is why the project leads with the capacity decision instead.

## What I'd do next

1. Ship the three-condition rule as a documented baseline the model has to beat.
2. Replace the fixed threshold with a rolling percentile, and retrain when queue volume changes.
3. Add API keys with per-key rate limits, plus a feedback endpoint so reviewer decisions flow back into training.
