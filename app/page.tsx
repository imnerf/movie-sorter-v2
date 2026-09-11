import Image from 'next/image';
import { ArrowRight, Film, Sparkles, Tv } from 'lucide-react';
import type { CSSProperties } from 'react';

import { ScreenRankingWordmark } from '@/app/components/screen-ranking-wordmark';
import { movies } from '@/app/data/movies';

const ASSET_PREFIX = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

type WallPoster = {
  title: string;
  poster: string;
};

const featuredTitles = [
  'Parasite',
  'Interstellar',
  'Oppenheimer',
  'Spider-Man: Into the Spider-Verse',
  'The Dark Knight',
  'The Grand Budapest Hotel',
  'Spirited Away',
  'The Shining',
  'The Godfather',
  'Blade Runner 2049',
  'Moonlight',
  '2001: A Space Odyssey',
  'Alien',
  'WALL·E',
  'Anora',
  'Mad Max: Fury Road',
  'Goodfellas',
  'Perfect Blue',
  'Pulp Fiction',
  'Dune',
  'The Lord of the Rings: The Fellowship of the Ring',
  'Princess Mononoke',
  'La La Land',
  'The Matrix',
];

const popularPosters: WallPoster[] = [
  {
    title: 'Star Wars',
    poster:
      'https://image.tmdb.org/t/p/w342/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
  },
  {
    title: 'Titanic',
    poster:
      'https://image.tmdb.org/t/p/w342/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
  },
  {
    title: 'Jaws',
    poster:
      'https://image.tmdb.org/t/p/w342/lxM6kqilAdpdhqUl2biYp5frUxE.jpg',
  },
  {
    title: 'Jurassic Park',
    poster:
      'https://image.tmdb.org/t/p/w342/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg',
  },
  {
    title: 'Rocky',
    poster:
      'https://image.tmdb.org/t/p/w342/cqxg1CihGR5ge0i1wYXr4Rdeppu.jpg',
  },
  {
    title: 'Barbie',
    poster:
      'https://image.tmdb.org/t/p/w342/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
  },
  {
    title: 'The Lion King',
    poster:
      'https://image.tmdb.org/t/p/w342/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
  },
  {
    title: 'Back to the Future',
    poster:
      'https://image.tmdb.org/t/p/w342/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg',
  },
  {
    title: 'Raiders of the Lost Ark',
    poster:
      'https://image.tmdb.org/t/p/w342/ceG9VzoRAVGwivFU403Wc3AHRys.jpg',
  },
  {
    title: 'The Avengers',
    poster:
      'https://image.tmdb.org/t/p/w342/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
  },
  {
    title: 'The Wizard of Oz',
    poster:
      'https://image.tmdb.org/t/p/w342/pfAZFD7I2hxW9HCChTuAzsdE6UX.jpg',
  },
  {
    title: 'Top Gun',
    poster:
      'https://image.tmdb.org/t/p/w342/xUuHj3CgmZQ9P2cMaqQs4J0d4Zc.jpg',
  },
];

const existingPosters = featuredTitles.flatMap((title) => {
  const movie = movies.find((candidate) => candidate.title === title);
  if (!movie) return [];
  return [
    {
      title: movie.title,
      poster: movie.poster
        .replace('/t/p/original/', '/t/p/w342/')
        .replace('/t/p/w500/', '/t/p/w342/'),
    },
  ];
});

const wallPosters = [...existingPosters, ...popularPosters];
const posterRows = Array.from({ length: 4 }, (_, rowIndex) =>
  wallPosters.slice(rowIndex * 9, rowIndex * 9 + 9),
);

export default function ScreenRankingHome() {
  return (
    <main className="ranking-home">
      <div className="poster-wall" aria-hidden="true">
        {posterRows.map((row, rowIndex) => (
          <div
            className={`poster-ribbon poster-ribbon--${rowIndex % 2 === 0 ? 'left' : 'right'}`}
            style={{ '--row': rowIndex } as CSSProperties}
            key={rowIndex}
          >
            {row.map((movie) => (
              <div className="wall-poster" key={movie.title}>
                <Image
                  src={movie.poster}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 96px, 11vw"
                  unoptimized
                  priority={rowIndex < 2}
                />
              </div>
            ))}
          </div>
        ))}
        <div className="poster-wall-shade" />
      </div>

      <header className="ranking-home-header">
        <a href={`${ASSET_PREFIX}/`} aria-label="Screen Ranking home">
          <ScreenRankingWordmark />
        </a>
        <a
          href="https://github.com/imnerf/movie-sorter-v2"
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </header>

      <section className="ranking-home-content" aria-labelledby="home-title">
        <div className="ranking-home-intro">
          <p className="eyebrow">Head-to-head sorting games</p>
          <h1 id="home-title">What do you want to rank?</h1>
          <p>
            Choose between two at a time. Finish with a list that is entirely
            your own.
          </p>
        </div>

        <div className="sorter-shelf" aria-label="Available ranking games">
          <a
            className="sorter-tile sorter-tile--active"
            href={`${ASSET_PREFIX}/movies/cinephile-140/`}
          >
            <div className="sorter-tile-topline">
              <span>Now playing</span>
              <Film aria-hidden="true" />
            </div>
            <div>
              <p className="sorter-count">140 films</p>
              <h2>Brandon’s Movie List</h2>
              <p>
                A personal pool shaped by what I’ve seen and loved: modern
                favorites, international landmarks, and established classics.
              </p>
            </div>
            <span className="sorter-cta">
              Start ranking <ArrowRight aria-hidden="true" />
            </span>
          </a>

          <a
            className="sorter-tile sorter-tile--active"
            href={`${ASSET_PREFIX}/movies/fan-favorites/`}
          >
            <div className="sorter-tile-topline">
              <span>Now playing</span>
              <Sparkles aria-hidden="true" />
            </div>
            <div>
              <p className="sorter-count">90 films</p>
              <h2>Fan Favorites</h2>
              <p>
                Blockbusters, modern favorites, enduring classics, and the
                movies almost everybody knows.
              </p>
            </div>
            <span className="sorter-cta">
              Start ranking <ArrowRight aria-hidden="true" />
            </span>
          </a>

          <article className="sorter-tile sorter-tile--soon">
            <div className="sorter-tile-topline">
              <span>On the slate</span>
              <Tv aria-hidden="true" />
            </div>
            <div>
              <p className="sorter-count">Series edition</p>
              <h2>Television</h2>
              <p>The shows you finished, rewatched, and never stopped quoting.</p>
            </div>
            <span className="sorter-status">Coming soon</span>
          </article>
        </div>
      </section>

      <footer className="ranking-home-footer">
        <span>Screen Ranking</span>
        <span>Powered by personal taste and difficult choices.</span>
      </footer>
    </main>
  );
}
