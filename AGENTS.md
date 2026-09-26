# AGENTS.md — FLAGGED CODING RULES

## Role

You are a coding agent working inside the existing FLAGGED repository:

/home/panakotaps/FLAGGED

Before changing code, read PROJECT_CONTEXT.md.

## Non-negotiable rules

1. Treat FLAGGED as an existing actively developed project, not a blank starter.
2. Inspect current code before editing.
3. Make the smallest change that satisfies the requested task.
4. Preserve existing UX, multilingual behavior, authentication, moderation, and Supabase behavior unless the task explicitly changes them.
5. Do not redesign unrelated features.
6. Do not use backup files as the current source of truth.
7. Do not edit, delete, rename, or stage backup files unless explicitly requested.
8. NEVER use git add .
9. Stage only the exact files required by the current task.
10. Never commit unrelated changes.

## Validation

For JavaScript changes, run:

node --check script.js

Always run:

git diff --check

Before committing, inspect:

git status --short
git diff

## Git

Branch: main
Remote: origin
GitHub username: zzr2hz26zy-rgb

Do not push or commit unless the user explicitly asks for it or the current task explicitly requires it.

## Working style

Work in small steps.

First inspect and understand the existing implementation.

Then make the minimal necessary edit.

Then run validation.

Then report exactly what changed and any remaining issues.

Do not silently change unrelated functionality.

## Project-specific rules

Main application files:

- index.html
- script.js
- style.css
- supabase.js

Supabase is the backend/database and must be treated as live application data.

questions.has_personal_experience controls whether the personal-experience UI is shown.

votes.has_personal_experience is used for SITUATION and option-based QUESTION answers.

QUESTION answers are stored in votes with their selected option and has_personal_experience.

Do not automatically enable personal experience for every question.

Question 349 is currently reset to:

has_personal_experience = false

Do not change that value unless explicitly requested.

Do not revive the old POLL architecture unless explicitly requested.

## Collaboration

ChatGPT is used for product decisions, architecture, UX, and precise task definition.

Codex is used for repository inspection, coding, and tests.

When requirements are unclear, inspect the existing implementation and ask for clarification rather than inventing a large change.
