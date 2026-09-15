# Movie Sorter

A clean, client-side movie ranking experience. Visitors choose between two films at a time while an interactive merge sort builds their final list.

## Updating the movie pool

Nerf’s list lives in `app/data/movies.ts`; Fan Favorites lives in
`app/data/popular-movies.ts`.

Each entry needs an ID, title, year, and TMDB poster URL:

```ts
{ id: "movie-title-2026", title: "Movie Title", year: 2026, poster: "https://image.tmdb.org/t/p/original/poster-path.jpg" },
```

Add or remove entries in that array, then update `dataVersion` on the relevant sorter page. Changing the version prevents an older saved sort from being loaded against a different pool.

## Local development

```bash
pnpm dev
```

## Publishing

Pushes to `main` automatically deploy the canonical site at
`https://screenranking.com` through Cloudflare. GitHub Pages remains available
as a backup and prefixes its static assets with `/movie-sorter-v2`.

## Features

- Head-to-head merge sorting
- Individual and two-at-once “Haven’t seen” removal
- Unique final ranks with a separate unseen list
- Undo and automatic local progress saving
- Keyboard and touch controls
- Copyable final ranking
- Story-sized Top 20 share cards and full-list image exports
- Responsive layout
- Anonymous completed-sort analytics on Cloudflare D1

## Analytics

Completed sorts send one anonymous summary to the site's Cloudflare Worker.
The database stores the effective battle choices after undos and the final
ranking, but no name, email address, account, cookie, or IP address. Duplicate
submissions from the same completed run are ignored.

The D1 schema and migration live in `db/schema.ts` and `drizzle/`. Ready-made
queries for completed-sort counts, battle wins, win percentage, average final
rank, first-place finishes, and top-ten finishes live in
`analytics/queries.sql`.

Movie data and poster artwork are provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
