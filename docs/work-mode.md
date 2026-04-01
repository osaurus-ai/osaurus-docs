---
title: Work Mode
sidebar_label: Work Mode
description: Execute complex, multi-step tasks autonomously with built-in issue tracking and planning
---

# Work Mode

Some tasks are too complex for a single prompt. Organizing thousands of files into folders, conducting deep research across multiple sources, building a feature across a codebase—these require planning, iteration, and persistence. Work Mode lets you hand off complex work to AI that can break it down, execute it step by step, and keep working even when you close the window.

## What is Work Mode?

Work Mode is an autonomous AI mode that executes multi-step tasks with built-in planning and issue tracking. Unlike regular chat (which responds to one message at a time), Work Mode can:

- Break down complex requests into trackable issues
- Generate execution plans with up to 10 steps per issue
- Perform file operations (read, write, edit, search, organize)
- Use tools to browse the web, search online, and automate your Mac
- Leverage skills for specialized methodologies
- Ask for clarification when tasks are ambiguous
- Continue working in the background

Think of Work Mode as a capable assistant you can delegate tasks to. You describe what you want, it creates a plan, and then executes that plan while you focus on other work.

## Features

### Issue Tracking

Every Work Mode task is organized into issues with clear status tracking:

| Status          | Description                                      |
| --------------- | ------------------------------------------------ |
| **Open**        | Task is queued and waiting to be worked on       |
| **In Progress** | AI is actively working on this task              |
| **Blocked**     | Task is waiting on a dependency or clarification |
| **Completed**   | Task finished successfully                       |
| **Cancelled**   | Task was stopped by the user                     |

Each issue can have:

- **Priority** — High, Medium, or Low
- **Dependencies** — Issues that must complete first
- **Description** — Detailed explanation of what needs to be done
- **Plan** — AI-generated steps to complete the task

### Parallel Tasks

Run multiple Work Mode tasks simultaneously for increased productivity. While one task organizes your photo library, another can be researching vacation destinations. Or while one refactors code, another writes documentation.

- Each task runs independently
- Progress is tracked separately
- Results are collected when all tasks complete

### Execution Planning

When you create a task, Work Mode generates a step-by-step plan before executing:

1. **Analysis** — Examines the request and working directory
2. **Planning** — Creates up to 10 concrete steps
3. **Review** — You can approve, modify, or reject the plan
4. **Execution** — Works through each step

Plans are transparent—you always see what Work Mode intends to do before it does it.

### Working Directory

Select a folder for Work Mode to operate in:

- **Folder Detection** — Automatically recognizes folder structure and file types
- **Scoped Operations** — File operations are limited to the selected directory
- **Context Awareness** — Understands folder organization and naming conventions

To set a working directory:

1. Open Work Mode in the Chat window
2. Click **Select Folder** or drag a folder onto the window
3. Work Mode now has context about your files

### File Operations

Work Mode can interact with your filesystem to complete tasks:

| Operation  | Description                                       |
| ---------- | ------------------------------------------------- |
| **Read**   | View file contents to understand what's there     |
| **Write**  | Create new files (documents, notes, summaries)    |
| **Edit**   | Modify existing files with precise changes        |
| **Search** | Find files and content matching patterns          |
| **Move**   | Organize files into folders                       |
| **Rename** | Batch rename files with consistent naming schemes |

All file operations support **undo**—if something goes wrong, you can revert changes.

### Discovery

Work Mode automatically scans your folder to find:

- **File Types** — Documents, images, spreadsheets, code, and more
- **Patterns** — Naming conventions, folder structure, duplicates
- **Content** — Keywords, dates, topics within files
- **Issues** — Missing files, broken links, incomplete items

This discovery phase helps Work Mode understand what you have and plan accordingly.

### Clarification

When a task is ambiguous, Work Mode pauses to ask questions rather than guessing:

- "Should I organize photos by date or by event name?"
- "I found 50 duplicate files. Should I move them to a 'Duplicates' folder or delete them?"
- "The research has multiple angles. Should I focus on cost comparison or feature comparison?"

