# maghum

A citable, web-friendly edition of Pope Leo XIV’s encyclical *Magnifica Humanitas* (2026), designed for thoughtful discussion — especially on Discord.

**Short name:** maghum  
**Full title:** *Magnifica Humanitas* — On Safeguarding the Human Person in the Time of Artificial Intelligence

## Citation Style (MH 47)

Every paragraph has a stable, short reference:

- **MH 47** — preferred short form for chat and Discord
- *Magnifica Humanitas* §47 — more formal written use
- Direct link: `https://<username>.github.io/maghum/#mh-47`

### Why this style?

- Short and unambiguous in Discord threads
- Easy to say out loud: “see MH 47”
- Works as a URL fragment for deep linking
- Consistent across the site and the Discord bot

## Project Goals

- Provide an authoritative, readable online edition of the encyclical
- Make precise paragraph-level discussion trivial
- Support community study with a helpful Discord bot
- Keep the source text clean and maintainable

## Repository Layout

```
maghum/
├── README.md
├── AGENTS.md
├── content/                 # Source material (Markdown + notes)
├── data/
│   └── paragraphs.json      # Single source of truth: all paragraphs with numbers + text
├── site/                    # GitHub Pages site (static)
├── bot/                     # Discord bot (TypeScript + discord.js)
├── scripts/                 # Ingestion, validation, build helpers
└── .github/workflows/       # Deployment
```

## Data Model

The file `data/paragraphs.json` is the heart of the project. Both the site and the bot consume it.

Each entry looks like:

```json
{
  "number": 47,
  "id": "mh-47",
  "text": "The full paragraph text...",
  "section": "Chapter Three",
  "subsection": "What must not be lost"
}
```

This guarantees that the web page and the bot always quote the exact same text.

## Discord Bot

The bot (in `bot/`) provides commands such as:

- `/mh 47` → posts paragraph 47 with link and short quote
- `/mh 42-48` → posts a range
- `/mh search dignity` → finds relevant paragraphs

## Contributing

This project treats the official Vatican text as authoritative. Any corrections or formatting improvements should be traceable back to the source.

When adding or editing paragraphs:

1. Update `data/paragraphs.json`
2. The site and bot will pick up the change automatically

## License

The encyclical text itself is © 2026 Libreria Editrice Vaticana.  
This project provides a formatted, referenceable edition for study and discussion.

Project tooling and code are available under the MIT License (see LICENSE).
