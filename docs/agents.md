---
title: Agents
sidebar_label: Agents
description: Create custom AI assistant personalities with unique behaviors, capabilities, and styles
---

# Agents

One AI doesn't fit all. When you're writing code, you want a focused technical assistant. When you're brainstorming, you want creativity. When you're researching, you want access to the web.

Agents let you create specialized AI assistants for different tasks—each with its own personality, tools, and visual style. Switch between them instantly.

## What is an Agent?

An agent is a saved configuration that defines how your AI assistant behaves. Each agent can have:

- **Custom System Prompt** — Define unique instructions and personality
- **Tool Configuration** — Enable or disable specific tools per agent
- **Visual Theme** — Assign a custom theme that activates with the agent
- **Model & Generation Settings** — Set default model, temperature, and max tokens
- **Import/Export** — Share agents as JSON files

## Accessing Agents

Open the Management window with **⌘⇧M**, then navigate to the **Agents** tab.

## Creating an Agent

1. Open the Management window (**⌘⇧M**)
2. Select **Agents** from the sidebar
3. Click **Create Agent**
4. Configure the agent settings (see below)
5. Click **Save**

## Agent Settings

### Name and Description

| Setting         | Description                              |
| --------------- | ---------------------------------------- |
| **Name**        | Display name for the agent               |
| **Description** | Brief description of the agent's purpose |

### System Prompt

The system prompt defines the agent's personality and behavior. This is sent as the first message in every conversation.

**Example for a Code Assistant:**

```
You are an expert software engineer. You write clean, efficient, and well-documented code. When asked to write code, you:
- Follow best practices and design patterns
- Include helpful comments
- Consider edge cases
- Suggest improvements when appropriate
```

**Example for a Creative Writer:**

```
You are a creative writing assistant with a flair for vivid descriptions and engaging narratives. You help users craft compelling stories, poems, and creative content. Your writing style is expressive and imaginative.
```

### Model Settings

Configure the default model behavior for this agent:

| Setting         | Description                                               |
| --------------- | --------------------------------------------------------- |
| **Model**       | Default model to use (e.g., `llama-3.2-3b-instruct-4bit`) |
| **Temperature** | Controls randomness (0.0 = deterministic, 1.0 = creative) |
| **Max Tokens**  | Maximum length of generated responses                     |

**Tips:**

- Use lower temperature (0.1–0.3) for code and factual tasks
- Use higher temperature (0.7–0.9) for creative writing
- Adjust max tokens based on expected response length

### Tool Configuration

Enable or disable specific tools for each agent. This lets you create focused assistants:

| Tool State   | Description                            |
| ------------ | -------------------------------------- |
| **Enabled**  | Tool is available for the agent to use |
| **Disabled** | Tool is hidden from the agent          |

**Example configurations:**

- **Code Assistant** — Enable `osaurus.git`, `osaurus.filesystem`; disable `osaurus.search`
- **Research Helper** — Enable `osaurus.search`, `osaurus.fetch`; disable `osaurus.filesystem`
- **Pure Chat** — Disable all tools for distraction-free conversation

### Visual Theme

Assign a custom theme that activates automatically when you switch to this agent. Each agent can have its own color scheme, creating a visual distinction between different assistants.

### Sandbox

Each agent can execute code in an isolated Linux VM powered by Apple's Containerization framework. Inside the sandbox, every agent gets its own Linux user (`agent-{name}`) and home directory at `/workspace/agents/{name}/`. This means agents can run arbitrary shell commands, install packages, and modify files without any risk to your Mac — and without interfering with each other.

Enable `autonomous_exec` on an agent to give it access to write and execution tools inside the sandbox. Read-only sandbox tools are always available.

:::info
The Sandbox requires macOS 26 (Tahoe) or later. See the [Sandbox guide](/sandbox) for setup, configuration, and plugin authoring.
:::

## Example Agents

### Code Assistant

A focused programming assistant with code-related tools enabled.

| Setting       | Value                                    |
| ------------- | ---------------------------------------- |
| Name          | Code Assistant                           |
| Temperature   | 0.2                                      |
| Enabled Tools | filesystem, git                          |
| System Prompt | "You are an expert software engineer..." |

### Daily Planner

An assistant for task management and scheduling.

| Setting       | Value                                 |
| ------------- | ------------------------------------- |
| Name          | Daily Planner                         |
| Temperature   | 0.5                                   |
| Enabled Tools | time                                  |
| System Prompt | "You are a productivity assistant..." |

### Research Helper

A web-savvy assistant for information gathering.

| Setting       | Value                             |
| ------------- | --------------------------------- |
| Name          | Research Helper                   |
| Temperature   | 0.4                               |
| Enabled Tools | search, fetch                     |
| System Prompt | "You are a research assistant..." |

### Creative Writer

A high-temperature assistant for creative tasks.

| Setting       | Value                                     |
| ------------- | ----------------------------------------- |
| Name          | Creative Writer                           |
| Temperature   | 0.9                                       |
| Enabled Tools | (none)                                    |
| System Prompt | "You are a creative writing assistant..." |

## Managing Agents

### Switching Agents

1. Click the agent selector in the chat window
2. Choose the agent you want to use
3. The theme and settings change immediately

### Editing an Agent

1. Open Management window (**⌘⇧M**) → **Agents**
2. Click on the agent you want to edit
3. Make your changes
4. Click **Save**

### Deleting an Agent

1. Open Management window (**⌘⇧M**) → **Agents**
2. Click on the agent
3. Click **Delete**
4. Confirm deletion

## Import and Export

Share agents with others or back them up as JSON files.

### Exporting an Agent

1. Open Management window (**⌘⇧M**) → **Agents**
2. Select the agent to export
3. Click **Export**
4. Choose a save location

### Importing an Agent

1. Open Management window (**⌘⇧M**) → **Agents**
2. Click **Import**
3. Select an agent JSON file
4. The agent is added to your list

### Agent File Format

Exported agents are JSON files containing all settings:

```json
{
  "name": "Code Assistant",
  "description": "Expert programming assistant",
  "systemPrompt": "You are an expert software engineer...",
  "model": "llama-3.2-3b-instruct-4bit",
  "temperature": 0.2,
  "maxTokens": 2048,
  "enabledTools": ["osaurus.filesystem", "osaurus.git"],
  "theme": "dark-blue"
}
```

## Agents with Multi-Window

Agents work seamlessly with [Multi-Window Chat](/multi-window):

- Each window can have a different active agent
- Run multiple agents simultaneously (e.g., Code Assistant in one window, Research Helper in another)
- Right-click a session to open it in a new window with its original agent

## Tips and Best Practices

1. **Start with templates** — Begin with the example agents and customize them
2. **Be specific in system prompts** — Detailed instructions yield better results
3. **Match temperature to task** — Low for precision, high for creativity
4. **Limit tools thoughtfully** — Fewer tools can mean more focused responses
5. **Use themes for context** — Visual distinction helps you stay oriented
6. **Export regularly** — Back up your custom agents

---

<p align="center">
  For multi-window usage with agents, see the <a href="/multi-window">Multi-Window Chat</a> guide.
</p>
