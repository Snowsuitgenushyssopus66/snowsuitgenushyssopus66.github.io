---
title: "Clinical EMR SQL pipeline (MIMIC-III)"
outcome: "A SQL-first pipeline on real ICU records that predicts in-hospital mortality. I caught leakage in my own first model and replaced an inflated 0.770 ROC-AUC with an honest, patient-grouped 0.606."
role: Data Science
stack: ["Python", "SQL", "scikit-learn", "pytest", "GitHub Actions"]
metrics:
  - { value: "0.606", label: "cross-validated ROC-AUC, corrected from 0.770" }
  - { value: "129", label: "ICU admissions from 100 patients" }
  - { value: "19", label: "tests, including a leakage regression guard" }
repo: https://github.com/melvinmathew9991/emr-sql-pipeline
tier: archive
status: complete
order: 13
---
