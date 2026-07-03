# Nxtrive — Product Draft

> **Status:** Draft · **Maintainer:** [@devzeromax](https://github.com/devzeromax)  
> **Website:** [nxtrive.vercel.app](https://nxtrive.vercel.app/) · **Repository:** [github.com/devzeromax/Nxtrive](https://github.com/devzeromax/Nxtrive)

---

## One-liner

**Nxtrive** is a free, open-source offline local RAG desktop app that lets you chat with your PDFs, Word documents, and code — privately, on your machine, with no cloud or account.

---

## Tagline options

- **Primary:** Your documents. Your machine. Your answers.
- **Secondary:** Chat with your documents offline. Nothing leaves your machine.
- **Short:** Offline local RAG for Windows, macOS, and Linux.

---

## Elevator pitch (30 seconds)

Most document AI tools send your files to the cloud. Nxtrive does the opposite.

Nxtrive is an open-source desktop app that turns folders of PDFs, Word docs, Markdown, and source code into a private knowledge base on your computer. Ask questions in plain language and get answers grounded in your files — with citations — powered by a local LLM through Ollama.

No API keys. No subscription. No uploads. After the initial setup, it works completely offline. Built for researchers, developers, legal teams, and anyone who needs document intelligence without sacrificing privacy.

---

## Short description (GitHub / social — ~160 characters)

Offline local RAG app for Windows, macOS & Linux. Chat with PDFs and documents using a private on-device LLM — no cloud, API keys, or account. Open source (MIT).

---

## Medium description (website / README — ~350 words)

### What is Nxtrive?

Nxtrive is a local **RAG** (retrieval-augmented generation) desktop application for **Windows, macOS, and Linux**. It indexes documents on your machine, retrieves the most relevant passages, and uses a local language model to answer your questions with **source citations**.

Unlike cloud-based chat tools, Nxtrive never sends your files to external servers. Everything — indexing, embedding, retrieval, and inference — runs on your hardware.

### How it works

1. **Ingest** — Add folders via drag-and-drop. Nxtrive chunks and embeds your files into a local vector database.
2. **Retrieve** — When you ask a question, the app finds the most relevant passages across your collections.
3. **Answer** — A local LLM (via Ollama) generates a response grounded in those passages, with citations you can verify.

### Why it matters

- **Privacy:** Sensitive contracts, research, medical records, and source code stay on your device.
- **Offline:** Works without internet after setup — ideal for travel, secure facilities, and air-gapped environments.
- **No lock-in:** MIT licensed, no account, no usage metering, no vendor dependency.
- **Transparency:** Open source. You control the model, the data, and the machine.

### Supported formats

PDF · Word (.docx) · Plain text · Markdown · CSV · JSON · HTML · CSS · Python · JavaScript · TypeScript · and more.

### System requirements

- **OS:** Windows 10/11, macOS 10.15+, Ubuntu 22.04+ (or equivalent Linux)
- **RAM:** 8 GB minimum (16 GB+ recommended)
- **LLM:** [Ollama](https://ollama.com/) installed locally

---

## Long-form draft (blog / press / About page)

### Headline

**Introducing Nxtrive: Offline Local RAG for Documents That Never Leave Your Machine**

### Body

Document AI has a trust problem. To chat with your PDFs, most tools ask you to upload them to someone else's server — along with your contracts, research, code, and client work.

**Nxtrive** was built for a different assumption: your documents belong on your machine.

Nxtrive is an open-source desktop application that brings retrieval-augmented generation (RAG) entirely offline. Point it at a folder of files, and it builds a searchable local knowledge base. Ask a question, and Nxtrive retrieves the relevant sections, runs them through a local large language model, and returns an answer you can trace back to the source.

There is no cloud pipeline. No API key to manage. No account to create. Nxtrive runs on Windows, macOS, and Linux, integrates with Ollama for local inference, and supports the formats teams actually use — PDFs, Word documents, Markdown, spreadsheets, and code.

For researchers reviewing literature, developers navigating large codebases, legal teams working under confidentiality, or clinicians in restricted environments, Nxtrive offers a practical path to document intelligence without the privacy trade-offs of cloud AI.

Nxtrive is free and open source under the MIT license — maintained by [devzeromax](https://github.com/devzeromax).

**Your documents. Your machine. Your answers.**

---

## Key features (bullet list)

- 100% offline operation after initial model download
- Local vector database — no cloud indexing
- Source citations on every answer
- Multiple document collections
- Folder drag-and-drop ingestion
- Cross-platform: Windows, macOS, Linux
- Ollama integration for local LLMs
- MIT license — free, no subscription

---

## Who it's for

| Audience | Use case |
|----------|----------|
| **Researchers** | Query papers and notes offline with cited answers |
| **Developers** | Chat with documentation and codebases locally |
| **Legal teams** | Review contracts under NDA without cloud uploads |
| **Clinical / healthcare** | Work with sensitive records on-device |
| **Privacy-conscious users** | Document AI without vendor lock-in |
| **Air-gapped environments** | RAG where internet access is restricted |

---

## Comparison angle (draft copy)

| | Cloud document AI | Nxtrive |
|---|-------------------|---------|
| **Data location** | Vendor servers | Your machine |
| **Internet required** | Yes | No (after setup) |
| **Account / API key** | Usually required | None |
| **Cost model** | Subscription / per-token | Free (MIT) |
| **Source citations** | Varies | Built-in |
| **Open source** | Rarely | Yes |

---

## FAQ (ready to publish)

**What is local RAG?**  
Retrieval-augmented generation combines search over your files with a language model. Nxtrive runs both steps on your computer, so answers are grounded in your documents without sending data to the cloud.

**Does Nxtrive work completely offline?**  
Yes. After you download the app and an Ollama model once, indexing and chat work without a network connection.

**Which file types are supported?**  
PDF, Word (.docx), plain text, Markdown, CSV, JSON, HTML, CSS, and common source-code formats.

**Is Nxtrive free?**  
Yes. Open source under the MIT license. No subscription or account required.

**What do I need to run it?**  
Windows 10/11, macOS 10.15+, or Ubuntu 22.04+; 8 GB RAM minimum (16 GB recommended); Ollama installed.

---

## Social posts (draft)

### Twitter / X (280 chars)

Nxtrive — offline local RAG for your documents.

Chat with PDFs, Word files & code on your machine. No cloud. No API keys. No account.

Free & open source → nxtrive.vercel.app

### LinkedIn (short)

Most document AI tools upload your files to the cloud. Nxtrive doesn't.

It's an open-source desktop app for offline local RAG — chat with PDFs, Word docs, and code using a private LLM on Windows, macOS, and Linux.

Your documents. Your machine. Your answers.

Try it: nxtrive.vercel.app

---

## GitHub repository description (draft)

Official website & landing page for Nxtrive — offline local RAG desktop app. Chat with PDFs & documents privately. React · Vite · TypeScript · Tailwind.

---

## Keywords (SEO)

local RAG · offline document chat · private LLM · chat with PDFs offline · local vector database · Ollama RAG · document AI desktop app · Nxtrive · offline RAG · air-gapped AI

---

## Links

| Resource | URL |
|----------|-----|
| Live website | https://nxtrive.vercel.app/ |
| GitHub | https://github.com/devzeromax/Nxtrive |
| Sitemap | https://nxtrive.vercel.app/sitemap.xml |
| Maintainer | https://github.com/devzeromax |

---

*Last updated: July 2026 · Draft for internal and public use — edit before publishing.*
