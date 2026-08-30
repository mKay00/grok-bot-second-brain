# Create and manage Bots

Canonical URL: https://docs.x.ai/grok-bot/bots
Fetched: 2026-08-30

## Text

A Bot is a durable AI teammate with a name, a job, its own conversation, and working context that develops over time.

## Give each Bot a clear job

Create a separate Bot when the work has a distinct:

- Goal or area of ownership
- Set of tools and sources
- Working style
- Approval boundary
- Recurring schedule

Good jobs include Talent Scout, Expense Manager, and Bug Reproduction. A job such as General Helper gives the Bot less guidance and makes its saved context harder to reuse.

Describe the role in operational terms:

> Own the weekly account-health review. Pull product usage and support signals, flag evidence of churn or expansion, and produce a linked watch list for the customer-success team. Never contact a customer or change an account without approval.

## Create a Bot

1. Choose New in the sidebar or press `Cmd/Ctrl+N`.
2. In New chat, select Create new agent.
3. Grok Bot creates and opens a Bot named New Agent.
4. Open Bot actions → Edit Profile to set its name, title, description, and avatar.
5. Start a conversation with a concrete task.

Your existing Bots can also suggest or create a focused Bot when a job should have a long-lived owner. Ask before creating several Bots if you want to keep the roster small.

An account can have up to 50 Bots and group chats combined.

## Edit a Bot

Open the Bot menu to change its name or description. Update the description when you discover a durable preference, boundary, or responsibility that should shape future work.

Use the conversation for task-specific instructions. Use the description for rules that should remain true:

- Description: “Never send external messages without approval.”
- Message: “Draft follow-ups for these twelve accounts.”

## Pin or hide a Bot

- Pin active Bots to keep them at the top of the sidebar.
- Hide from sidebar removes a Bot from the main list without deleting its work.
- Open Show hidden chats at the bottom of the sidebar, then choose Unhide, to restore a hidden Bot.

Hiding does not pause the Bot or its routines.

## Duplicate a Bot

Duplicate a Bot when you want the same role as a starting point for a different scope—for example, one Account Health Bot per region.

The copy is named "` ` copy" and carries the profile, settings, enabled skills, routines, and avatar. It does not copy conversation history, learned memory, or chat attachments. Rename it and provide the new scope before assigning work.

## Share a Bot

Share a public link when someone else should start from the same Bot.

1. Open the Bot and copy its share link.
2. Send the link. The recipient opens a preview on x.ai and can choose Add to Grok Bot.
3. They need the Grok Bot app to finish adding it.

The link is public. Anyone who has it can view the Bot's shared configuration, including its identity, description, skills, and routines. Remove API keys, internal URLs, customer data, and anything else you would not put in a public document before you share.

Adding a shared Bot creates a copy on the recipient's account. It does not give them your computer, logins, or conversation history.

Shared Bots are created by other users, not by SpaceXAI. Adding one accepts the third-party bot terms.

## Delete a Bot

Deleting a Bot removes its active profile, conversation, and routines from Grok Bot. Shared computer files and sign-ins are not isolated by Bot and may remain on the computer. Backend retention follows the applicable Cursor terms.

If you may need the work later, hide the Bot instead.

## What a Bot remembers

A Bot can retain stable working preferences, important facts, and summaries from its work. This helps it keep a role over time without replaying every prior message.

Memory is not a substitute for an authoritative source:

- Keep changing facts in the source system
- Ask the Bot to cite or reopen current data for consequential decisions
- Correct stale assumptions directly
- Put explicit safety boundaries in the Bot description

Bots have separate roles and conversations, but they share the computer. They can pass context through direct messages, group chats, and shared files.

## Organize a team of Bots

Start with the smallest useful roster:

1. Give one Bot ownership of an end-to-end outcome.
2. Add another Bot only when the work has a stable specialist role.
3. Put Bots in a group chat when the handoff itself needs to be visible.
4. Keep external actions behind a clear approval boundary.

For example, a Website Launch group might include a launch coordinator, a content editor, and an analytics reviewer. The coordinator can assign work, while the group preserves the handoffs in one conversation.
