---
title: MEDBOT medical RAG chatbot
outcome: Cut false refusals from 18 of 46 to 0 of 46 questions while keeping a 120-of-120 hallucination guard, with a prompt one fourteenth the size.
role: AI/ML Engineering
stack: [Python, LangChain, Google Gemini, fastembed, FAISS, Streamlit, GitHub Actions]
metrics:
  - { value: "0 / 46", label: "false refusals on answerable questions, down from 18 / 46" }
  - { value: "120 / 120", label: "unanswerable questions correctly refused" }
  - { value: "216", label: "prompt tokens, down from 3,037" }
repo: https://github.com/melvinmathew9991/Medical_RAG_Chatbot
tier: featured
order: 3
---

## The problem

MEDBOT answers plain-language medical questions from a trusted reference, the Gale Encyclopedia of Medicine (Volume 1), instead of from whatever the model happens to remember. It started as a 2024 bootcamp build whose quality claims rested on manual spot-checks. In 2026 I rebuilt it as a measured project: every claim about the prompt is backed by a recorded A/B test with a p-value, and a test that fails if the number moves.

It also had to run with no paid API budget. Generation uses Gemini's free tier (500 requests a day), and embeddings run locally on the CPU, so quota shaped how every experiment was designed.

## What I built

- **Retrieval over the reference.** A FAISS index of 1,225 chunks, built with local fastembed embeddings. Chunking is deterministic, so an interrupted build resumes instead of starting over.
- **Grounded answers with citations.** A LangChain retrieval chain answers from the retrieved passages and shows the source file and page for each one, plus related PubMed, Wikipedia and Google results alongside.
- **An evaluation harness that can't quietly lie.** Refusal trials, an out-of-corpus hallucination guard and claim-level groundedness scoring, with the harness itself audited three times.
- **Reproducibility.** A Dev Container, pinned dependencies, and CI on every push and pull request.

## The finding

The evaluation found the model declining questions whose answers were plainly in the retrieved text. The original prompt refused 18 of 46 answerable questions at least once across five trials.

I tested prompt variants against it. A rewritten instruction with no examples brought refusals to 0 of 46 (Fisher exact p < 0.0001). The danger with fixing refusals is that the model starts inventing answers instead, so every change was also run against 10 topics verified to be absent from the encyclopedia. All 120 of those trials were correctly refused, with zero invented answers.

| Measure | Original prompt | Shipped prompt |
| --- | --- | --- |
| Answerable questions ever refused | 18 / 46 | 0 / 46 |
| Refused trials | 55 / 230 | 0 / 230 |
| Out-of-corpus questions correctly refused | — | 120 / 120 |
| Claim-level groundedness | 0.841 | 0.9917 |
| Prompt size | 3,037 tokens (chain-of-thought version) | 216 tokens |

A chain-of-thought version with examples did equally well but cost 14 times as many tokens, so the short prompt became the default, only after those numbers existed. I also corrected one of my own claims: an earlier sprint said the examples earned their tokens, but a fixed measuring instrument showed they bought no measurable improvement.

## Limitations

- **The corpus is the ceiling.** Volume 1 covers roughly A to B, so many questions simply have no answer in the reference.
- **Retrieval hasn't been tuned.** Precision@4 is 0.8333 and identical across every prompt variant, because all the changes so far were to the prompt.
- **The groundedness judge grades itself.** It needs checking against a human labeller.
- **Not production-ready.** There is no streaming, no persistent chat history, no authentication, and logging is still print statements.

## What I'd do next

1. Tune retrieval (relevance threshold or MMR) and measure it against the evaluation suite rather than assuming it helps.
2. Replace print logging with structured logging and wire up tracing.
3. Add refuse-or-redirect handling for diagnosis, dosing and emergency questions, validated against test cases.
