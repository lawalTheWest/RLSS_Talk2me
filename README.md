# Talk2Me website

Static landing page and documentation for **Talk2Me**, the serverless Android
audio-call app. Plain HTML, CSS, and a little JavaScript — no build step, no
dependencies, no external requests.

This folder is meant to be its own repository and published with GitHub Pages.

## Structure

```
.
├── index.html        Landing page
├── docs.html         Install, TURN setup, troubleshooting, build notes
├── privacy.html      Privacy note
├── 404.html          GitHub Pages not-found page
├── styles.css        All styles (dark theme, responsive, no fonts/CDN)
├── main.js           Nav, copy buttons, scrollspy, reveal animations
├── assets/logo.svg   Logo and favicon
├── robots.txt
├── .nojekyll         Serve files as-is (skip Jekyll processing)
└── README.md
```

All internal links are relative, so the site works both at a user root
(`username.github.io`) and under a project path
(`username.github.io/talk2me-site/`).

## Preview locally

```bash
cd path/to/this/folder
python3 -m http.server 8080
# open http://localhost:8080
```

Opening `index.html` directly works too, except that `404.html` is only served
by GitHub Pages.

## Publish as a new repository

Run these from inside this folder, not from the Android project:

```bash
git init -b main
git add .
git commit -m "Add Talk2Me website"
git remote add origin git@github.com:lawalTheWest/talk2me-site.git
git push -u origin main
```

Then, on GitHub:

1. Open the repository → **Settings** → **Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)**. Save.
4. The site appears at `https://lawalthewest.github.io/talk2me-site/` after a minute or two.

If the repository is named `lawalTheWest.github.io`, the site is served at
`https://lawalthewest.github.io/` instead.

### Custom domain

Add a `CNAME` file containing the bare domain (for example `talk2me.example.com`),
then configure the DNS record GitHub shows in **Settings → Pages**. No other
files need to change.

## Updating for a new release

The version is hard-coded in a few visible places, because this is a static site
with no templating:

| What | Where |
|---|---|
| Version badge and download labels | `index.html` (`v1.0`, `Download v1.0 APK`) |
| APK filename, size, SHA-256 | `docs.html` (Install and Verify sections) |
| Release link | Search for `releases/latest` in `index.html` and `docs.html` |
| Release note wording | `docs.html` (Troubleshooting, Verify) |

Download buttons point at
`https://github.com/lawalTheWest/talk2me/releases/latest`, so a new GitHub
release is picked up automatically; only the version text and checksum need
editing.

## Notes

- No cookies, analytics, tracking pixels, CDN scripts, or remote fonts.
- `main.js` is optional: navigation works without it, and content stays visible
  when JavaScript is disabled.
- Keep the site repository separate from the Android source. If this folder was
  copied out of the app repo, delete the original copy there so it is not
  committed twice.

## License

MIT, matching the Talk2Me app. See the main repository's `LICENSE`.
