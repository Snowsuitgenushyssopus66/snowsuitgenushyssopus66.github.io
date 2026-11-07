---
title: Credit default model audit
outcome: Proved that 85% of a 0.927-Gini credit model came from data unavailable at application time, then rebuilt it to an honest Gini of 0.2914.
role: Data Science
stack: [Python, LightGBM, scikit-learn, Hyperopt, SHAP, pandas, GitHub Actions]
metrics:
  - { value: "0.2914", label: "hold-out Gini after removing leakage" }
  - { value: "5.66%", label: "bad rate at a 555-point cutoff, down from 8.71%" }
  - { value: "243", label: "automated tests" }
repo: https://github.com/melvinmathew9991/credit-default-risk-model-audit
tier: featured
order: 4
---

## The problem

A credit default model ranks loan applicants by their risk of not repaying, so a lender can decline the riskiest and price the rest. Here the target is first-payment default: 60 or more days past due within the first three EMIs.

The project arrived as a LightGBM model reporting 0.9636 AUC on an out-of-time hold-out, a Gini of 0.927. That number isn't attainable on a credit application, and nothing in the project would have told anyone so. I treated it as a validation exercise: reproduce the result exactly, then find out how much of it was real.

## What I did

1. **Reproduced it exactly.** The original pipeline was rerun unchanged and matched the notebook to fifteen decimal places, including the 3,041 trees. That fidelity is what makes the next step credible.
2. **Ran a counterfactual.** Same hyperparameters, with only the feature set changed. With application-time features only, validation Gini fell from 0.9401 to 0.4252.
3. **Proved the leak.** The data dictionary described three repayment columns as prior-loan history, but 99.59% of rows had zero prior loans, and almost all of those still showed payments. Those columns were recorded after the loan was issued.
4. **Rebuilt it under governance enforced in code.** A policy function blocks any feature that isn't classified, including protected and restricted attributes. Splits are time-based, with repeat customers handled and the hold-out scored exactly once.
5. **Added a challenger.** A four-feature weight-of-evidence logistic scorecard was fitted on the same data, so the gradient-boosted model has to earn its complexity.
6. **Made it usable.** The output is a calibrated probability of default, score points, approve or decline, and up to four reason codes, plus a monitoring script that checks each new month against a baseline.

## Results

What each change cost, one step at a time:

| Step | Validation Gini | Change |
| --- | --- | --- |
| As originally built | 0.9222 | — |
| Remove post-origination fields | 0.3273 | −0.5949 |
| Remove marital status and pincode | 0.3276 | +0.0003 |
| Remove restricted alternative data | 0.3285 | +0.0010 |
| Fix a placeholder artefact | 0.2929 | −0.0357 |
| Handle repeat customers | 0.3051 | +0.0122 |

96% of everything lost was the leakage. Removing every protected and restricted attribute cost nothing: it improved Gini slightly.

On the May 2022 hold-out (26,607 applications, 8.71% bad), scored once:

| Model | AUC | Gini | KS |
| --- | --- | --- | --- |
| Champion: LightGBM, calibrated | 0.6457 | 0.2914 | 0.2141 |
| Challenger: 4-feature scorecard | 0.6348 | 0.2696 | 0.1999 |

Walk-forward cross-validation gave AUC 0.6423 ± 0.0054, and the hold-out landed inside that band.

**The business decision.** For a 6% target bad rate, the cutoff is 555 points. That approves 55% of applicants and brings the book's bad rate from 8.71% to 5.66%, a 35% reduction that avoids 1,489 of 2,318 defaults, at the cost of declining 10,484 good customers.

## Limitations

- **It's a weak model, honestly measured.** Only four features carry any information, and none is strong. The biggest available improvement is credit bureau data, which isn't a modelling change.
- **Five months of data.** One month of out-of-time evidence is thin, and there's no seasonal coverage.
- **Fairness can only be avoided, not measured.** There's no demographic data to test for disparate impact.
- **No reject inference,** so the model is biased relative to the applicants it would actually see.
- **Not approved for deployment.** The reason-code wording needs legal review before any real decline notice.

## What I'd do next

1. Confirm when the four repayment fields are recorded with the data owner.
2. Fix the placeholder encoding at the source, so "0" and "0.0" stop meaning "missing".
3. Add bureau data, the single largest improvement available.
