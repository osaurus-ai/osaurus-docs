---
title: Watchers
sidebar_label: Watchers
description: Monitor folders for file system changes and automatically trigger AI tasks
---

# Watchers

Some tasks should happen automatically when your files change. A new file lands in your Downloads folder, a screenshot appears on your Desktop, or a shared document gets updated—Watchers detect these changes and trigger AI tasks in response, so you don't have to do it manually.

## What is a Watcher?

A watcher monitors a folder on your Mac for file system changes—files added, modified, or removed—and automatically triggers an AI task when something happens. Think of it as a folder automation powered by your AI assistant.

Each watcher includes:

- **Folder** — The directory to monitor
- **Responsiveness** — How quickly to react to changes
- **Agent** — Which AI assistant handles the triggered task
- **Instructions** — The prompt sent when changes are detected
- **Recursive Monitoring** — Optionally watch subdirectories too

## Features

- **Folder Monitoring** — Watch any directory for file system changes using FSEvents
- **Configurable Responsiveness** — Fast (~200ms), Balanced (~1s), or Patient (~3s) debounce timing
- **Recursive Monitoring** — Optionally monitor subdirectories
- **Agent Integration** — Assign an agent to handle triggered tasks
- **Manual Trigger** — Run any watcher immediately with "Trigger Now"
- **Convergence Loop** — Smart re-checking ensures the directory stabilizes before stopping
- **Pause/Resume** — Temporarily disable watchers without deleting them

## Accessing Watchers

Open the Management window with **⌘⇧M**, then navigate to the **Watchers** tab.

## Creating a Watcher

1. Open Management window (**⌘⇧M**) → **Watchers**
2. Click **Create Watcher**
3. Configure the watcher settings:
   - **Name** — Give your watcher a descriptive name
   - **Folder** — Select the directory to monitor
   - **Responsiveness** — Choose how quickly to react
   - **Recursive** — Toggle subdirectory monitoring
   - **Agent** — Select which agent handles the task
   - **Instructions** — Write the prompt to send when changes are detected
4. Click **Save**

## Watcher Settings

### Name and Description

| Setting         | Description                                |
| --------------- | ------------------------------------------ |
| **Name**        | Display name for the watcher               |
| **Description** | Optional notes about the watcher's purpose |

### Folder Selection

Choose any folder on your Mac to monitor. Click **Select Folder** or drag a folder onto the field.

:::tip Scope
Choose specific folders rather than broad directories like your home folder. Monitoring large directory trees generates many events and may impact performance.
:::

### Responsiveness

Control how quickly the watcher reacts to file system changes. Debouncing prevents the watcher from triggering repeatedly during rapid changes (like copying multiple files at once).

| Level         | Debounce | Best For                                   |
| ------------- | -------- | ------------------------------------------ |
| **Fast**      | ~200ms   | Small folders with infrequent changes      |
| **Balanced**  | ~1s      | General-purpose monitoring                 |
| **Patient**   | ~3s      | Large batch operations, file syncing       |

### Recursive Monitoring

Toggle whether the watcher monitors subdirectories:

| Setting         | Description                                          |
| --------------- | ---------------------------------------------------- |
| **Enabled**     | Monitor the selected folder and all subdirectories   |
| **Disabled**    | Monitor only the top-level folder                    |

### Agent Selection

Assign an agent to handle the triggered task:

1. Select an agent from the dropdown
2. The agent's system prompt and tool configuration apply when the watcher triggers
3. Different watchers can use different agents

### Instructions

Write the prompt that's sent when the watcher detects changes:

**Example for Downloads organizer:**

```
New files have appeared in my Downloads folder. Please:
1. Identify the file types
2. Move documents (.pdf, .doc, .txt) to ~/Documents/Downloads
3. Move images (.jpg, .png, .gif) to ~/Pictures/Downloads
4. Move archives (.zip, .rar) to ~/Documents/Archives
5. Leave anything else in place and let me know what's there
```

**Example for screenshot manager:**

```
A new screenshot has been saved. Please:
1. Read the screenshot filename
2. Rename it with a descriptive name based on the date and content
3. Move it to ~/Pictures/Screenshots organized by month
```

## Managing Watchers

### Viewing Watchers

The Watchers tab shows all your configured watchers with:

- Watcher name
- Monitored folder path
- Assigned agent
- Status (active/paused)

### Editing a Watcher

1. Open Management window (**⌘⇧M**) → **Watchers**
2. Click on the watcher you want to edit
3. Modify the settings
4. Click **Save**

### Pausing and Resuming

Temporarily disable a watcher without deleting it:

1. Find the watcher in the list
2. Click the toggle to pause or resume
3. Paused watchers stop monitoring until resumed

