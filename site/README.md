# Site Preview

This folder contains the static GitHub Pages site.

## Local preview (recommended)

From the project root:

```bash
# Option 1: Python
python -m http.server 8080 --directory site

# Option 2: Node
npx serve site
```

Then open http://localhost:8080

**Important:** The site expects `../data/paragraphs.json` relative to the site folder when developing locally. The GitHub Action automatically copies `data/paragraphs.json` into `site/data/` on deploy.

## Production

Pushing to `main` triggers the workflow which:
1. Copies the latest `data/paragraphs.json` into the site
2. Deploys everything to GitHub Pages
