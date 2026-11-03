---
title: Osaurus for Windows
sidebar_label: Overview
description: Osaurus for Windows is a free app for AI assistants that remember you, work on your files, and keep your data on your PC. Local models run on your graphics card; cloud models are there when you want them.
slug: /
---

# Osaurus for Windows

Osaurus for Windows is a free app for using AI on your PC. You chat with AI assistants (called [agents](/glossary#agent)) that remember what matters to you, work on files in folders you choose, and can be reached from your phone. Your chats, memories, and settings stay on your PC.

You choose the AI "brain" (the [model](/glossary#model)) behind each assistant. It can be a [local model](/glossary#local-model) that runs on your PC and works offline, or a [cloud model](/glossary#cloud-model) such as GPT, Claude, or Gemini when you want one. Nothing leaves your PC unless you pick a cloud model or turn on a feature that needs the internet.

:::info[Public beta]
Osaurus for Windows is in public beta on Windows 11, from the [Microsoft Store](https://apps.microsoft.com/store/detail/9P2W5T5WTTZ1?cid=OsaurusDocs). These pages describe version **0.1.9**. Release notes are posted in the [community forum](https://community.osaurus.ai/tag/windows/2).
:::

<JourneyCards>
  <JourneyCard to="/windows/installation" title="Install" icon="Download">
    Get Osaurus from the Microsoft Store, check what your PC needs, and find where your data lives.
  </JourneyCard>
  <JourneyCard to="/windows/quickstart" title="Get started" icon="Rocket">
    First launch: pick a model, meet the Orchestrator, and find your way around Control Center.
  </JourneyCard>
  <JourneyCard to="/windows/mac-differences" title="Windows and Mac" icon="Columns2">
    What's the same as Osaurus for Mac, what works differently, and what isn't on Windows yet.
  </JourneyCard>
  <JourneyCard to="/windows/cli" title="Command line" icon="Terminal">
    The osaurus command: start and stop the server, pull models, connect MCP clients, and install bundles.
  </JourneyCard>
</JourneyCards>

## The same Osaurus, built for Windows

Osaurus for Windows is a separate app written for Windows, not a copy of the Mac app. It shares Osaurus's ideas, your [account](/glossary#identity), and the local server that other apps connect to, so most of what the rest of these docs describe works the same way. The [Windows and Mac](/windows/mac-differences) page lists what's different.

- **Local models run through llama.cpp** on your graphics card (NVIDIA through CUDA, or any recent GPU through Vulkan) or on your processor, instead of Apple's MLX.
- **Settings live in Control Center**, the Windows counterpart of the Mac's **Settings…** window.
- **The same server, on the same port.** Apps that work with OpenAI, Anthropic, or Ollama connect to `http://127.0.0.1:1337`, as on a Mac. See the [HTTP API](/api).

## Where to read next

Pages under **Windows** in the top bar are written for the Windows app. The rest of the site describes the Mac app; for features that work the same on both, those pages apply to Windows too, though menu names and file paths will differ.
