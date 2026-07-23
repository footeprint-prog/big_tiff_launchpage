# Big Tiff's World launch page

A static, responsive launch page for *Big Tiff's World*. The site is ready for GitHub Pages and uses locally stored artwork and fonts so the presentation does not depend on the earlier ChatGPT-hosted build.

## Publish with GitHub Pages

In the repository's **Settings → Pages**, select **Deploy from a branch**, choose `main` and `/ (root)`, then save.

## Local preview

Serve the repository folder with any static web server. Opening `index.html` directly also works for basic review.

## The writing tool at `/app`

The Big Tiff StoryForge writing tool is served from this same site at `/app` so
that the launch-page login and the tool share a browser session (same origin).
The live copy lives at `app/index.html` with its GIFs in `app/assets/`.

**Development source of truth is the separate `big-tiff-storyforge` repo** — do
not edit `app/index.html` here directly. To promote an update:

1. Verify the change in `big-tiff-storyforge/writing.html`.
2. Copy it to `big_tiff_launchpage/app/index.html` (and copy `assets/*.gif` to
   `app/assets/` if they changed).
3. Commit + push here → GitHub Pages redeploys automatically.

Login: the launch-page "follow the light" dialog checks the entered credentials
against `accounts.json` in the public `big-tiff-data` repo (soft client-side
gate) and, on success, sends the traveler to `/app`. See `SETUP.md` in the
`big-tiff-storyforge` repo for account/token setup.

(Note: `build.mjs` / `worker.js` are leftover Cloudflare scaffolding and are not
used by the GitHub Pages deployment.)
