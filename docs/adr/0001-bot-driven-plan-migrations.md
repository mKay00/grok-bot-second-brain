# Bot-driven plan migrations without Node

Existing installs catch up when this consolidation plan repo changes. A setup-helper bot follows an upgrade prompt and applies ordered `migrations/` steps (`steps.md`, optional `up.sh`). There is no Node CLI on the upgrade path because the shared computer is not assumed to have Node, and day-to-day work already goes through that helper. Upgrade-ladder rung cutovers stay out of this sequence.
