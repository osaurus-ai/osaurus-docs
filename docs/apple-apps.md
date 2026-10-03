---
title: Apple Apps
sidebar_label: Apple Apps
description: Let your agents use Calendar, Reminders, Contacts, Notes, Mail, Messages, Maps, Music, and Shortcuts — off until you turn them on, and Osaurus always asks before sending or deleting anything.
---

# Apple Apps

Your [agents](/glossary#agent) can work with the Apple apps you already use: **Calendar, Reminders, Contacts, Notes, Mail, Messages, Maps & Location, Music, and Shortcuts**. For example, an agent can add a meeting to your calendar, find a contact, or draft an email. They're built in, so there's nothing extra to install. Each app is off until you turn it on for a specific agent, and Osaurus always asks before an agent sends a message or deletes something.

## Get started

1. Open **Settings…** (`⌘ ,`) → **Agents**, pick one of your own agents, and go to **Abilities → Tools**.
2. Find the Apple app in the list. Each app is a group, listed above plugins and other tools.
3. Tick the app's group (or any of its rows, marked **Per app**). This turns on everything that app can do. You can't turn on only part of an app.
4. When macOS asks for permission, click **Allow**.

When you create a new agent, the **Customize…** picker in the Create Agent sheet offers the same choices.

:::note[The Orchestrator doesn't call these itself]
The [Orchestrator](/orchestrator) doesn't use Apple apps directly. Instead, it can set them up on your agents for you. Ask *"give my Mail agent access to Calendar too"* or *"make a Personal Organizer agent with Calendar and Reminders"*. It changes the agent after you approve the plan, then hands the task to it.
:::

## macOS permissions

Turning an app on asks macOS for the matching permission straight away:

| App | macOS permission | Notes |
|---|---|---|
| Calendar | Calendars (Full Access) | |
| Reminders | Reminders (Full Access) | |
| Contacts | Contacts | |
| Notes | [Automation](/glossary#automation-permission) → Notes | |
| Mail | Automation → Mail | |
| Messages | [Full Disk Access](/glossary#full-disk-access) **and** Automation → Messages | macOS doesn't pop up a request for Full Disk Access. Turn it on yourself in System Settings. |
| Maps & Location | Location | |
| Music | Automation → Music | |
| Shortcuts | None | Individual shortcuts may ask for their own permissions |

If you said no to a permission, the app stays on but shows a **Permission needed** badge. Click the badge. Osaurus asks again if macOS allows it, or opens the right page in System Settings so you can turn it on there. You can also review these permissions in **Settings… → Permissions**.

## Osaurus asks before sending or deleting

Most actions follow your normal [tool permission](/tools#tool-permissions) setting, which asks you first by default. Two kinds of action **always** show an [approval](/glossary#approval) card, every time, whatever your setting:

- **Sending** a message or an email.
- **Deleting** a calendar event or a reminder.

No setting can make sending silent. If you set Mail to run automatically, that only covers saving drafts.

When the Orchestrator turns on Mail, Messages, or Shortcuts for an agent, its plan also includes a warning, because these apps can act for you: send mail or messages, or run any shortcut.

## Good to know

- **Repeating events.** Changing or deleting a repeating event only affects the one you mean. "Move my standup tomorrow" never changes the whole series.
- **Notes with attachments.** Osaurus won't add text to a note that has attachments, so nothing gets lost. It can create a new note or open the existing one instead.
- **Messages.** Osaurus checks whether a message was delivered before falling back to SMS, and never sends twice if it isn't sure.
- **Shortcuts.** A shortcut that pops up a question ("Ask Each Time") or a result window ("Show Result") will wait for you. Stopping the chat stops the shortcut.
- **Location.** When macOS asks whether Osaurus can use your location, the agent waits for your answer (up to 2 minutes).
- **Off means off.** If an app is off for an agent, that agent can't reach it in any way.
- **Outside apps can't use these.** Apps that connect to Osaurus from outside can't use your Apple apps.

There's no Weather tool.

---

## Under the hood

### Tools per app

| App | Tools |
|---|---|
| Calendar | `calendar_list`, `calendar_events`, `calendar_create_event`, `calendar_update_event`, `calendar_delete_event`, `calendar_open_event` |
| Reminders | `reminders_lists`, `reminders_fetch`, `reminders_create`, `reminders_update`, `reminders_complete`, `reminders_delete`, `reminders_open` |
| Contacts | `contacts_me`, `contacts_search`, `contacts_list`, `contacts_get`, `contacts_create`, `contacts_update`, `contacts_open` |
| Notes | `notes_folders`, `notes_list`, `notes_search`, `notes_read`, `notes_create`, `notes_append`, `notes_open` |
| Mail | `mail_mailboxes`, `mail_list`, `mail_read`, `mail_search`, `mail_compose`, `mail_reply`, `mail_move`, `mail_set_status`, `mail_thread` |
| Messages | `messages_conversations`, `messages_read`, `messages_unread`, `messages_search`, `messages_send` |
| Maps & Location | `location_current`, `location_geocode`, `location_reverse_geocode`, `maps_search`, `maps_explore`, `maps_directions`, `maps_eta`, `maps_open` |
| Music | `music_now_playing`, `music_playback`, `music_set_volume`, `music_playlists`, `music_search`, `music_play` |
| Shortcuts | `shortcuts_list`, `shortcuts_run` |

Notes, Mail, Music, and Messages sending use AppleScript; reading Messages needs Full Disk Access.

### Approval enforcement

`messages_send`, `mail_compose` / `mail_reply` when set to send, `calendar_delete_event`, and `reminders_delete` always require approval. This is enforced when the tool runs, not just in the UI, so neither the Tools catalog nor a declarative config can make a send silent. For `mail_compose` and `mail_reply`, an **Auto** policy covers drafts only.

### Tool behavior details

- Updating or deleting a recurring event requires the specific occurrence.
- `notes_append` refuses notes that have attachments; use `notes_create` or `notes_open` instead.
- `messages_send` checks delivery before falling back to SMS, and never re-sends when the outcome is unknown.
- `shortcuts_run` output is capped at 1 MiB.
- `location_current` waits for the macOS location dialog (up to 2 minutes) instead of failing while it's on screen.

### Off means off

When an app is off for an agent, its tools are stripped from the [prompt](/glossary#prompt) in both automatic and manual tool modes, tool discovery never returns them, and a direct call is refused unless the *current* agent has that app enabled.

Apple app tools are on the **external deny list**. They're hidden from the [MCP](/glossary#mcp) tool list and refused for outside HTTP [API](/glossary#api) callers, including MCP clients and `/agents/{id}/run`. Plugins and MCP servers can't register a tool whose name collides with a built-in Apple tool.

### Declarative configuration

`apple_apps` is a list under an agent's `capabilities`. The list **replaces** the agent's whole set, and `[]` turns every app off.

```yaml
agents:
  - name: Personal Organizer
    capabilities:
      tools_enabled: true
      apple_apps: [calendar, reminders, contacts]
```

Values: `calendar`, `reminders`, `contacts`, `notes`, `mail`, `messages`, `maps`, `music`, `shortcuts` (case-insensitive). `location`, `imessage`, `apple notes`, and `apple music` are accepted as aliases.

### Migrating from the Apple plugins

These built-ins replace the former `osaurus.calendar`, `osaurus.reminders`, `osaurus.contacts`, `osaurus.notes`, `osaurus.mail`, `osaurus.messages`, `osaurus.maps`, and `osaurus.music` [plugins](/glossary#plugin).

The first time you launch after upgrading, Osaurus migrates once:

- For each custom agent that used tools from an installed Apple plugin, the old tools are removed from its tool list, and the matching built-in app is turned on.
- A one-time notice lists the affected apps and which agents already have them turned on.
- Installed copies of the old plugins are no longer loaded. Their marketplace cards show a **Built into Osaurus** banner that links to the native settings. Uninstall them whenever you like.

---

**Related:**

- [Agents](/agents): per-agent abilities and the tool picker
- [Tools](/tools): permission policies and the tool catalog
- [Computer Use](/computer-use): operating any app on screen, including the AppleScript helper
- [Security & Privacy](/security): what stays on your Mac
