# Skills and routines

Canonical URL: https://docs.x.ai/grok-bot/skills-routines-and-automations
Fetched: 2026-08-30

## Text

Turn a successful task into a repeatable process. Grok Bot uses two building blocks:

- A skill is a reusable set of instructions for how to do a task.
- A routine tells one Bot when to run a workflow—on a schedule or, where supported, after an event.

Start with a one-time task. Make it reliable, save the method as a skill, and only then automate it.

## Save a skill

A skill captures steps, decision rules, expected output, and safety boundaries. Skills are available across your Bots, although a Bot may need the relevant connector or login to use one.

Ask:

> Save the process we just used as a skill called “Weekly account health.” Include the source systems, risk definitions, output format, and the rule that customer contact always requires approval.

A useful skill states:

1. When to use it
2. Required inputs and access
3. The sequence of work
4. How to validate the result
5. What to return
6. What requires approval

Use Settings → Plugins to discover and install supported connectors and packaged skills. Type `/` in the desktop composer to reference a saved skill; use `@` for Bots, groups, routines, and connectors.

Installed private skills can be enabled per Bot. If a skill does not appear in the `/` menu, open it under Settings → Plugins → Yours and enable it for the current Bot.

## Teach a workflow by demonstration

When Teach a task is available, you can demonstrate a browser workflow instead of describing every step.

1. Open a one-to-one Bot conversation and its computer view.
2. Choose Teach a task.
3. Describe the result you are about to demonstrate.
4. Perform the workflow once.
5. Stop the recording and review the skill the Bot creates.
6. Test it on a safe example before scheduling it.

Teaching records visible computer interaction for up to ten minutes. It does not record microphone audio. Avoid exposing secrets during the demonstration; use the secure handoff flow for credentials.

The learned skill is a draft. Add decision rules, failure handling, and approval boundaries that may not be obvious from one example.

Teach-by-demonstration may be enabled gradually. If the control is not visible, ask the Bot to create a skill from written instructions and the completed task.

## Create a routine

Ask the Bot that should own the recurring job:

> Every weekday at 8:00 AM, run the Daily customer-risk skill against the current account list. Post a linked watch list in this conversation. Do not contact customers. If the source data is unavailable, report the failure instead of using old data.

Confirm:

- The owning Bot
- The schedule and time zone
- The input source
- The expected result
- The approval boundary
- What should happen when a source is missing

The Bot creates the routine and shows its next run. Background routines can run while your laptop is closed.

## Trigger work from an event

Cursor account integrations can start a routine from an event, such as a Slack message or a GitHub notification. They are separate from Slack or GitHub plugins and may require their own connection flow.

Define a narrow matching rule and a clear response:

> When a message in `#customer-escalations` contains a support ticket link and the phrase “needs repro,” open the ticket, reproduce the issue in staging, and post a repro pack in this conversation. Never post back to Slack without approval.

Avoid broad listeners such as “every new message.” They create noise, consume usage, and increase the chance of acting on irrelevant input.

## Test before enabling

Use Test run after creating or editing a routine.

> A test run performs real work. It can navigate websites, change files, and call connected tools. Use safe inputs and keep write actions behind approval.

Review:

- Whether it selected current inputs
- Whether the output meets the required format
- Whether every action has a source or audit trail
- Whether it stopped at the intended approval point
- Whether failure states are explicit

## Manage routines

Open the Bot, choose View conversation details, then open Routines to view its routines and recent runs. You can:

- Enable or pause a routine
- Run a test
- Edit its schedule or instructions
- Inspect recent success and failure history
- Delete it

A Bot can own up to 50 routines, and the app keeps the 20 most recent run records for each routine. Deleting a routine is immediate and has no undo. Deleting a Bot also removes routines owned by that Bot.

To control unattended usage, Grok Bot may ask whether to keep routines running after a long period away and pause them if there is no response. Review paused routines when you return.

## Design routines for trust

- Automate preparation before execution.
- Have the Bot draft, reconcile, or recommend first.
- Require approval for sending, purchasing, deleting, publishing, or changing production systems.
- Include a no-data and stale-data policy.
- Make retries idempotent where possible.
- Tell the Bot where to report partial completion.
- Re-test after a website, connector, or source format changes.

See Settings and notifications for time zone and usage controls, and Approvals, security, and privacy for automation boundaries.
