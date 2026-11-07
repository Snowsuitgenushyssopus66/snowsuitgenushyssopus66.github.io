---
title: Customer support agent with eval gate
outcome: A local-LLM support agent measured on a 237-conversation golden set, with a live-model eval gate required on every pull request, 0% tier leakage and 100% retrieval recall.
role: AI/ML Engineering
stack: [Python, LangChain, Ollama, ChromaDB, SQLite, Streamlit]
metrics:
  - { value: "237", label: "hand-labelled golden-set conversations" }
  - { value: "0%", label: "tier leakage" }
  - { value: "513", label: "automated tests" }
repo: https://github.com/melvinmathew9991/customer-support-app
tier: featured
order: 5
---

## The problem

A support agent that answers from the wrong customer's plan, invents steps, or misses a request for a callback is worse than no agent. This one is a LangChain agent whose conversation is an explicit graph rather than a free-form agent, so each stage is constrained:

- **Greeting** identifies the customer by email or phone.
- **Answering** responds from the knowledge base for that customer's subscription tier only.
- **Callback** detects requests to be called back and turns them into a ticket.

It runs fully locally on Ollama (llama3.2:3b) by default, with no API key needed. The product itself already existed with unit tests. My work was making its behaviour measurable and then fixing what the measurements exposed.

## What I built

- **An evaluation harness.** A golden set of 237 hand-labelled conversations across 11 categories, including three held-out groups that are only run after fixes, never developed against.
- **A required CI gate.** Every pull request runs 14 curated golden-set entries against a real Ollama model in GitHub Actions, alongside the unit tests and lint. I proved it with a deliberate tier-scoping break on a throwaway branch, and the gate failed exactly as designed.
- **Retrieval hardening.** Removed contradictions from the knowledge base and made reindexing deterministic. ChromaDB stores the per-tier knowledge bases.
- **Persistence.** A real SQLite user store replaced the mock one through a config change, and conversations are saved after every turn so a reload resumes where it stopped.
- **A measured provider comparison.** I added exact token logging for every LLM call, then ran the same golden set on OpenAI's gpt-4o-mini.

## Results

| Measure | Result |
| --- | --- |
| Answers leaking another tier's content | 0% |
| Retrieval recall | 100% |
| Invented steps, held-out cohort | 0 of 22 |
| Callback detection, full 237-entry set | 94% recall, 96% precision |
| gpt-4o-mini callback precision (135-entry set) | 98%, up from 94% on the local model, for $0.03 per full run |
| Unit tests | 513 passing |

## Where it falls short

I set accuracy targets and committed the held-out questions *before* running them. On the second round of unseen questions, the local model missed all three:

| Target | Goal | Round-2 result |
| --- | --- | --- |
| Callback recall | 90% or more | 77% |
| Callback precision | met in round 1 (100%) | 91% |
| Hallucination | 5% or less | 10% |

gpt-4o-mini meets the callback precision target on the same golden set, so this is a limit of the small local model rather than the design. A larger local model (llama3.1:8b) was tested and did not help overall.

## Limitations

- **Identification is a lookup, not authentication.** Anyone who knows a customer's email or phone number gets that customer's tier. This was a deliberate choice for the demo.
- **The voice path is barely tested.** The speech-to-text route was run live only three times, on two recordings.
- **Not deployed.** Deployment and observability (Sprint 7) haven't been scheduled.
