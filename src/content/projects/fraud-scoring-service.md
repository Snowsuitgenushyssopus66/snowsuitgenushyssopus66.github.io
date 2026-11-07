---
title: "Fraud scoring service"
outcome: "Built the full production path for a fraud model: API, Postgres audit trail, dashboard and a five-job CI pipeline. Then showed its 0.9961 ROC-AUC came from the synthetic data: amount alone scores 0.9766."
role: AI/ML Engineering
stack: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "scikit-learn", "Streamlit", "Docker", "GitHub Actions"]
metrics:
  - { value: "16 / 16", label: "tests passing" }
  - { value: "0.9766", label: "AUC from transaction amount alone, no model" }
  - { value: "5", label: "CI jobs, including live container smoke tests" }
repo: https://github.com/melvinmathew9991/fraud-scoring-service
tier: archive
status: not-deployed
order: 12
---