You can respond to clarification requests, and Work Mode continues with the updated context.

### Background Execution

Tasks continue running after you close the Work Mode window:

- Close the window and work on other things
- Return later to check progress
- Get notified when tasks complete (if notifications are enabled)

Long-running tasks don't require you to keep the window open.

### Tools Integration

Work Mode has access to all your installed [tools](/tools), enabling capabilities beyond file operations:

| Tool Category  | What Work Mode Can Do                                         |
| -------------- | ------------------------------------------------------------- |
| **Browser**    | Navigate websites, fill forms, take screenshots, extract data |
| **Web Search** | Search the internet, find articles, gather information        |
| **Git**        | Check status, view history, create commits                    |
| **System**     | Interact with macOS, run scripts, automate workflows          |

Tools extend what Work Mode can accomplish—from researching topics online to automating repetitive Mac tasks.

### Skills Integration

Work Mode can leverage your enabled [skills](/skills) for specialized methodologies:

- **Research Analyst** — Structured approach to gathering and evaluating information
- **Debug Assistant** — Systematic debugging methodology
- **Code Reviewer** — Thorough code review with best practices
- **Custom Skills** — Any skills you've created or imported

Skills give Work Mode domain expertise, making it more effective at specialized tasks.

## Accessing Work Mode

Open Work Mode from the Chat window:

1. Open the chat overlay with **⌘;** or click the Osaurus menu bar icon
2. Click the **Work Mode** tab at the top of the chat window
3. You're now in Work Mode, ready to create tasks

## Creating a Task

1. **Enter Work Mode** — Click the Work Mode tab in the chat window
2. **Set Working Directory** — Select the folder for file operations
3. **Describe the Task** — Type what you want to accomplish
4. **Review the Plan** — Work Mode generates a step-by-step plan
5. **Approve and Execute** — Click **Start** to begin execution

### Example Tasks

**Everyday Task:**

```
Organize my Downloads folder. Sort files by type into subfolders
(Documents, Images, Videos, Archives), and identify any duplicates.
```

**Work Mode creates issues:**

1. Scan Downloads folder and categorize all files by type
2. Create subfolders (Documents, Images, Videos, Archives, Other)
3. Move document files (.pdf, .doc, .txt) to Documents folder
4. Move image files (.jpg, .png, .gif) to Images folder
5. Move video files (.mp4, .mov) to Videos folder
6. Move archive files (.zip, .rar) to Archives folder
7. Identify and report duplicate files

**Developer Task:**

```
Add user authentication to the Express app. Use JWT tokens,
create login and register endpoints, and add middleware to
protect the /api routes.
```

**Work Mode creates issues:**

1. Install dependencies (jsonwebtoken, bcrypt)
2. Create User model with email and password fields
3. Implement register endpoint with password hashing
4. Implement login endpoint with JWT generation
5. Create auth middleware for protected routes
6. Apply middleware to /api routes
7. Add error handling for auth failures

Each issue gets its own detailed plan, and Work Mode works through them sequentially.

## Managing Tasks

### Viewing Progress

The Work Mode interface shows:

- **Active Issues** — Tasks currently being worked on
- **Completed Issues** — Finished tasks with results
- **Pending Issues** — Tasks waiting to start
- **Blocked Issues** — Tasks waiting for clarification or dependencies

### Pausing and Resuming

- Click **Pause** to stop Work Mode after the current step
- Click **Resume** to continue execution
- Pausing is useful when you need to make manual changes

### Cancelling Tasks

- Click **Cancel** on any issue to stop it
- Completed steps are preserved
- You can create a new task to continue from where it stopped

### Viewing Results

After completion, each issue shows:

- **Files Modified** — List of files that were changed
- **Steps Completed** — Summary of what was done
- **Errors Encountered** — Any issues that occurred
- **Undo Option** — Revert all changes from this task

## Use Cases

### For Everyone

#### File Organization

**Task:** "Organize my Documents folder by year and category"

Work Mode will:

