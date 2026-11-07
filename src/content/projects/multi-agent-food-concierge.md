---
title: "Multi-agent food concierge (MCP)"
outcome: "A food assistant over 150 dishes whose filtered search is proven never to return a dish that breaks a diet or allergen constraint. On constrained queries, 21% of the original approach's top-3 results broke one."
role: AI/ML Engineering
stack: ["Python", "LangChain", "MCP", "FAISS", "Qdrant", "BM25", "SQLite", "Prefect", "Langfuse", "fastembed"]
metrics:
  - { value: "0%", label: "constraint violations in filtered search, vs 21% for the original approach" }
  - { value: "100%", label: "allergen recall on all 150 dishes" }
  - { value: "6", label: "read-only MCP tools with access control" }
repo: https://github.com/melvinmathew9991/multi-agent-food-concierge-mcp
tier: archive
status: in-progress
order: 7
---
