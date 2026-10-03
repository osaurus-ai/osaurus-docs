---
title: Glossary
sidebar_label: Glossary
description: Plain-English explanations of the terms used across the Osaurus docs — models, agents, tools, privacy, sharing, and the technical words you'll run into.
---

# Glossary

New to AI apps, or just ran into a word you don't recognize? This page explains the terms used across these docs in plain English. Terms marked *(technical)* matter mostly to developers; you can use Osaurus without them.

## A–C

### Access key {/* #access-key */}

A password-like code that lets another app or device use your Osaurus. You create it, you can see when it was last used, and you can revoke it anytime. Access keys start with `osk-v1`.

### Activity log {/* #activity-log */}

The private record Osaurus keeps on your Mac of what happened: which models ran, which tools were used, and what was sent to the cloud. You browse it in [Insights](#insights).

### Agent {/* #agent */}

A saved assistant with its own name, instructions, model, and abilities. You might have one agent for writing, one for coding, and one for research. See [Agents](/agents).

### API {/* #api */}

A way for programs to talk to each other. Osaurus has one so other apps on your Mac can use your models and agents. You don't need it to use Osaurus.

### API key {/* #api-key */}

A password from a cloud AI company (like OpenAI or Anthropic) that lets Osaurus use their models on your behalf. Osaurus stores it in your [Keychain](#keychain).

### Apple Intelligence {/* #apple-intelligence */}

Apple's built-in AI on newer Macs (macOS 26 and later). Osaurus can use its on-device model with no download; it appears as **Foundation** in the model picker. See [Apple Intelligence](/models/apple-intelligence).

### Apple Silicon {/* #apple-silicon */}

Macs with an M-series chip (M1, M2, M3, and later). Osaurus needs one.

### Approval {/* #approval */}

The confirmation card Osaurus shows before an agent does something that matters, like changing a file, sending a message, or spending credits. You choose **Allow** or **Deny**.

### Artifact {/* #artifact */}

A file an agent made for you, shown as a card in the chat that you can open, preview, or save.

### Automation (macOS permission) {/* #automation-permission */}

A macOS privacy setting that lets Osaurus control another app, like Mail or Music. macOS asks you the first time.

### Cloud model {/* #cloud-model */}

An AI model that runs on another company's servers instead of your Mac. It needs the internet, and what you send it leaves your Mac. Compare [local model](#local-model).

### Context window {/* #context-window */}

How much of the conversation a model can keep in mind at once. Long chats eventually fill it; Osaurus then summarizes older parts so you can keep going. The meter in the chat shows how full it is.

### Core Model {/* #core-model */}

A small model Osaurus uses behind the scenes for housekeeping, like saving [memories](#memory) and tidying dictated text. It doesn't have to be the model you chat with.

### Credits {/* #credits */}

The prepaid balance you spend on [Osaurus Cloud](#osaurus-cloud) models, premium web search, and hosted image or video generation. $1 buys 10,000 credits.

### Cron {/* #cron */}

A short text pattern for "when to run" a schedule, like "every weekday at 9am". You only need it for unusual timings; the Schedules screen covers the common ones.

## D–K

### Delegation {/* #delegation */}

When one agent hands a job to another agent and waits for the answer. The agent that takes the job is a [subagent](#subagent).

### Embedding {/* #embedding */}

*(technical)* A way of turning text into numbers that capture its meaning, so Osaurus can find documents about the same idea even when the words differ.

### End-to-end encryption {/* #end-to-end-encryption */}

Scrambling a message so only the sender and the receiver can read it. Anything in between, including Osaurus's own relay servers, sees only scrambled data.

### Endpoint {/* #endpoint */}

*(technical)* A specific web address an app sends requests to, like `http://127.0.0.1:1337/v1/chat/completions`.

### FileVault {/* #filevault */}

macOS's built-in disk encryption. With it on, everything on your Mac — including Osaurus's data — is unreadable without your password.

### Full Disk Access {/* #full-disk-access */}

A macOS privacy setting that lets an app read protected data, such as your Messages history. Only some Osaurus features need it.

### Hugging Face {/* #hugging-face */}

A website where AI models are published. Osaurus downloads most local models from it.

### Identity {/* #identity */}

Osaurus's way of proving that requests really come from you or your agents — without an account or password. It's created automatically and backed up by your [recovery phrase](#recovery-phrase). See [Identity](/identity).

### Insights {/* #insights */}

The screen in **Settings… → Insights** where you can review the [activity log](#activity-log): what ran, what left your Mac, and what it cost.

### JSON / YAML {/* #json-yaml */}

*(technical)* Two plain-text formats for structured data. Some advanced settings can be written in them.

### Keychain {/* #keychain */}

macOS's secure password storage. Osaurus keeps API keys, tokens, and its identity key there.

### Knowledge {/* #knowledge */}

Folders of your own documents that an agent is allowed to search when answering. Unlike [memory](#memory), you choose exactly what goes in. See [Knowledge](/knowledge).

## L–O

### Local model {/* #local-model */}

An AI model downloaded to your Mac. It works offline and nothing you type leaves your computer. Compare [cloud model](#cloud-model).

### Loopback {/* #loopback */}

*(technical)* Network traffic that never leaves your Mac (the address `127.0.0.1`). Osaurus's server listens here by default.

### MCP {/* #mcp */}

Model Context Protocol: a common standard for connecting AI apps to tools and services. Osaurus can use MCP tools from other services, and other apps can use Osaurus through it.

### Memory {/* #memory */}

What Osaurus learns about you from past chats — your preferences, projects, and facts — so you don't have to repeat yourself. It stays on your Mac and you can view or delete it. See [Memory](/memory).

### MLX {/* #mlx */}

Apple's technology for running AI models fast on Apple Silicon. Osaurus uses it for local models.

### Model {/* #model */}

The AI "brain" that reads your message and writes the reply. Osaurus can use [local models](#local-model), [Apple Intelligence](#apple-intelligence), or [cloud models](#cloud-model). See [Models](/models).

### Orchestrator {/* #orchestrator */}

The built-in agent every new chat starts with. It answers questions, helps set up Osaurus, and hands bigger jobs to your other agents. See [Orchestrator](/orchestrator).

### Osaurus Cloud {/* #osaurus-cloud */}

The label for hosted models in the model picker. They run through [Osaurus Router](#osaurus-router) and are paid for with [credits](#credits).

### Osaurus Router {/* #osaurus-router */}

Osaurus's hosted service for cloud models, credits, and team billing. It means you can use cloud models without signing up with each AI company. See [Osaurus Router](/osaurus-router).

## P–S

### Parameters (model size) {/* #parameters */}

A rough measure of a model's size, written like "8B" (8 billion). Bigger models are usually smarter but need more memory.

### PII {/* #pii */}

Personally identifiable information: names, emails, phone numbers, ID numbers, and similar details. The [Privacy Filter](#privacy-filter) can hide it before a message goes to a cloud model.

### Plugin {/* #plugin */}

An add-on that gives agents new [tools](#tool), like reading spreadsheets. Install plugins from **Settings… → Tools & MCP → Plugins**.

### Privacy Filter {/* #privacy-filter */}

An optional feature that finds personal details in your message and swaps them for placeholders before it goes to a cloud model, then puts them back in the reply. See [Privacy Filter](/privacy-filter).

### Project {/* #project */}

A folder-like group of chats that share instructions, documents, memory, and a [Working Folder](#working-folder). See [Projects](/projects).

### Prompt {/* #prompt */}

The message or instructions you give a model.

### Provider {/* #provider */}

A cloud AI company Osaurus can connect to, like OpenAI, Anthropic, or Google. Set them up in **Settings… → Providers**.

### Public Link {/* #public-link */}

A web address (ending in `agent.osaurus.ai`) that lets apps outside your network reach one of your agents, without changing your router settings. It works through Osaurus's [relay](#relay). See [Public Links](/relay).

### Quantization {/* #quantization */}

Shrinking a model so it uses less memory and disk space, written like "4-bit" or "8-bit". Lower numbers are smaller and faster, with a small loss in quality.

### Recovery phrase {/* #recovery-phrase */}

24 words that back up your Osaurus [identity](#identity). Anyone with them can restore it, so keep them somewhere safe and private. View yours in **Settings… → Identity**.

### Relay {/* #relay */}

Osaurus's servers that pass traffic between your Mac and the outside world, so your phone or a teammate can reach your agents. For Osaurus-to-Osaurus traffic, the relay only sees [encrypted](#end-to-end-encryption) data.

### Sandbox {/* #sandbox */}

A sealed-off workspace where an agent can run code and install software without touching the rest of your Mac. See [Sandbox](/sandbox).

### Secure Channel {/* #secure-channel */}

The encrypted connection Osaurus sets up automatically between your Mac and your phone, a teammate's Mac, or another Osaurus. There's nothing to turn on. See [Secure Channel](/secure-channel).

### Skill {/* #skill */}

A ready-made playbook that teaches agents how to do a kind of task, like research or working with calendars. Agents load the right skill when it's needed. See [Skills](/skills).

### Subagent {/* #subagent */}

An agent that another agent brings in to handle one job and report back. See [Subagents](/subagents).

### System prompt {/* #system-prompt */}

The standing instructions that shape how an agent behaves in every chat, like "You are a careful editor who keeps my voice."

## T–Z

### Temperature {/* #temperature */}

A setting for how creative or predictable a model is. Lower is more focused and consistent; higher is more varied.

### Token {/* #token */}

A small piece of text (about three-quarters of a word) that models read and write. Models count tokens to measure how much fits in their [context window](#context-window), and cloud models charge by them.

### Tool {/* #tool */}

An action an agent can take instead of just writing text: searching the web, reading a file, creating a calendar event, and so on. Agents only use the tools you allow.

### Transcription {/* #transcription */}

Turning speech into text. Osaurus does it on your Mac, so your voice never leaves it.

### Wake word {/* #wake-word */}

A word or phrase, like an agent's name, that opens a chat hands-free when you say it. See [Voice](/voice).

### Workspace {/* #workspace */}

A team space where members share agents and a pool of [credits](#credits). The shared agents keep running on their owner's Mac. See [Workspaces](/workspaces).

### Working Folder {/* #working-folder */}

A folder on your Mac that you let an agent read and edit. Without one, an agent can't touch your files. See [Tasks](/agent-loop).