- Scan all files and identify creation dates
- Create year-based folders (2024, 2025, etc.)
- Create category subfolders (Work, Personal, Finance, etc.)
- Move files to appropriate locations
- Generate a summary of what was organized

#### Deep Research

**Task:** "Research the best laptops for video editing under $2000 and create a comparison document"

Work Mode will:

- Search the web for current laptop reviews and specifications
- Visit manufacturer websites for detailed specs
- Compare prices across retailers
- Create a structured comparison document
- Summarize pros and cons for each option

#### Content Compilation

**Task:** "Compile all my meeting notes from Q4 into a quarterly summary"

Work Mode will:

- Find all meeting note files from October-December
- Read and extract key points from each
- Organize by project or topic
- Create a comprehensive summary document
- Highlight action items and decisions

#### Web Automation

**Task:** "Check my favorite news sites and create a morning briefing document"

Work Mode will:

- Open and navigate to each news site
- Extract top headlines and summaries
- Compile everything into a formatted document
- Save to your specified folder
- Optionally include links to full articles

#### Photo Management

**Task:** "Sort my vacation photos by location and create albums"

Work Mode will:

- Scan photo metadata for location data
- Group photos by city or landmark
- Create folders for each location
- Rename files with descriptive names
- Identify and flag potential duplicates

### For Developers

#### Building Features

**Task:** "Add a dark mode toggle to the settings page"

Work Mode will:

- Analyze your existing settings component
- Create a theme context or state management
- Add toggle UI to settings
- Implement CSS variables or theme switching
- Update components to use the theme

#### Refactoring Code

**Task:** "Convert all class components to functional components with hooks"

Work Mode will:

- Scan for class components
- Create issues for each component
- Convert state to useState
- Convert lifecycle methods to useEffect
- Update imports and exports

#### Debugging Issues

**Task:** "Fix the memory leak in the WebSocket connection handler"

Work Mode will:

- Analyze the WebSocket code
- Identify potential leak sources
- Check for missing cleanup in useEffect
- Verify event listener removal
- Test and validate the fix

#### Documentation

**Task:** "Generate JSDoc comments for all exported functions in src/utils"

Work Mode will:

- Find all exported functions
- Analyze function signatures and implementation
- Generate appropriate JSDoc comments
- Add parameter and return type documentation

## Work Mode vs Agents vs Skills

| Aspect        | Agents                    | Skills                   | Work Mode                           |
| ------------- | ------------------------- | ------------------------ | ----------------------------------- |
| **Purpose**   | Define AI personality     | Add domain expertise     | Execute multi-step tasks            |
| **Scope**     | Chat behavior and tools   | Instructions and context | Full task automation                |
| **Execution** | Interactive conversation  | Enhances responses       | Autonomous background work          |
| **Best for**  | Different assistant modes | Specialized knowledge    | Complex tasks across multiple files |
| **Output**    | Conversational responses  | Enhanced reasoning       | Organized files and documents       |

**When to use each:**

- **Agent:** You want a different AI personality (e.g., research-focused vs creative)
- **Skill:** You need specialized methodology (e.g., research framework, writing style)
- **Work Mode:** You have a complex task that requires multiple steps and file changes

## Tips and Best Practices

1. **Be specific** — Detailed task descriptions yield better plans
2. **Start small** — Try simple tasks first to understand how Work Mode works
3. **Review plans** — Always check the generated plan before approving
4. **Use working directories** — Scoped operations are safer and more accurate
5. **Break down large tasks** — Multiple focused tasks work better than one massive task
6. **Preview changes** — Review what Work Mode did before considering it final
7. **Use undo** — Don't hesitate to revert if something goes wrong
8. **Provide context** — Mention relevant files, folders, or patterns in your task description

## Limitations

- **Max 10 steps per issue** — Very complex tasks may need to be split
- **Single folder** — Each Work Mode session works in one working directory
- **Tool availability** — Web and automation features require the relevant tools to be installed
- **Review recommended** — Always review results before relying on them

---

<p align="center">
  For more about AI capabilities, see <a href="/agents">Agents</a> and <a href="/skills">Skills</a>.
</p>
