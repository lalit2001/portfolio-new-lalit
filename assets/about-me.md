# Lalit Moharana

### *builder of systems that think*

📍 Gurugram, India · [GitHub](https://github.com/lalit2001)

---

There's a particular kind of person who can't look at a messy pile of data - emails, SAP exports, scraped tweets, PDFs nobody wants to read - without seeing the shape of the system that could make sense of it. I'm that person. Give me a client's chaos and a blank architecture canvas, and I'll hand you back something that thinks, adapts, and doesn't need me standing over it forever.

I've spent the last 5+ years chasing one obsession: **making machines understand the messy, human, unstructured world** - and building the infrastructure sturdy enough to hold that intelligence at scale. Supply chains, life sciences labs, automotive marketing teams, banks, telecom giants - different worlds, same question every time: *can we make this smarter, faster, and less painful for the humans running it?*

I don't just consult on this. I build it - the containers, the pipelines, the agents, the dashboards - and I ship it directly into the client's world, not a slide deck.

---

## 🌌 The Stack I Dream In

**Cloud & Infra** - AWS (EC2, ECS, Lambda, Glue, EMR, Batch), GCP/GKE, Docker, Terraform
**Backend** - Spring Boot, Quarkus, FastAPI, Next.js, Go, event-driven microservices
**Data Engineering** - Iceberg, Hudi, Paimon, Kafka, Flink, Airflow, Doris, Trino, ClickHouse, Snowflake
**Agentic AI** - LangChain, LangGraph, LlamaIndex, MCP, A2A, Bedrock, Langfuse, RAG / Self-RAG, NL2SQL

---

## 🚀 Things I've Built

### OmniQuery
**[www.omniquery.in](https://www.omniquery.in/)**

The idea started simple: *why can't I just ask my data a question?* Not write SQL. Not open five different tools. Just ask.

OmniQuery is a context-augmented data fabric that quietly stitches together Postgres, MySQL, Snowflake, MongoDB, and Trino on one side, and Slack, Jira, S3, and Teams on the other - into a single plane you can talk to. Ask a question in plain English, and it writes the joins, runs the aggregations, and renders the chart before you've finished your coffee. Underneath, a provider-agnostic LLM layer means you can swap OpenAI for Anthropic for Gemini for a local Ollama model without touching a line of application code. Full RBAC, SSO, end-to-end encryption, and a reasoning trace for every answer it gives - because trust matters as much as speed.

### Agent Platform
**[agent-dot.omniquery.in](https://agent-dot.omniquery.in/)**

This is the one closest to my heart - my attempt at building a self-hostable, Claude-style agentic platform from first principles.

At its core is a **Skills framework**: portable, git-versioned Markdown playbooks that agents load on demand through a three-stage matcher - keyword, then embedding similarity, then an LLM tie-break - so business logic survives every model upgrade instead of breaking with it. Every session gets its own sandboxed Docker container with a persistent workspace, auto-reaped when idle. A package-installation proxy caches and pre-bakes common pip/npm installs so agents never sit around waiting on cold starts. And the part I'm proudest of - **MCP connector pooling**: instead of spinning up a container per session, I run one container per connector, shared across every user, multiplexing JSON-RPC-over-stdio by request ID so dozens of concurrent tool calls glide through a single pipe with zero queueing. Agent memory is git-backed and provenance-tagged across user, session, and project scopes, with reviewable diffs - nothing gets silently overwritten.

Model-agnostic by design: Anthropic, OpenAI, Gemini, Ollama, Azure Foundry - swap freely.

### AI Newsletter
**[ai-newsletter.omniquery.in](https://ai-newsletter.omniquery.in/)**

Born out of an unglamorous habit - I read *a lot* of AI research and can't stop curating it. This is that instinct turned into a product: a running signal from the frontier of LLM labs, agents, VLMs, and arXiv drops, distilled for people who don't have time to read forty feeds a day. (I do. Someone has to.)

---

## 🏢 Where I've Taken This Into the Field

**Ernst & Young - Senior Consultant, Data & AI**
Deployed **Genome**, a Life Sciences AI agents marketplace built as config-driven Next.js micro-frontends over FastAPI microservices - new agents onboard with zero code changes. Built **SCNC**, a real-time material-shortage prediction engine reading signals out of emails, SAP, and e-way bills using self-RAG and automated schema resolution.

My flagship engagement, **SMART** - an AI-driven social analytics platform for one of the world's largest automotive manufacturers - is where a lot of my favorite ideas collided at once: millions of social comments and reviews from Instagram, YouTube, X, Reddit, and automotive blogs, unified into an Iceberg lakehouse; a generative-UI dashboard builder where one sentence produces the charts and KPIs; and a multi-agentic NL2SQL chatbot that lets QA, Engineering, Design, and Marketing teams each ask the same data completely different questions. I'm now leading its v2 rebuild into a fully microservice, multi-tenant, cloud-agnostic architecture.

**InvoLead Services - Senior Data Engineer**
Built agentic NL → SQL → Insight pipelines with hybrid metadata + vector retrieval to keep hallucinations down, backed by real-time Kafka/Quarkus ETL pipelines instrumented for latency, token cost, and answer quality.

**ByteIQ Analytics - Data & AI Engineer**
Shipped an OCR-driven, Neo4j-backed chatbot for semantic search over insurance policy and claims documents, NL2SQL copilots over Iceberg/Hudi lakehouses, and led a 7-engineer team through a 15+ microservice FinTech platform powering bank underwriting decisions.

---

## ✨ Recognition & Open Source

- **AWS Community Builder - Data Engineering** (2025)
- Open-source contributor & architecture advisor (Go) to **Olake** - one of the fastest ways to replicate a database straight into a data lakehouse

---

## 🎓 Foundations

**B.E., Computer Science & Engineering** - BPUT, Odisha (2018–2022), CGPA 8.5

---

*Currently: CTO at StriveSteam, still chasing the same question I started with - how do we make systems that understand us, instead of the other way around.*

analyze this video and add ss o f this in reference on home page image 
agent-dot-video link - https://youtu.be/qOaWcWn1I8s?si=cKjWsdf9bU2hjwlJ
agent-dot-dashbapord builder link- https://youtu.be/2HxVV_T19_4?si=AdQNBXsc6Jbm0rlF
omni-query-link - https://youtu.be/91L_UeYKY8Y?si=wOVLm4q5HeXDypLP