# Leggett Ventures — Website

Redesigned marketing site for Leggett Ventures. Pure static HTML/CSS/JS — no build step, no dependencies.

## Structure
```
index.html      # all page content / sections
styles.css      # brand system (navy #13294B + copper #C77E23, Barlow Condensed / Inter)
script.js       # sticky nav, mobile menu, count-up stats, scroll reveal
assets/         # logo + Houston skyline hero (sourced from the investor deck)
```

## Preview locally
```
cd leggett-website
python3 -m http.server 4321
# open http://localhost:4321
```

## Deploy (static — pick one)
- **Netlify Drop** (easiest): go to https://app.netlify.com/drop and drag this whole folder in. Live in ~30s. Then point the `leggettventures.com` DNS at it.
- **Vercel**: `npx vercel` from this folder, or connect a Git repo.
- **Cloudflare Pages**: create a project, upload the folder or connect Git. Framework preset = "None".
- **Any host**: upload the folder contents to the web root. No server-side code required.

## Notes
- Fonts load from Google Fonts (Barlow Condensed + Inter) via CDN.
- "Investor Login" points to the Juniper Square portal: https://app.junipersquare.com/i/leggettventures
- Content mirrors the polished "New Deck" (stats: $350M+ AUM, 285 investors / 30 states, 19 managed investments, 19 yrs avg. experience).
- Performance / track-record figures are intentionally NOT on the public site.
- `assets/team/` — leadership headshots (mapped from the deck: Earl Correll confirmed via "EEC" belt buckle).
- `assets/logos/` — 11 portfolio-company logos (Cannon Field, On Point, NewFound, Frontier Title, Starlight, Waterloo, Logos, Salterra, Stonepeak, Aurora, Aviation). EPS Learning has no image logo in the decks, so it renders as a styled text chip in the "Our companies & partners" section.
