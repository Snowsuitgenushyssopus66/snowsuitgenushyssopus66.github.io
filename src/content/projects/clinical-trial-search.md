---
title: "Clinical trial embedding search"
outcome: "Rebuilt a Word2Vec/FastText tutorial into a measured search system over 10,666 clinical trials, then found the bug blocking release: tied RRF scores broken by dictionary order. Fixing it took known-item MRR@10 to 1.000."
role: AI/ML Engineering
stack: ["Python", "gensim", "BM25", "TF-IDF", "Streamlit", "Docker", "GitHub Actions"]
metrics:
  - { value: "804 \u2192 37.6 MB", label: "model artefacts after bounded-bucket embeddings" }
  - { value: "1,691", label: "relevance judgements" }
  - { value: "609", label: "tests at 88.4% coverage" }
repo: https://github.com/melvinmathew9991/clinical-trial-search
tier: archive
status: complete
order: 9
---
