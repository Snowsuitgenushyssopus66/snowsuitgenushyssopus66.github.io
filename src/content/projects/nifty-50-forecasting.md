---
title: "NIFTY 50 ARIMA/GARCH forecasting audit"
outcome: "Re-tested an earlier ARIMA(6,1,6) model with 87-origin rolling cross-validation: a simple drift model beats ARIMA, auto-ARIMA and ETS, while GARCH(1,1) does capture real volatility clustering."
role: Data Science
stack: ["R", "Python", "statsmodels", "pmdarima", "arch"]
metrics:
  - { value: "92%", label: "of the original model's coefficients insignificant" }
  - { value: "87", label: "rolling-origin evaluation points" }
  - { value: "36", label: "ARIMA specifications grid-searched" }
repo: https://github.com/melvinmathew9991/Nifty_50_ARIMA_GARCH_Forecasting_Model_Audit
tier: archive
status: complete
order: 18
---
