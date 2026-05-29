# AGENTS.md

This project hosts a citable edition of *Magnifica Humanitas* (Pope Leo XIV, 2026) for GitHub Pages and Discord discussion.

## Core Principles

- **Accuracy first.** The official Vatican English text is authoritative. Never paraphrase or "improve" the content without explicit justification.
- **Stable references.** Paragraph numbering and the `MH 47` citation style must remain consistent forever. Do not renumber paragraphs.
- **One source of truth.** All paragraph text lives in `data/paragraphs.json`. The site and bot must derive from this file.
- **Dignity in presentation.** Typography and design should feel respectful of the document — clean, readable, not flashy.

## Citation Format

- Short form (Discord, chat): `MH 47`
- Formal: *Magnifica Humanitas* §47
- URL fragment: `#mh-47`

Always use the `MH N` style when the goal is easy discussion.

## Workflow Notes

- When ingesting or correcting text, update `data/paragraphs.json` directly.
- The site (`site/`) should be simple static HTML/JS that consumes the JSON.
- The bot (`bot/`) must also consume the same JSON so quotes are identical.
- Keep the reading experience excellent on both desktop and mobile.

## What Not to Do

- Do not hard-code paragraph text in the site or bot.
- Do not change paragraph numbers to match some other edition.
- Do not add commentary or interpretive notes into the primary text flow without clear separation.

## Tech Stack (current)

- Site: Static HTML + CSS + vanilla JS (GitHub Pages, no build step preferred)
- Bot: TypeScript + discord.js
- Data: `paragraphs.json`

Changes to the stack should be discussed and documented here.

## Long-term Vision

This project exists to make precise, paragraph-level conversation about *Magnifica Humanitas* as frictionless as possible, especially in Discord communities.
