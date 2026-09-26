# FLAGGED — PROJECT CONTEXT

## Project
FLAGGED — social platform for structured questions, opinions and human experience.

Local path: /home/panakotaps/FLAGGED
GitHub: https://github.com/zzr2hz26zy-rgb/FLAGGED/
GitHub Pages: https://zzr2hz26zy-rgb.github.io/FLAGGED/
Branch: main
Latest stable commit: a42a248

## Stack
Frontend: HTML, CSS, JavaScript
Backend/database: Supabase
Auth: Supabase Auth
Server functions: Supabase Edge Functions
Hosting: GitHub Pages

Main files:
- index.html
- script.js
- style.css
- supabase.js

Supabase client: supabaseClient

## Question types
Active types:
- QUESTION
- SITUATION

Old POLL architecture is not active.

QUESTION always has at least one predefined answer option. Free-text QUESTION answers are not supported.
SITUATION uses Normal / Hmm / Red Flag.

## Database
Main tables:
- categories
- questions
- options
- votes
- question_categories
- question_submissions
- profiles
- user_roles
- comments

## Personal experience
questions.has_personal_experience controls whether personal-experience UI is shown.

For SITUATION:
votes.has_personal_experience

For QUESTION with predefined options:
votes.has_personal_experience

Personal experience must NOT automatically appear for every question.

Question 349 was used for testing and was reset to:
has_personal_experience = false

## Existing features
The project already has:
- RU / PL / EN
- categories
- dynamic question loading
- QUESTION / SITUATION separation
- predefined answers
- votes
- comments
- replies
- translations
- profiles
- authentication
- anonymous users
- direct question links
- moderation
- answered-question tracking
- My Answers
- My Questions
- My Discussions
- personal experience

Direct question URL example:
https://zzr2hz26zy-rgb.github.io/FLAGGED/?question=349

## Categories
Currently active:
- Parenting
- Friendship
- Psychology
- Social Life
- Work
- Money & Finance
- Health
- Technology
- Beauty & Services

Politics is hidden/reserved and inactive.

## Development rules
FLAGGED is an existing actively developed project.

Before changing code:
1. Read this file.
2. Inspect the current implementation.
3. Understand existing behavior.
4. Make the smallest necessary change.
5. Validate the result.
6. Do not change unrelated functionality.

Preserve:
- existing UX
- multilingual behavior
- authentication
- moderation
- Supabase data integrity
- working architecture

Do not use old backup files as the source of truth.

## Git rules
NEVER use:
git add .

There are many intentional untracked backup files.

Only stage exact files required for the current task.

Typical checks:
git diff --check
node --check script.js

Before commit:
git status --short
git diff

GitHub username:
zzr2hz26zy-rgb

Do not delete or modify backup files unless explicitly requested.

## Current development setup
VS Code is installed.
The FLAGGED folder is trusted.
Codex VS Code extension is installed and signed in with ChatGPT.

Codex should work directly on the existing repository, not on a copy.

ChatGPT is used for product decisions, architecture, UX and precise task definition.
Codex is used for repository inspection, coding and tests.

## Important
Do not redesign working functionality unless explicitly requested.
Do not start broad QA during a small feature task unless explicitly requested.
