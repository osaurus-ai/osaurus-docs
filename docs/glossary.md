---
title: Glossary
sidebar_label: Glossary
description: Plain-English explanations of the terms used across the Osaurus docs — workflows, agents, models, privacy, sharing, and the technical words you'll run into.
---

# Glossary

New to AI apps, or just ran into a word you don't recognize? This page explains the terms used across these docs in plain English. Terms marked *(technical)* matter mostly to developers; you can use Osaurus without them.

## A–C

### Access key {/* #access-key */}

A password-like code that lets another app or device use your Osaurus. You create it, you can see when it was last used, and you can revoke it anytime. Access keys start with `osk-v1`. Apps on your own Mac don't need one unless you turn on [Require Access Key for Local Admin Routes](/security#local-access-key).

### Activity log {/* #activity-log */}

The private record Osaurus keeps on your Mac of what happened: which models ran, which tools and workflows were used, and what was sent to the cloud. You browse it in [Insights](#insights).

### Agent {/* #agent */}

A saved assistant with its own name, instructions, model, and abilities. Osaurus comes with a small team of them ([teammates](#teammate)), and you can make your own for writing, coding, research, or anything else. See [Agents](/agents).

### Agent template {/* #agent-template */}

A reusable starting point for a new agent: its instructions, model, tools, and settings, without your chats or memory. You can save any agent as a template, share it as a file or a page on store.osaurus.ai, and build new agents from it. See [Agent Templates](/agent-templates).

### API {/* #api */}

A way for programs to talk to each other. Osaurus has one so other apps on your Mac can use your models, agents and workflows. You don't need it to use Osaurus.

### API key {/* #api-key */}

A password from a cloud AI company (like OpenAI or Anthropic) or another service that lets Osaurus use it on your behalf. Osaurus keeps keys safely on your Mac, in the [Vault](#vault) and your [Keychain](#keychain).

### Apple Intelligence {/* #apple-intelligence */}

Apple's built-in AI on newer Macs (macOS 26 and later). Osaurus can use its on-device model with no download; it appears as **Foundation** in the model picker. See [Apple Intelligence](/models/apple-intelligence).

### Apple Silicon {/* #apple-silicon */}

Macs with an M-series chip (M1, M2, M3, and later). Osaurus needs one.

### Approval {/* #approval */}

The confirmation card Osaurus shows before an agent or workflow does something that matters, like changing a file, sending a message, or spending credits. You choose **Allow** or **Deny**.

### Architect {/* #architect */}

The helper built into Osaurus that makes [workflows](#workflow) for you. You describe a task in a chat, it builds the steps, and you test and save it. See [Build with the Architect](/workflows-build).

### Artifact {/* #artifact */}

A file an agent made for you, shown as a card in the chat that you can open, preview, or save.

### Automation {/* #automation */}

Something Osaurus runs by itself: a workflow, an agent, or a quick question, set to go at a time you choose (like every weekday at 8) or when something happens (like a new file in a folder). Set them up in **Settings → Automations**. See [Automations](/automations).

### Automation (macOS permission) {/* #automation-permission */}

A different thing from Osaurus's Automations: a macOS privacy setting that lets Osaurus control another app, like Mail or Music. macOS asks you the first time.

### Cloud model {/* #cloud-model */}

An AI model that runs on another company's servers instead of your Mac. It needs the internet, and what you send it leaves your Mac. Compare [local model](#local-model).

### Configurator {/* #configurator */}

The helper behind Osaurus that changes settings when you ask in a chat, like "download a model" or "give Planner access to Reminders". Every change shows an [approval](#approval) card first. It works behind the scenes and isn't in the agent list.

### Context window {/* #context-window */}

How much of the conversation a model can keep in mind at once. Long chats eventually fill it; Osaurus then summarizes older parts so you can keep going. The meter in the chat shows how full it is.

### Core Model {/* #core-model */}

A small model Osaurus uses behind the scenes for housekeeping, like saving [memories](#memory) and tidying dictated text. It doesn't have to be the model you chat with. On macOS 26 it's Apple Intelligence by default. Change it in **Settings → Model Defaults → Core Model**.

### Credits {/* #credits */}

The prepaid balance you spend on [Osaurus Cloud](#osaurus-cloud) models, premium web search, and hosted image or video generation. $1 buys 10,000 credits. See your balance in **Settings → Osaurus ID → Wallet & Credits**.

### Cron {/* #cron */}

A short text pattern for "when to run" an automation, like "every weekday at 9am". You only need it for unusual timings; the **Schedule** choices in [Automations](/automations) cover the common ones.

## D–K

### Delegation {/* #delegation */}

When one agent hands a job to another agent and waits for the answer. The agent that takes the job is a [subagent](#subagent).

### Devices {/* #devices */}

Your Macs and iPhone linked together so your chats sync between them, end-to-end encrypted, with no account to create. Set it up in **Settings → Devices**. See [Devices & Sync](/devices), or [Devices & Sync on Windows](/windows/devices).

### Draft {/* #draft */}

A workflow the [Architect](#architect) is still building. It isn't ready to run until you test it and save it. Unfinished drafts wait on the **Drafts** tab of the Workflows page.

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

### GGUF {/* #gguf */}

The file format for local models on Windows, the same one LM Studio and Ollama use. A GGUF model comes in several builds that trade size for quality ([quantization](#quantization)). See [Models on Windows](/windows/models).

### Helpers {/* #helpers */}

Four built-in assistants the [Orchestrator](#orchestrator) can call on for quick jobs: **Research** (web search with sources), **Files** (your Working Folder), **Browser** (websites, including ones you're signed in to), and **Code** (running code safely). See [Orchestrator](/orchestrator).

### Hugging Face {/* #hugging-face */}

A website where AI models are published. Osaurus downloads most local models from it.

### Insights {/* #insights */}

The screen in **Settings → Developer Tools → Insights** where you can review the [activity log](#activity-log): what ran, what left your Mac, and what it cost. Workflow runs have their own tab. On Windows it's **Settings → Insights**; see [Your Data](/windows/data-and-privacy).

### Installed workflow {/* #installed-workflow */}

A [workflow](#workflow) that's set up and ready on your Mac, whether you built it, it came with Osaurus, or you installed it from someone's link or file.

### JSON / YAML {/* #json-yaml */}

*(technical)* Two plain-text formats for structured data. Some advanced settings can be written in them.

### Keychain {/* #keychain */}

macOS's secure password storage. Osaurus keeps its most sensitive keys there, including your [Osaurus ID](#osaurus-id) and the keys behind the [Vault](#vault).

### Knowledge {/* #knowledge */}

Folders of your own documents that an agent is allowed to search when answering. Unlike [memory](#memory), you choose exactly what goes in. See [Knowledge](/knowledge).

## L–O

### llama.cpp {/* #llama-cpp */}

The open-source engine Osaurus for Windows uses to run local models, on your graphics card or processor. See [Models on Windows](/windows/models).

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

### Needs setup {/* #needs-setup */}

A label on a workflow or agent that's missing something it needs before it can run, like a model, a key, a folder, or a permission. Click **Set Up** to finish. See [Run a Workflow](/workflows-run#finish-setting-it-up).

### Orchestrator {/* #orchestrator */}

The built-in assistant every new chat starts with, named **Osaurus**. It answers questions, changes settings after you approve, runs your workflows, and hands bigger jobs to your [teammates](#teammate) and other agents. See [Orchestrator](/orchestrator).

### Osaurus Bundle {/* #osaurus-bundle */}

*(technical)* A folder a company's installer ships so Osaurus starts with their agents, skills, and tool connections already set up. It's installed with `osaurus import`. Not the same as the `.osaurus-agent` file you get from an agent's **Export Bundle**. See [Osaurus Bundles](/bundles).

### Osaurus Cloud {/* #osaurus-cloud */}

The label for hosted models in the model picker. They run through [Osaurus Router](#osaurus-router) and are paid for with [credits](#credits).

### Osaurus ID {/* #osaurus-id */}

Your identity in Osaurus. It proves that requests, shared workflows and website logins really come from you, without an account or password. It's created for you, backed up by your [recovery phrase](#recovery-phrase), and you can claim a public name for it, like `@yourname`. See [Osaurus ID](/identity).

### Osaurus Router {/* #osaurus-router */}

Osaurus's hosted service for cloud models, credits, and team billing. It means you can use cloud models without signing up with each AI company. See [Osaurus Router](/osaurus-router).

## P–S

### Parameters (model size) {/* #parameters */}

A rough measure of a model's size, written like "8B" (8 billion). Bigger models are usually smarter but need more memory.

### PII {/* #pii */}

Personally identifiable information: names, emails, phone numbers, ID numbers, and similar details. The [Privacy Filter](#privacy-filter) can hide it before a message goes to a cloud model.

### Plugin {/* #plugin */}

An add-on that gives agents new [tools](#tool), like reading spreadsheets. Install plugins from **Settings → Tools & MCP → Plugins**.

### Privacy Filter {/* #privacy-filter */}

An optional feature that finds personal details in your message and swaps them for placeholders before it goes to a cloud model, then puts them back in the reply. See [Privacy Filter](/privacy-filter).

### Project {/* #project */}

A group of chats that share instructions, documents, memory, and a [Working Folder](#working-folder). See [Projects](/projects).

### Prompt {/* #prompt */}

The message or instructions you give a model.

### Provider {/* #provider */}

A cloud AI company Osaurus can connect to, like OpenAI, Anthropic, or Google. Set them up in **Settings → Providers**.

### Public (shared workflow) {/* #public-workflow */}

A shared workflow anyone can find on store.osaurus.ai. Its link works as soon as you publish, and it's listed in the store once the Osaurus team approves it. Compare [Unlisted](#unlisted). See [Share a Workflow](/workflows-share).

### Quantization {/* #quantization */}

Shrinking a model so it uses less memory and disk space, written like "4-bit" or "8-bit". Lower numbers are smaller and faster, with a small loss in quality.

### Recovery phrase {/* #recovery-phrase */}

24 words that back up your [Osaurus ID](#osaurus-id). Anyone with them can restore it, so keep them somewhere safe and private. Find yours in **Settings → Osaurus ID** (on Windows, **Settings → Account → Account**).

### Relay {/* #relay */}

Osaurus's servers that pass traffic between your Mac and the outside world, so your phone or a teammate can reach your agents. For Osaurus-to-Osaurus traffic, the relay only sees [encrypted](#end-to-end-encryption) data.

### Remote Access {/* #remote-access */}

A web address (ending in `agent.osaurus.ai`) that lets apps outside your network reach one of your agents, without changing your router settings. It works through Osaurus's [relay](#relay). See [Remote Access](/remote-access).

### Run {/* #run */}

One time a workflow ran: what you gave it, each step it took, and what you got back, including any files. Past runs are listed on each workflow's page.

### Runtime {/* #runtime */}

The program that actually runs an agent's turns. By default that's Osaurus's own loop. You can instead run an agent on an outside agent program, like Claude Code or Pi, which brings its own tools. See [Runtimes](/harness-runtimes).

### Sandbox {/* #sandbox */}

A sealed-off workspace on your Mac where agents and workflows can run code and install software without touching the rest of your Mac. See [Sandbox](/sandbox).

### Secure Channel {/* #secure-channel */}

The encrypted connection Osaurus sets up automatically between your Mac and your phone, a teammate's Mac, or another Osaurus. There's nothing to turn on. See [Secure Channel](/secure-channel).

### Skill {/* #skill */}

A ready-made playbook that teaches agents how to do a kind of task, like research or working with calendars. Agents load the right skill when it's needed. See [Skills](/skills).

### Speculative decoding {/* #speculative-decoding */}

*(technical)* A way to make a local model reply faster: it guesses several words ahead, then checks them all at once, keeping the ones that are right. The answer is the same; only the speed changes. In Osaurus it's **Off (AR)** or **On (Adaptive)** in the model picker. See [Models](/models#speculative-decoding).

### Starter {/* #starter */}

One of three ready-made writing workflows you can add in a click: **Social Post Writer**, **Meeting Action Items**, and **Email Reply**. See [Workflows](/workflows#starters). Not to be confused with the starter team of agents; see [teammate](#teammate).

### Structured output {/* #structured-output */}

*(technical)* When a model is made to answer in an exact format, like a form with set fields, instead of free text. Workflow steps rely on it, so a few models that can't do it can't run those steps.

### Subagent {/* #subagent */}

An agent that another agent brings in to handle one job and report back. See [Subagents](/subagents).

### System prompt {/* #system-prompt */}

The standing instructions that shape how an agent behaves in every chat, like "You are a careful editor who keeps my voice."

## T–Z

### Teammate {/* #teammate */}

One of the agents Osaurus sets up for you on a new install, each looking after one part of your day: **Planner** (Calendar and Reminders), **Courier** (Mail), **Keeper** (Downloads and Notes), **Scout** (the web), and on Macs set up for coding, **Builder** (one project folder). See [Agents](/agents).

### Teammates can run this {/* #teammates-can-run-this */}

A switch on a workflow's page that lets people in your [workspace](#workspace) start it from one of your shared agents. It runs on your Mac with your keys, and Osaurus asks you each time. It doesn't give them a copy.

### Temperature {/* #temperature */}

A setting for how creative or predictable a model is. Lower is more focused and consistent; higher is more varied.

### Template {/* #template */}

The shareable copy of a workflow or agent: a `.osaurustemplate` file, or a page on store.osaurus.ai. It carries the steps and what's needed to run them, never your keys, answers or files. Installing one puts your own copy on your Mac.

### Token {/* #token */}

A small piece of text (about three-quarters of a word) that models read and write. Models count tokens to measure how much fits in their [context window](#context-window), and cloud models charge by them.

### Tool {/* #tool */}

An action an agent can take instead of just writing text: searching the web, reading a file, creating a calendar event, and so on. Agents only use the tools you allow.

### Transcription {/* #transcription */}

Turning speech into text. Osaurus does it on your Mac, so your voice never leaves it.

### Unlisted {/* #unlisted */}

A shared workflow page that only people with the link can open. It isn't listed or searchable on store.osaurus.ai, and it goes live as soon as you publish. Compare [Public](#public-workflow). See [Share a Workflow](/workflows-share).

### Vault {/* #vault */}

The one place on your Mac for every key, password, and sign-in your agents, workflows, tool servers and chat apps use. Values are hidden, and showing or copying one needs Touch ID or your password. Open it in **Settings → Vault**. See [Vault](/vault).

### Wake word {/* #wake-word */}

A word or phrase, like an agent's name, that opens a chat hands-free when you say it. See [Voice](/voice).

### Workflow {/* #workflow */}

A task Osaurus remembers how to do: a set of steps with a form you fill in and a result you get back. You can read every step before it runs, run it with one click or on a schedule, and share it with a link. Not the same as a [Method](/methods). See [Workflows](/workflows).

### Workspace {/* #workspace */}

A team space where members share agents, workflows, and a pool of [credits](#credits). Shared agents keep running on their owner's Mac. See [Workspaces](/workspaces).

### Working Folder {/* #working-folder */}

A folder on your Mac that you let an agent read and edit. Without one, an agent can't touch your files. See [Working in Chat](/agent-loop).
