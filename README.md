# Movie Sorter

A clean, client-side movie ranking experience. Visitors choose between two films at a time while an interactive merge sort builds their final list.

## Updating the movie pool

All movies live in one file: `app/data/movies.ts`.

Each entry needs only a title and a TMDB poster URL:

```ts
{ name: "Movie title", img: "https://image.tmdb.org/t/p/w500/poster-path.jpg", opts: {} },
```

Add or remove entries in that array, then update `DATA_VERSION` in `app/page.tsx`. Changing the version prevents an older saved sort from being loaded against a different pool.

## Local development

```bash
pnpm dev
```

## Publishing

Pushes to `main` automatically build and deploy the site with GitHub Pages.
The Pages build prefixes its static assets with `/movie-sorter-v2`; OpenAI
Sites and local development continue to serve assets from `/`.

A custom domain can be added later under **Repository settings → Pages**. Add
the domain in GitHub before changing its DNS records, then enable HTTPS after
the domain is verified.

## Features

- Head-to-head merge sorting
- Tie handling
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
