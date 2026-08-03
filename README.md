# Personal portfolio & resume — prototype

React 19 · TypeScript · Vite 8 · Tailwind CSS v4 · Motion · lucide-react

```bash
npm install
cp src/data/profile.example.ts src/data/profile.ts   # required — see below
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
npm run preview
```

## Making it yours

**Everything is in one file: `src/data/profile.ts`.** Name, bio, projects, jobs,
skills, socials and stats all read from there — no component edits needed for a
content swap.

That file is **gitignored**. The repo ships `profile.example.ts` (a fictional
persona) and `schema.ts` (the shared types, committed). Both data files satisfy
the same types, so the example can't silently drift out of sync with the real
one — a mismatch fails `tsc`.

Colors live at the top of `src/index.css` as CSS custom properties (`--a1`,
`--a2`, `--a3` for the accent ramp, plus `--bg` / `--fg` / `--line` per theme).
Change them once and the whole site — gradients, glows, charts, the resume —
follows.

Fonts are loaded from Google Fonts in `index.html`: Space Grotesk (display),
Inter (body), JetBrains Mono (labels).

## What's interactive

| | |
|---|---|
| `⌘K` / `Ctrl+K` | Command palette — jump to sections, toggle theme, print resume |
| Hero | Per-character type reveal, rotating role, scroll parallax, count-up stats |
| Cursor | Spotlight gradient tracks the pointer (fine pointers only) |
| Work cards | 3D tilt, animated conic border, cursor sheen, click for a case-study modal |
| Filters | Category tabs with a shared-layout pill; grid re-animates on change |
| Experience | Scroll-linked timeline spine; click any role to expand |
| Skills | Bars fill when scrolled into view |
| Resume | `window.print()` + print stylesheet → clean PDF via "Save as PDF"; no file hosted |
| Theme | Light/dark, persisted, applied pre-paint so there's no flash |

## Confidential work

Most of the portfolio is employer-internal or government work with no public
URL. Rather than hiding that, the site states it: each project carries an
`access` field (`public` | `internal` | `restricted`) and an `accessNote`. Cards
show a lock/shield badge, and the case-study modal replaces the "live demo"
button with the reason there isn't one. Headline metrics are promoted onto the
card face so the impact reads without a link to click.

If a project ever does become publicly linkable, add a `links` array to it and
the badge block is replaced by real buttons automatically.

## Privacy model

A static site can't keep rendered content secret — anything on the page is
readable, and moving it to a database wouldn't change that (the API response is
just as visible). So the goal here isn't secrecy, it's limiting **repo
exposure** and **bulk scraping**, which are different problems:

**Repo exposure.** `src/data/profile.ts` is gitignored, so no real name, email,
employer or job history enters git history, GitHub code search, or any fork.
Deleting a file later doesn't remove it from history — this only works if it's
gitignored *before the first commit*. `*.docx`, `*.pdf`, `public/` and `.env*`
are ignored too.

**Bulk scraping.** The email is stored split (`emailUser` + `emailDomain`) and
joined at runtime, so no literal `user@domain` string exists in any served
file — verified against `dist/`. Combined with this being a client-rendered SPA
(the served `index.html` body is just `<div id="root"></div>`), harvesters that
don't execute JS get nothing at all. The contact card additionally gates the
address behind a click. None of this stops a determined human, and it shouldn't.

## Deploying

Because the content file is gitignored, **git-connected auto-deploy won't work**
— a cloud build has no `profile.ts` and will fail. Build locally and publish
`dist/` instead.

Full runbook — settings inventory, pre-commit checks, Hostinger and
Cloudflare/Netlify paths, DNS, post-deploy verification — is in
**[DEPLOYMENT.md](DEPLOYMENT.md)**.

## Notes

- The contact form is UI-only (`src/components/Contact.tsx`) — it fakes a
  1.1s submit. Point it at Formspree/Resend/your own route and keep the same
  `idle → sending → sent` transitions.
- **No CV file is hosted, deliberately.** The resume section renders from
  `profile.ts` and `window.print()` generates the PDF, so the published site
  never serves a document containing a phone number or anything else not shown
  on the page.
- **`profile.resumeUrl` is the placeholder for the hosted light CV.** Leave it
  as `''` and the second button is a "Request the full CV" `mailto:`. Paste a
  public URL in and it automatically becomes a "Download CV" link — no
  component changes, and no dead link ships in the meantime.

## Printing

`@media print` in `src/index.css` turns the page into an A4 document:
everything but `#resume` is hidden, the theme is forced to a light palette,
fixed decorative layers are dropped, and — importantly — scroll-reveal motion
state is reset. Without that reset, printing before scrolling to the resume
produced a blank page, because the reveal wrappers were still at `opacity: 0`.

Type is re-scaled for paper with Tailwind `print:` variants in `Resume.tsx`
(pt units, tighter leading and spacing); screen sizes are far too large
printed. Each role carries `.print-keep` so a heading never splits from its
bullets across a page break.
- `prefers-reduced-motion` is respected globally; all animation collapses.
- Accessibility: skip-free semantic landmarks, `aria-expanded` on collapsibles,
  focus-visible rings, labelled dialogs, keyboard-driven palette.