This is useful when:

- You're doing bulk file operations and don't want triggers
- You need to temporarily reduce system resource usage
- You want to test changes to watcher settings

### Triggering Manually

Run any watcher on demand:

1. Click on the watcher
2. Click **Trigger Now**
3. The watcher executes immediately with your configured agent and instructions

This is useful for:

- Testing new watchers
- Processing files that arrived while the watcher was paused
- Running a one-time cleanup using your watcher's instructions

### Deleting a Watcher

1. Open Management window (**⌘⇧M**) → **Watchers**
2. Click on the watcher
3. Click **Delete**
4. Confirm deletion

## How Watchers Work

### FSEvents Integration

Watchers use macOS FSEvents to efficiently monitor the file system. FSEvents is the same technology that powers Spotlight and Time Machine—it's low overhead and reliable.

### Convergence Loop

When changes are detected, the watcher doesn't just fire once. It uses a convergence loop:

1. **Detect** — File system change is noticed
2. **Debounce** — Wait for the configured responsiveness period
3. **Trigger** — Send the task to the assigned agent
4. **Re-check** — After the task completes, scan the directory again
5. **Stabilize** — If no new changes are found, the watcher returns to idle

This ensures that multi-step file operations (like copying a large folder) are fully complete before the AI acts on them.

## Use Cases

### Downloads Organizer

Automatically sort downloaded files by type.

| Setting         | Value                                              |
| --------------- | -------------------------------------------------- |
| Name            | Downloads Organizer                                |
| Folder          | ~/Downloads                                        |
| Responsiveness  | Balanced                                           |
| Agent           | File Assistant                                     |
| Instructions    | "Sort new files by type into Documents, Images, Videos, and Archives subfolders." |

### Screenshot Manager

Rename and organize screenshots as they're captured.

| Setting         | Value                                              |
| --------------- | -------------------------------------------------- |
| Name            | Screenshot Manager                                 |
| Folder          | ~/Desktop                                          |
| Responsiveness  | Fast                                               |
| Agent           | File Assistant                                     |
| Instructions    | "Rename new screenshots with descriptive names and move to ~/Pictures/Screenshots." |

### Dropbox Automation

Process shared files automatically when they change.

| Setting         | Value                                              |
| --------------- | -------------------------------------------------- |
| Name            | Shared Files Processor                             |
| Folder          | ~/Dropbox/Shared                                   |
| Responsiveness  | Patient                                            |
| Recursive       | Enabled                                            |
| Agent           | Research Helper                                    |
| Instructions    | "Summarize any new or modified documents and save summaries to ~/Documents/Summaries." |

### Project File Monitor

Track changes in a project directory.

| Setting         | Value                                              |
| --------------- | -------------------------------------------------- |
| Name            | Project Monitor                                    |
| Folder          | ~/Projects/my-app                                  |
| Responsiveness  | Patient                                            |
| Recursive       | Enabled                                            |
| Agent           | Code Assistant                                     |
| Instructions    | "Review any changed files and flag potential issues or suggest improvements." |

## Tips and Best Practices

1. **Start with one watcher** — Test with a single folder before setting up multiple watchers
2. **Use descriptive names** — Make it easy to identify what each watcher does
3. **Choose appropriate responsiveness** — Fast for small folders, Patient for busy directories
4. **Be specific in instructions** — Tell the AI exactly what to do with different file types
5. **Use Balanced for most cases** — The 1-second debounce works well for general use
6. **Pause during bulk operations** — Avoid unnecessary triggers when moving many files manually
7. **Match agent to task** — Choose an agent with the right tools enabled (e.g., filesystem tools)
8. **Monitor resource usage** — Many active watchers with recursive monitoring can use more CPU

## Troubleshooting

### Watcher Not Triggering

- **Check if Osaurus is running** — Watchers require the app to be active
- **Verify the watcher is enabled** — Paused watchers don't monitor
- **Check the folder path** — Ensure the monitored folder still exists
- **Try "Trigger Now"** — Test manual execution to verify the agent and instructions work

### Too Many Triggers

- **Increase responsiveness** — Switch from Fast to Balanced or Patient
- **Disable recursive monitoring** — Reduce the scope of monitored directories
- **Narrow the folder** — Monitor a more specific subdirectory

### Slow Performance

- **Reduce active watchers** — Each watcher uses system resources
- **Avoid monitoring large trees** — Recursive monitoring on broad directories is expensive
- **Use Patient responsiveness** — Longer debounce reduces processing frequency

---

<p align="center">
  For creating custom AI assistants to use with watchers, see the <a href="/agents">Agents</a> guide.
</p>
