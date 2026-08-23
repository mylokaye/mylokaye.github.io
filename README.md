# mylokaye.info

Static source for [mylokaye.info](https://mylokaye.info/), a portfolio of Dynamics 365 Customer Insights tools and practical guides.

## Pages

- `/` — portfolio overview
- `/about/` — author profile and expertise
- `/form-debugger/` — Form Debugger product page
- `/d365-form-skill/` — Customer Insights Forms Skill page
- `/pattens/` — Pattens project page
- `/agentic-form/` — Agentic Form project page
- `/privacy.html` — website, analytics and extension privacy information

## Local development

```bash
npm install
npm run build
npm run social
npm test
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`.

`npm run build` compiles the Tailwind source into `assets/css/site.css`. On macOS, `npm run social` embeds the generated background and renders the editable SVG source into `assets/img/social-share.png`. `npm test` checks page metadata, JSON-LD syntax, internal links, local assets and sitemap coverage.

## Analytics and privacy

Google Analytics is not loaded until a visitor explicitly accepts optional analytics. The visitor can reject analytics or reopen the choice from the Cookie settings button in the footer. Consent is stored locally in the browser.

## Search and sharing

- `robots.txt` and `sitemap.xml` provide crawler discovery.
- `llms.txt` gives AI systems a concise, canonical guide to the site's public content.
- Every public page has canonical, Open Graph, X/Twitter and JSON-LD metadata.
- `assets/img/social-share-source.svg` is the editable source for the 1200 × 630 social card; `assets/img/social-share.png` is the published raster asset.
