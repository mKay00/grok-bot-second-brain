# How does the vault survive a shared-computer reset?

Issue: [How does the vault survive a shared-computer reset?](https://github.com/mKay00/grok-bot-second-brain/issues/12)

## Answer

The durable snapshot is not enough. If the shared computer loses the path, the second brain is gone.

The setup questionnaire asks for an **off-box copy** right after path. The warning is required. Four answers, no silent default: git remote, folder on a machine they own, cloud storage, or skip.

- Git: they create a private remote and give the URL.
- Folder: no follow-up slot. Their disk is not this computer's business.
- Cloud: product name. Help text may say Google Drive, OneDrive, Dropbox. Not a closed list. Plugin if Settings → Plugins has one, otherwise the browser. No assumed Drive connector.
- Skip: they accepted the warning.

The copy is the whole path: vault, ledger directory, and `tasks/` when markdown is live. JSONL and SQLite files under that path are in. A Graphiti / Neo4j / FalkorDB store is not. Restore is copy that tree back onto the path.

Do not install a sync daemon on the VM. Manually installed packages are replaceable on Update.

Conductor talks through the method they picked. Memory does the first git push or cloud upload. Folder: the human copies on their machine; Memory has no standing job after that.

That first copy is a setup beat after the five bots exist, not a sixth first-task. Memory's first-task stays "append a candidate." Method is interpolated into Conductor and Memory.

Review point: first off-box copy, and any later method change. Later git pushes and uploads run.

Git and cloud: daily Memory routine, no-op if the path has not changed. Skip and folder: no routine.

The `PLAN.md` worked example uses skip. This repo still holds no personal remotes or product names.

Amends [What does the setup questionnaire ask?](https://github.com/mKay00/grok-bot-second-brain/issues/10) and [What must each bot prompt contain?](https://github.com/mKay00/grok-bot-second-brain/issues/9). Terms in `CONTEXT.md`. Prompt interpolation in `research/what-must-each-bot-prompt-contain.md`.
