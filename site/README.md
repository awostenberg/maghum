# Site Preview

This folder contains the static GitHub Pages site.

## Local preview (recommended)

From the project root, run this one-liner to set everything up correctly:

```bash
mkdir -p site/data && cp data/paragraphs.json site/data/ && python -m http.server 8080 --directory site
```

Then open:

- Main page: http://localhost:8080
- Direct to a paragraph: http://localhost:8080/#mh-47

**Note:** The extra `cp` step is only needed for local development. GitHub Actions automatically copies the JSON into `site/data/` during deployment.

## Production

Pushing to `main` triggers the workflow which:
1. Copies the latest `data/paragraphs.json` into the site
2. Deploys everything to GitHub Pages
