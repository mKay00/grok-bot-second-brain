# Vault contract

This folder is the vault. The ledger directory (`memory/`), install metadata (`install/`), and the markdown task store (`tasks/`) sit beside it, not inside PARA.

## Tree

- `inbox.md` — vault inbox. Capture is the file owner.
- `working.md` — working file. Memory is the file owner.
- `drafts/` — unpublished outgoing text. Research is the file owner of every file here. Not a PARA folder.
- `01-projects/` — PARA projects. Each project is a folder, not a loose note.
- `02-areas/` — PARA areas. Each area is a folder.
- `03-resources/` — PARA resources. Each resource is a folder.
- `04-archives/` — PARA archives. Starts empty.

Note file name matches its folder.

## YAML

Required on every note and draft:

- `type`: `project` / `area` / `resource` / `archive` / `draft`
- `created`: `YYYY-MM-DD`
- `updated`: `YYYY-MM-DD`

Optional `status`: `active` / `done` / `archived`. Drafts use `draft` / `ready`.

The working file and the vault inbox have no YAML.

## Vault inbox line

One line per item:

`YYYY-MM-DDTHH:MMZ | source:<name> | text`

Copies from an extra inbox add `writeback:<tag|archive|leave|delete>` before the text. After the clarify fork, Capture deletes the line. No checkbox. No processed section.

## Working file

Seven headings, rewritten in place, never appended:

1. Identity (cap 300)
2. State (cap 400)
3. Decisions (cap 800)
4. Corrections (cap 600)
5. People (cap 500)
6. Dead (cap 400)
7. In-flight (cap 1000)

Ceiling 4000 tokens. When a section fills, Memory rewrites that section shorter. It does not steal from the others. In-flight is the live Task API `list_*` verbs for the GTD option in use.

## Drafts

A draft is unpublished outgoing text. Status stays `draft` or `ready`. A human publishes. The example file is a pattern: replace it or delete it.
