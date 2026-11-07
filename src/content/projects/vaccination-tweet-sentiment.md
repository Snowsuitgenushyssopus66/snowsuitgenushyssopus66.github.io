---
title: "Vaccination tweet sentiment analysis"
outcome: "Fixed a leakage bug and two preprocessing bugs in a classifier for about 11K vaccine tweets, then showed sentiment tools agree on only 57\u201358% of labels, so labels, not models, were the limit."
role: Data Science
stack: ["Python", "scikit-learn", "NLTK", "TextBlob", "VADER"]
metrics:
  - { value: "34% \u2192 51%", label: "negative-class recall after fixes" }
  - { value: "4", label: "classifiers compared on macro-F1" }
repo: https://github.com/melvinmathew9991/Vaccination_Tweet_Sentimental_Analysis
tier: archive
status: complete
order: 20
---
