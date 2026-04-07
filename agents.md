# agents.md — Cloudy Shop Agent Guide

> "We welcome contributions from humans, bots, and sufficiently motivated CI pipelines."

This document is written for AI agents (Copilot, Devin, etc.) that may contribute to
the **Cloudy Shop** repository. Read this before making any changes.

---

## Project Overview

**Cloudy Shop** is a static HTML/CSS/JS storefront that runs inside an Nginx container.
It is intentionally kept simple to serve as the "deployed application" in a demo of a
**vulnerable CI/CD pipeline** built with Gitea + Gitea Actions. The site is themed around
cloud computing puns for use in a CTF (Capture The Flag) competition.

---

## Repository Structure

```
Cloudy-Shop/
├── .gitignore          # Ignore rules (Node, Python, OS, editor artefacts)
├── agents.md           # This file — guidance for AI agents
├── docker-compose.yaml # Docker Compose to run the full site locally
├── Dockerfile          # Builds the Nginx image that serves the site
├── nginx/
│   └── nginx.conf      # Nginx virtual-host config (port 80, gzip, SPA fallback)
├── README.md           # Human-facing project readme
└── src/
    ├── index.html      # Main (and only) HTML page
    ├── css/
    │   └── style.css   # All styles — responsive, no external CSS framework
    └── js/
        └── main.js     # Product catalogue, cart logic, contact form
```

---

## Running the Site Locally

### With Docker Compose (recommended)

```bash
docker compose up --build
```

Visit **http://localhost:8080** in your browser.

To stop:

```bash
docker compose down
```

### Without Docker (bare Nginx or any static file server)

```bash
# Using Python's built-in server (no install required):
cd src
python3 -m http.server 8080
```

Then visit **http://localhost:8080**.

---

## Making Changes

### Adding / Editing Products

All products live in `src/js/main.js` in the `PRODUCTS` array near the top of the file.
Each product object has these fields:

| Field    | Type            | Description                                   |
|----------|-----------------|-----------------------------------------------|
| `icon`   | string (emoji)  | Product icon displayed in the card            |
| `name`   | string          | Product name (must be unique — used as cart key) |
| `desc`   | string          | Short product description — **include a cloud pun** |
| `price`  | number          | Price in USD                                  |
| `period` | string \| null  | Billing period (e.g. `"mo"`) or `null` for one-time |
| `tag`    | string          | Category tag shown on the card                |

**Rule:** Every product description **must contain at least one cloud computing pun.**
This is not optional — it's for a CTF and the puns are part of the theme.

### Editing the HTML

- The site is a single-page layout (`src/index.html`).
- Sections: Navbar → Hero → Marquee → Products → Deals → About → Testimonials → Contact → Footer.
- Keep the cloud-pun tone consistent throughout.
- Do **not** add external JavaScript frameworks (React, Vue, etc.) — keep it vanilla JS.

### Editing the CSS

- All styles are in `src/css/style.css`.
- CSS custom properties (variables) are defined in `:root` — use them instead of
  hard-coded colour values.
- The design uses a blue sky palette (`--sky-blue`, `--sky-dark`, `--sky-light`) with
  a warm amber accent (`--accent`).

### Editing the Nginx Config

- Config is at `nginx/nginx.conf`.
- The server listens on port **80** inside the container, mapped to **8080** on the host.
- Gzip is enabled for text/CSS/JS assets.
- Unknown paths fall back to `index.html` (SPA mode).

---

## CI/CD & CTF Context

This site is deployed by a Gitea Actions workflow as part of a **CTF challenge**.
The pipeline is intentionally designed to be vulnerable. Some things to be aware of:

- The pipeline may run with elevated privileges or access to secrets.
- Gitea Actions workflow definitions can be found in `.gitea/workflows/` (if present).
- Do **not** accidentally fix the intentional vulnerabilities in the pipeline — that is
  the point of the CTF.
- Do **not** commit real secrets, credentials, or sensitive data to this repository.

---

## Code Style & Conventions

| Concern         | Convention                                              |
|-----------------|---------------------------------------------------------|
| HTML            | Semantic elements, no inline styles                     |
| CSS             | BEM-like class names, CSS variables, no frameworks      |
| JavaScript      | ES2020+, vanilla, no build step required                |
| Puns            | **Mandatory** — every new feature must include at least one cloud pun |
| Comments        | Brief, inline; longer blocks only for non-obvious logic |
| Commit messages | Imperative mood, e.g. `Add Kubernetes Coloring Book to catalogue` |

---

## Checklist Before Committing

- [ ] The site still renders correctly at `http://localhost:8080` after your changes.
- [ ] New products have a cloud pun in their description.
- [ ] No secrets, tokens, or credentials are included in the diff.
- [ ] `docker compose up --build` completes without errors.
- [ ] The `docker-compose.yaml` healthcheck passes (`docker compose ps` shows `healthy`).

---

## Contact / Ownership

This repository is owned by **NotEnoughAuth**. Questions or PRs can be raised via the
Gitea issue tracker. The cloud is always open. ☁️
