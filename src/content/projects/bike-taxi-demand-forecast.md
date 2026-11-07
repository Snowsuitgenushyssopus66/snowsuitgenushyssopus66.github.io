---
title: Bike-taxi demand forecast
outcome: Took an inherited forecaster that lost to a naive baseline (MASE 0.999) to one that beats it on all 50 Bengaluru clusters (MASE 0.804).
role: Data Science
stack: [Python, XGBoost, pandas, FastAPI, Docker, Google Cloud Run, Streamlit, GitHub Actions]
metrics:
  - { value: "0.804", label: "MASE vs seasonal-naive, down from 0.999" }
  - { value: "0 / 50", label: "clusters where the model loses to naive" }
  - { value: "352", label: "automated tests" }
repo: https://github.com/melvinmathew9991/Bike-Taxi-Rides-Request-Demand-Forecast
tier: featured
order: 2
---

## The problem

A ride-hailing company positions riders, plans shifts and anticipates surges from a demand forecast. This one came as an inherited pipeline that looked like it worked, with a request to get it ready to deploy. The data is real: about 8.38 million bike-taxi booking requests from Bengaluru, March 2020 to March 2021, forecast for 50 pickup clusters in 30-minute intervals.

Three things about the data make it hard:

- **Lumpy counts.** Average demand is 4.2 rides per slot, the variance is about 11 times the mean, and 35.8% of slots have no rides at all. Ordinary error metrics mislead here.
- **A city that changed under the model.** Demand grew 5.2× across the year as Bengaluru came out of lockdown. Tree models can't extrapolate beyond levels they have seen.
- **Personal data.** Rider IDs joined to exact pickup coordinates can reveal where someone lives and works, so the pipeline keeps that boundary in one place.

## What I found in the inherited code

- **The forecaster didn't forecast.** On a typical horizon it produced 6 rows out of 192, and when its test data was missing it logged "skipping" and still exited successfully.
- **The split hid the trend.** A day-of-month split mixed future and past, concealing the 5.2× growth completely.
- **The settings did nothing.** Configuration was silently ignored, and early stopping never ran because no validation set was passed.
- **The dashboard was invented.** It showed random Poisson numbers and hand-typed arrays as if they were analysis.

## What I built

- **Time-ordered evaluation** with a validation tail for early stopping, and MASE against a seasonal-naive baseline as the deploy gate.
- **Yesterday and last-week lags.** The original lags stopped at 90 minutes, while the baseline used last week's value. Adding the 1-day and 7-day lags is what moved the model from failing the gate to passing it.
- **An automatic deploy gate.** Every training run checks it, and the `biketaxi run` command exits with an error when the model loses to the free baseline.
- **Serving and operations.** A model registry that refuses unverified models and supports rollback, a FastAPI service on Google Cloud Run, a health monitor and a dashboard built on real output.
- **A maintainable codebase.** An installable package with one CLI, data governance and model card documents, and 352 tests that run on a fresh clone with no data.

## Results

| Measure | Before | After |
| --- | --- | --- |
| One-step MASE vs seasonal-naive | 0.999 (fails the gate) | 0.804 (passes) |
| Clusters where the model loses to naive | — | 0 of 50 |
| Rolling-origin MASE, 5 origins | beat naive in 3 of 5 folds (recursive) | 0.771, beats naive in 5 of 5 |
| Recursive 24-hour RMSE | — | 3.72 |

I also cleaned out 156,740 pickups (4.05%) that sat hundreds of kilometres outside Bengaluru, and tested whether weather and holiday data helped. Even a perfect-hindsight weather variant gave no improvement, so it stayed out.

## The constraint that matters most

Rolling-origin tests showed the binding constraint is not the model but how stale it gets. Frozen models hold up for about ten weeks on average, but in the worst case they lose to the free baseline from week six. So the model ships with conditions: retrain at least every four weeks, forecast no more than two days ahead (the CLI and API refuse longer horizons), and fall back to the baseline whenever the gate fails.

Three of my own earlier recommendations were overturned by later evidence, including an early "not deployable" verdict. Each reversal is documented in the project.

## Limitations

- The live API is key-protected, so there is no public demo.
- The model can't predict growth beyond what it has seen, which is why it needs to be retrained regularly.
- The cold-start model (used without lag history) loses to naive by 75%, so it is only a fallback.

