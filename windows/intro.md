---
title: Osaurus for Windows
sidebar_label: Overview
description: Osaurus for Windows is a free app for AI assistants that remember you, work on your files, and turn repeat tasks into workflows, with your data kept on your PC. Local models run on your graphics card; cloud models are there when you want them.
slug: /
---

# Osaurus for Windows

Osaurus for Windows is a free app for using AI on your PC. You chat with AI assistants (called [agents](/glossary#agent)) that remember what matters to you, work on files in folders you choose, and turn the tasks you repeat into [workflows](/windows/workflows) you can run with one click. Your chats, memories, and settings are kept on your PC, encrypted.

You choose the AI "brain" (the [model](/glossary#model)) behind each assistant. It can be a [local model](/glossary#local-model) that runs on your PC and works offline, or a [cloud model](/glossary#cloud-model) such as GPT, Claude, or Gemini when you want one. What you write leaves your PC only if you add a cloud model or turn on a feature that needs the internet. Crash reports and anonymous usage data are on unless you [turn them off](/windows/data-and-privacy#what-leaves-your-pc), and don't include your chats.

:::info[Osaurus 1.0]
Osaurus for Windows is out of beta. It runs on Windows 11 and comes from the [Microsoft Store](https://apps.microsoft.com/store/detail/9P2W5T5WTTZ1?cid=OsaurusDocs). These pages describe version **1.0.4**. Each version's notes are in the app under **Settings → About**.
:::

<JourneyCards>
  <JourneyCard to="/windows/installation" title="Install" icon="Download">
    Get Osaurus from the Microsoft Store, check what your PC needs, and find where your data lives.
  </JourneyCard>
  <JourneyCard to="/windows/quickstart" title="Get started" icon="Rocket">
    First launch: pick a model, meet the Orchestrator, and find your way around the app.
  </JourneyCard>
  <JourneyCard to="/windows/workflows" title="Workflows" icon="Workflow">
    Describe a task you do again and again, and Osaurus builds it into steps you can run with one click or on a schedule.
  </JourneyCard>
  <JourneyCard to="/windows/mac-differences" title="Windows and Mac" icon="Columns2">
    What's the same as Osaurus for Mac, what works differently, and what isn't on Windows.
  </JourneyCard>
</JourneyCards>

## What's new in 1.0

- **[Workflows](/windows/workflows).** Describe something you do often, and Osaurus builds it into steps you can test, run with one click, run on a schedule or when a folder changes, or hand to an agent.
- **[A new main window](/windows/chat).** Each agent's chats sit under it in the sidebar, **Ctrl+K** searches every chat, and Settings opens in the same window.
- **[Projects](/windows/projects).** Keep a job's chats, files, and memory together, and choose where its data may go.
- **[Voice](/windows/voice).** Call an agent, dictate into any app, or wake an agent by saying its name.
- **[Images and video](/windows/images)**, made by a model on your own graphics card.
- **[Coding plans](/windows/coding-plans).** Use GitHub Copilot or Antigravity with your own subscription.
- **[Devices & Sync](/windows/devices).** Your chats follow you to your other devices.

## The same Osaurus, built for Windows

Osaurus for Windows is a separate app written for Windows, not a copy of the Mac app. It shares Osaurus's ideas, your [account](/glossary#osaurus-id), and the local server that other apps connect to, so much of what the Mac pages describe works the same way. The [Windows and Mac](/windows/mac-differences) page lists what's different.

- **Local models run through llama.cpp** on your graphics card (NVIDIA through CUDA, or any recent GPU through Vulkan) or on your processor, instead of Apple's MLX.
- **Settings opens inside the main window**, from **Settings** at the bottom of the sidebar.
- **The same server, on the same port.** Apps that work with OpenAI, Anthropic, or Ollama connect to `http://127.0.0.1:1337`, as on a Mac. See the [HTTP API](/api).

## Where to read next

Pages under **Windows** in the top bar are written for the Windows app, one page for each feature, and each one says where it differs from the Mac. Start with [Chat](/windows/chat) and [Workflows](/windows/workflows), or browse the sidebar.

The rest of the site describes the Mac app. Its pages go into more depth on how features work, and the [HTTP API](/api) applies to Windows too.
