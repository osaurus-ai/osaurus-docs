---
title: Benchmarks
sidebar_label: Benchmarks
description: Performance and memory quality benchmarks comparing Osaurus with other local LLM servers
---

# Performance Benchmarks

Comprehensive performance analysis of Osaurus compared to other local LLM solutions on Apple Silicon.

## Methodology

All benchmarks were conducted under controlled conditions to ensure fair comparison:

- **Hardware:** Apple M2 Pro, 32GB RAM
- **macOS Version:** 15.5
- **Model:** Llama 3.2 3B Instruct (4-bit quantization)
- **Prompt:** "Explain quantum computing in simple terms"
- **Settings:** Default configuration for each server
- **Measurements:** 20-run average, excluding first run

## Key Metrics

### Time to First Token (TTFT)

The time from request to first token generation—critical for perceived responsiveness.

| Server    | TTFT (ms) | Relative |
| --------- | --------- | -------- |
| Ollama    | **33ms**  | 1.0×     |
| Osaurus   | 87ms      | 2.6×     |
| LM Studio | 113ms     | 3.4×     |

### Throughput

Characters generated per second during streaming.

| Server    | Throughput      | Relative |
| --------- | --------------- | -------- |
| LM Studio | **588 chars/s** | 1.06×    |
| Osaurus   | 554 chars/s     | 1.0×     |
| Ollama    | 430 chars/s     | 0.78×    |

### End-to-End Latency

Total time from request to completion.

| Server    | Total Time | Relative |
| --------- | ---------- | -------- |
| LM Studio | **1.22s**  | 1.0×     |
| Osaurus   | 1.24s      | 1.02×    |
| Ollama    | 1.62s      | 1.33×    |

## Optimization Tips

Based on benchmark results:

1. **For Speed**

   - Use 4-bit quantization
   - Choose smaller models (2-3B)
   - Limit context to 2048 tokens
   - Disable logging in production

2. **For Quality**

   - Use 8-bit quantization when possible
   - Select 7B+ models
   - Allow full context windows
   - Enable temperature sampling

3. **For Efficiency**
   - Keep 1-2 models loaded
   - Use model aliases for quick switching
   - Monitor memory pressure
   - Restart periodically for long-running servers

## Conclusions

Osaurus demonstrates:

- **Competitive Performance** — Matches or exceeds alternatives in key metrics
- **Efficient Memory Usage** — Lower RAM footprint than competitors
- **Consistent Latency** — Predictable performance under load
- **Native Optimization** — Leverages Apple Silicon effectively

The benchmarks show Osaurus is particularly well-suited for:

- Production deployments requiring consistent performance
- Memory-constrained environments
- High-throughput applications
- Native macOS integrations

---

## Memory Quality — LoCoMo Benchmark

We evaluate [memory](/memory) quality using the [LoCoMo benchmark](https://arxiv.org/abs/2401.15665) (ACL 2024) via [EasyLocomo](https://github.com/playeriv65/EasyLocomo). LoCoMo tests how well systems recall facts, events, and relationships from multi-session conversations spanning weeks to months.

Osaurus uses a **no-context evaluation mode** where the LLM receives no conversation transcript — only the memory context assembled by the retrieval system. The `X-Osaurus-Agent-Id` header routes each question to the correct agent's memory store. This tests pure memory retrieval quality rather than full-context recall.

### LoCoMo Leaderboard

| System | F1 Score |
|--------|----------|
| MemU | 92.09% |
| CORE | 88.24% |
| Human baseline | ~88% |
| Memobase | 85% (temporal) |
| Mem0 | 66.9% |
| **Osaurus (Gemini 2.5 Flash)** | **57.08%** |
| OpenAI Memory | 52.9% |
| GPT-3.5-turbo-16K (no memory) | 37.8% |
| GPT-4-turbo (no memory) | ~32% |

### Osaurus Breakdown by Category

| Category | Count | F1 Score |
|----------|-------|----------|
| Open-domain | 841 | 61.44% |
| Adversarial | 446 | 90.36% |
| Multi-hop | 282 | 41.94% |
| Temporal | 321 | 23.16% |
| Single-hop | 96 | 22.10% |
| **Overall** | **1,986** | **57.08%** |

### Running the Benchmark

```bash
# 1. Set up EasyLocomo (clones repo, applies patch, creates venv)
make bench-setup

# 2. Configure .env in benchmarks/EasyLocomo/
echo 'OPENAI_API_KEY=osaurus' > benchmarks/EasyLocomo/.env
echo 'OPENAI_API_BASE=http://localhost:1337/v1' >> benchmarks/EasyLocomo/.env

# 3. Ingest LoCoMo data (full extraction — takes several hours, only needed once)
make bench-ingest

# 4. Fast chunk re-ingestion (no LLM calls — use after code changes)
make bench-ingest-chunks

# 5. Run evaluation
make bench-run
```

:::tip
You may want to temporarily increase token budgets in the memory configuration file (`~/.osaurus/config/memory.json`) before running benchmarks. The default production budgets are tuned for everyday use, not maximal recall.
:::

---

<p align="center">
  To contribute benchmarks, join the <a href="https://discord.gg/dinoki">Discord community</a>.
</p>
