# Journal Daily

A personal diary for recording day-to-day self-improvement, designed to feel like opening a real leather-bound journal.

Each day you answer three things: what you learned, how you improved, and a "Dear Diary" note. Add a mood and energy rating and a few tags, then seal the page with wax. The back pages of the book track your streak, things learned, a hand-drawn mood and energy chart, a calendar of ink dots, and which areas you grew in most.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## How it's organised

```
src/
  storage/        JournalStore contract + localStorage adapter (swap in an API adapter later)
  hooks/          journal data context, day-page logic, navigation context
  lib/            dates, stats (streaks, totals), prompts, page-turn sound, export, book locations
  components/
    book/         Book (3D page-flip engine), Paper, Cover (closed book + opening)
    pages/        Day, Compare, Progress, Index and Title pages
    decor/        coffee stains, pressed flowers, ink blots, wax seal
    ui/           doodles (mood faces, energy bolts, washi-tape tags), auto-growing textarea
  styles/         paper, leather, ruling, flip and cover animations, print styles
```

### Adding a backend later

All persistence goes through `getStore()` in `src/storage/index.js`. Every method is async and documented there. Write an adapter with the same methods that calls your API (with the user's token) and pass it to `setStore()` after sign-in; the UI does not need to change.

## Little details

- The elastic band snaps off before the cover swings open, and the book slides to centre as a two-page spread.
- Pages turn with a 3D leaf, shading and a cast shadow; the rustle is synthesised with the Web Audio API (mute button top right).
- A satin ribbon bookmark always returns you to today; leather thumb tabs lead to Compare, Progress and Index.
- Saved entries are "sealed" with a wax stamp and the fresh ink dries from glossy blue to dark.
- Yesterday vs Today adds red-pen margin notes on what changed.
- Streaks are counted in tally marks, milestones earn gold stickers.
- Export as JSON, print / save as PDF, or restore from a JSON file in the Index.
- Arrow keys and swipes turn pages; on phones the book becomes a single page.
