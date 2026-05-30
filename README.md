# maghum

A citable, web-friendly edition of Pope Leo XIV’s encyclical *Magnifica Humanitas* (2026), designed for thoughtful discussion — especially on Discord.

**Short name:** maghum  
**Full title:** *Magnifica Humanitas* — On Safeguarding the Human Person in the Time of Artificial Intelligence

## Citation Style (MH 47)

Every paragraph has a stable, short reference:

- **MH 47** — preferred short form for chat and Discord
- *Magnifica Humanitas* §47 — more formal written use
- Direct link: `https://awostenberg.github.io/maghum/#mh-47`

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

## Deployment (GitHub Pages)

The site is designed to deploy automatically via GitHub Actions.

### One-time setup

1. Create a new public GitHub repository named `maghum`.
2. Push this code to it:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/maghum.git
   git push -u origin main
   ```
3. Go to your repo → **Settings → Pages**
   - Under "Build and deployment", set **Source** to **GitHub Actions**.
4. Push any change (or manually trigger the "Deploy site to GitHub Pages" workflow).

Your site will be live at:

```
https://awostenberg.github.io/maghum/
```

### Updating the site

Just push to `main`. The workflow will rebuild and redeploy automatically.

## Trying the site locally

Run this command from the project root:

```bash
mkdir -p site/data && cp data/paragraphs.json site/data/ && python3 -m http.server 8080 --directory site
```

Then open:

- `http://localhost:8080` — the full document
- `http://localhost:8080/#mh-47` — direct link to a specific paragraph

The “Copy MH 47” buttons and deep linking all work locally.

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
