'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code,
  Equal,
  ExternalLink,
  Film,
  Keyboard,
  Play,
  RotateCcw,
  Save,
  Trophy,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Progress } from '@/components/ui/progress';
import type { Movie } from '@/app/data/movies';
import { ScreenRankingWordmark } from '@/app/components/screen-ranking-wordmark';

const ASSET_PREFIX = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

type SortState = {
  pending: string[][];
  built: string[][];
  left: string[] | null;
  right: string[] | null;
  leftIndex: number;
  rightIndex: number;
  merged: string[];
  decisions: number;
  ties: [string, string][];
  result: string[] | null;
};

type SavedSort = {
  version: string;
  state: SortState;
  history: SortState[];
  savedAt: number;
};

type WebMcpTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => Promise<unknown>;
};

declare global {
  interface Document {
    modelContext?: {
      registerTool: (
        tool: WebMcpTool,
        options?: { signal?: AbortSignal },
      ) => void | Promise<void>;
    };
  }
}

function cloneState(state: SortState): SortState {
  return {
    ...state,
    pending: state.pending.map((run) => [...run]),
    built: state.built.map((run) => [...run]),
    left: state.left ? [...state.left] : null,
    right: state.right ? [...state.right] : null,
    merged: [...state.merged],
    ties: state.ties.map((pair) => [...pair] as [string, string]),
    result: state.result ? [...state.result] : null,
  };
}

function prepareNextPair(input: SortState): SortState {
  const state = cloneState(input);

  while (!state.left && !state.result) {
    if (state.pending.length >= 2) {
      state.left = state.pending[0];
      state.right = state.pending[1];
      state.pending = state.pending.slice(2);
      state.leftIndex = 0;
      state.rightIndex = 0;
      state.merged = [];
      break;
    }

    if (state.pending.length === 1) {
      state.built.push(state.pending[0]);
      state.pending = [];
    }

    if (state.pending.length === 0) {
      if (state.built.length <= 1) {
        state.result = state.built[0] ?? [];
        break;
      }

      state.pending = state.built;
      state.built = [];
    }
  }

  return state;
}

function createSortState(ids: string[]): SortState {
  const shuffled = [...ids];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return prepareNextPair({
    pending: shuffled.map((id) => [id]),
    built: [],
    left: null,
    right: null,
    leftIndex: 0,
    rightIndex: 0,
    merged: [],
    decisions: 0,
    ties: [],
    result: null,
  });
}

function applyChoice(
  input: SortState,
  choice: 'left' | 'tie' | 'right',
): SortState {
  if (!input.left || !input.right || input.result) return input;

  const state = cloneState(input);
  const leftId = state.left![state.leftIndex];
  const rightId = state.right![state.rightIndex];

  if (choice === 'left' || choice === 'tie') {
    state.merged.push(leftId);
    state.leftIndex += 1;
  }

  if (choice === 'right' || choice === 'tie') {
    state.merged.push(rightId);
    state.rightIndex += 1;
  }

  if (choice === 'tie') state.ties.push([leftId, rightId]);
  state.decisions += 1;

  const leftDone = state.leftIndex >= state.left!.length;
  const rightDone = state.rightIndex >= state.right!.length;

  if (leftDone || rightDone) {
    const completedRun = [
      ...state.merged,
      ...state.left!.slice(state.leftIndex),
      ...state.right!.slice(state.rightIndex),
    ];
    state.built.push(completedRun);
    state.left = null;
    state.right = null;
    state.leftIndex = 0;
    state.rightIndex = 0;
    state.merged = [];
    return prepareNextPair(state);
  }

  return state;
}

function Poster({
  movie,
  priority = false,
}: {
  movie: Movie;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="poster-frame">
      {!failed ? (
        <Image
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="poster-image"
          fill
          sizes="(max-width: 760px) 48vw, 420px"
          unoptimized
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="poster-fallback"
          aria-label={`${movie.title} poster unavailable`}
        >
          <Film aria-hidden="true" />
          <span>{movie.title}</span>
        </div>
      )}
      <div className="poster-shade" />
    </div>
  );
}

function buildResultGroups(state: SortState, byId: Map<string, Movie>) {
  const parent = new Map<string, string>();
  const find = (id: string): string => {
    const current = parent.get(id) ?? id;
    if (current === id) return id;
    const root = find(current);
    parent.set(id, root);
    return root;
  };
  const union = (a: string, b: string) => {
    const aRoot = find(a);
    const bRoot = find(b);
    if (aRoot !== bRoot) parent.set(bRoot, aRoot);
  };

  state.result?.forEach((id) => parent.set(id, id));
  state.ties.forEach(([a, b]) => union(a, b));

  const groups: { rank: number; movies: Movie[] }[] = [];
  let position = 1;
  for (const id of state.result ?? []) {
    const movie = byId.get(id);
    if (!movie) continue;
    const root = find(id);
    const existing = groups.find((group) => find(group.movies[0].id) === root);
    if (existing) {
      existing.movies.push(movie);
    } else {
      groups.push({ rank: position, movies: [movie] });
    }
    position += 1;
  }
  return groups;
}

export function MovieSorter({
  movies,
  saveKey,
  dataVersion,
  listLabel,
}: {
  movies: Movie[];
  saveKey: string;
  dataVersion: string;
  listLabel: string;
}) {
  const [state, setState] = useState<SortState | null>(null);
  const [history, setHistory] = useState<SortState[]>([]);
  const [hasSave, setHasSave] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const raw = window.localStorage.getItem(saveKey);
      if (!raw) return false;
      return (JSON.parse(raw) as SavedSort).version === dataVersion;
    } catch {
      return false;
    }
  });
  const [notice, setNotice] = useState<string | null>(null);
  const byId = useMemo(
    () => new Map(movies.map((movie) => [movie.id, movie])),
    [movies],
  );
  const maxComparisons = useMemo(() => {
    const power = Math.ceil(Math.log2(Math.max(movies.length, 2)));
    return movies.length * power - 2 ** power + 1;
  }, [movies.length]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const saveProgress = useCallback(
    (showNotice = true) => {
      if (!state || state.result) return;
      const saved: SavedSort = {
        version: dataVersion,
        state,
        history: history.slice(-80),
        savedAt: Date.now(),
      };
      window.localStorage.setItem(saveKey, JSON.stringify(saved));
      if (showNotice) {
        setHasSave(true);
        setNotice('Progress saved on this device');
      }
    },
    [dataVersion, history, saveKey, state],
  );

  const startSorting = useCallback(() => {
    setState(createSortState(movies.map((movie) => movie.id)));
    setHistory([]);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movies]);

  const loadProgress = useCallback(() => {
    try {
      const raw = window.localStorage.getItem(saveKey);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedSort;
      if (saved.version !== dataVersion) return;
      setState(prepareNextPair(saved.state));
      setHistory(saved.history ?? []);
      setNotice('Progress restored');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setHasSave(false);
      window.localStorage.removeItem(saveKey);
    }
  }, [dataVersion, saveKey]);

  const choose = useCallback(
    (choice: 'left' | 'tie' | 'right') => {
      if (!state || state.result) return;
      setHistory((previous) => [...previous.slice(-79), cloneState(state)]);
      setState(applyChoice(state, choice));
    },
    [state],
  );

  const undo = useCallback(() => {
    if (!history.length) return;
    const previous = history[history.length - 1];
    setState(previous);
    setHistory((items) => items.slice(0, -1));
    setNotice('Last choice undone');
  }, [history]);

  const reset = useCallback(() => {
    setState(null);
    setHistory([]);
    setNotice(null);
    window.localStorage.removeItem(saveKey);
    setHasSave(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [saveKey]);

  const copyRanking = useCallback(async () => {
    if (!state?.result) return;
    const groups = buildResultGroups(state, byId);
    const text = groups
      .flatMap((group) =>
        group.movies.map((movie) => `${group.rank}. ${movie.title}`),
      )
      .join('\n');
    await navigator.clipboard.writeText(text);
    setNotice('Ranking copied to clipboard');
  }, [byId, state]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select')) return;

      if (!state) {
        if (event.key === 'Enter' || event.key.toLowerCase() === 's') {
          event.preventDefault();
          startSorting();
        } else if (event.key.toLowerCase() === 'l' && hasSave) {
          event.preventDefault();
          loadProgress();
        }
        return;
      }

      if (state.result) return;
      const key = event.key.toLowerCase();
      if (key === 'h' || event.key === 'ArrowLeft' || event.key === '1') {
        event.preventDefault();
        choose('left');
      } else if (key === 'k' || event.key === 'ArrowUp' || event.key === '2') {
        event.preventDefault();
        choose('tie');
      } else if (
        key === 'l' ||
        event.key === 'ArrowRight' ||
        event.key === '3'
      ) {
        event.preventDefault();
        choose('right');
      } else if (key === 'j' || event.key === 'ArrowDown') {
        event.preventDefault();
        undo();
      } else if (key === 's') {
        event.preventDefault();
        saveProgress();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [choose, hasSave, loadProgress, saveProgress, startSorting, state, undo]);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    const register = async () => {
      await context.registerTool(
        {
          name: 'start_movie_sort',
          title: 'Start movie sort',
          description: `Start a fresh head-to-head ranking of all ${movies.length} movies.`,
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute: async () => {
            startSorting();
            await new Promise<void>((resolve) =>
              requestAnimationFrame(() => resolve()),
            );
            return { status: 'started', movieCount: movies.length };
          },
        },
        { signal: lifecycle.signal },
      );

      await context.registerTool(
        {
          name: 'choose_movie_in_current_battle',
          title: 'Choose a movie',
          description:
            'Record a left, tie, or right choice for the visible movie battle.',
          inputSchema: {
            type: 'object',
            properties: {
              choice: { type: 'string', enum: ['left', 'tie', 'right'] },
            },
            required: ['choice'],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute: async (input) => {
            if (!state || state.result || !state.left || !state.right) {
              throw new Error('No active movie battle. Start a sort first.');
            }
            const value = (input as { choice?: unknown })?.choice;
            if (value !== 'left' && value !== 'tie' && value !== 'right') {
              throw new Error('Choice must be left, tie, or right.');
            }
            choose(value);
            await new Promise<void>((resolve) =>
              requestAnimationFrame(() => resolve()),
            );
            return {
              status: 'recorded',
              choice: value,
              decision: state.decisions + 1,
            };
          },
        },
        { signal: lifecycle.signal },
      );
    };

    void register().catch(() => undefined);
    return () => lifecycle.abort();
  }, [choose, movies.length, startSorting, state]);

  useEffect(() => {
    if (state && !state.result && state.decisions > 0) {
      const saved: SavedSort = {
        version: dataVersion,
        state,
        history: history.slice(-80),
        savedAt: Date.now(),
      };
      window.localStorage.setItem(saveKey, JSON.stringify(saved));
    } else if (state?.result) {
      window.localStorage.removeItem(saveKey);
    }
  }, [dataVersion, history, saveKey, state]);

  if (!state) {
    return (
      <main className="site-shell home-view">
        <header className="site-header">
          <a
            href={`${ASSET_PREFIX}/`}
            className="wordmark"
            aria-label="Screen Ranking home"
          >
            <ScreenRankingWordmark />
          </a>
          <a
            className="header-link"
            href="https://github.com/imnerf/movie-sorter-v2"
            target="_blank"
            rel="noreferrer"
          >
            Source <ExternalLink aria-hidden="true" />
          </a>
        </header>

        <section id="top" className="home-hero" aria-labelledby="hero-title">
          <div className="portrait portrait-left" aria-hidden="true">
            <Image
              src={`${ASSET_PREFIX}/brand/taxi-driver.jpg`}
              alt=""
              fill
              sizes="32vw"
              priority
            />
          </div>

          <div className="hero-copy">
            <p className="eyebrow">{listLabel}</p>
            <h1 id="hero-title">
              Choose between two.
              <br />
              Find your favorite.
            </h1>
            <p className="hero-intro">
              Work through a series of head-to-head movie battles. Your choices
              become a ranked list that is entirely your own.
            </p>
            <div className="hero-actions">
              <Button className="start-button" size="lg" onClick={startSorting}>
                <Play aria-hidden="true" fill="currentColor" />
                Start with {movies.length} movies
              </Button>
              {hasSave && (
                <Button
                  className="resume-button"
                  variant="outline"
                  size="lg"
                  onClick={loadProgress}
                >
                  Resume saved sort
                </Button>
              )}
            </div>
            <p className="hero-hint">
              Pick the film you prefer. Tie films you love equally—or don’t
              know.
            </p>
          </div>

          <div className="portrait portrait-right" aria-hidden="true">
            <Image
              src={`${ASSET_PREFIX}/brand/tar.jpg`}
              alt=""
              fill
              sizes="32vw"
              priority
            />
          </div>
        </section>

        <section className="how-it-works" aria-label="How it works">
          <div>
            <span>01</span>
            <h2>Make the call</h2>
            <p>Choose left, right, or tie. There are no wrong answers.</p>
          </div>
          <div>
            <span>02</span>
            <h2>Take your time</h2>
            <p>Undo any choice and save your progress on this device.</p>
          </div>
          <div>
            <span>03</span>
            <h2>Get the list</h2>
            <p>Finish with every film ranked from your favorite down.</p>
          </div>
        </section>

        <section className="keyboard-strip" aria-label="Keyboard shortcuts">
          <Keyboard aria-hidden="true" />
          <p>
            <Kbd>H</Kbd> or <Kbd>←</Kbd> left
          </p>
          <p>
            <Kbd>K</Kbd> or <Kbd>↑</Kbd> tie
          </p>
          <p>
            <Kbd>L</Kbd> or <Kbd>→</Kbd> right
          </p>
          <p>
            <Kbd>J</Kbd> or <Kbd>↓</Kbd> undo
          </p>
          <p>
            <Kbd>S</Kbd> save
          </p>
        </section>

        <footer className="site-footer">
          <div className="footer-links">
            <a
              href="https://github.com/imnerf/movie-sorter-v2"
              target="_blank"
              rel="noreferrer"
            >
              <Code aria-hidden="true" /> Source code
            </a>
            <a
              href="https://sorter.neocities.org/kanye/"
              target="_blank"
              rel="noreferrer"
            >
              Original inspiration <ExternalLink aria-hidden="true" />
            </a>
            <a
              href="https://letterboxd.com/nerfaveli"
              target="_blank"
              rel="noreferrer"
            >
              Created by Nerf <ExternalLink aria-hidden="true" />
            </a>
          </div>
          <div className="tmdb-credit">
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src={`${ASSET_PREFIX}/brand/tmdb.svg`}
                alt="The Movie Database"
                width={90}
                height={40}
                unoptimized
              />
            </a>
            <p>
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
          </div>
          <p className="last-updated">Latest update · September 11, 2026</p>
        </footer>
      </main>
    );
  }

  if (state.result) {
    const groups = buildResultGroups(state, byId);
    const rankedMovies = groups.flatMap((group) =>
      group.movies.map((movie, movieIndex) => ({
        movie,
        rank: movieIndex === 0 ? String(group.rank) : '=',
        tied: group.movies.length > 1,
      })),
    );
    const showcaseMovies = rankedMovies.slice(0, 12);
    const remainingMovies = rankedMovies.slice(12);
    return (
      <main className="site-shell results-view">
        <header className="site-header">
          <a
            href={`${ASSET_PREFIX}/`}
            className="wordmark"
            aria-label="Return to Screen Ranking home"
          >
            <ScreenRankingWordmark />
          </a>
          <span className="completion-label">
            <Check aria-hidden="true" /> Sort complete
          </span>
        </header>

        <section className="results-header">
          <div className="trophy-mark">
            <Trophy aria-hidden="true" />
          </div>
          <p className="eyebrow">Your final ranking</p>
          <h1>A list worth arguing about.</h1>
          <p>
            {movies.length} movies, ranked through {state.decisions} decisions.
          </p>
          <div className="results-actions">
            <Button size="lg" onClick={copyRanking}>
              Copy ranking
            </Button>
            <Button size="lg" variant="outline" onClick={reset}>
              Start over
            </Button>
          </div>
        </section>

        <section className="ranking-board" aria-label="Complete movie ranking">
          <ol className="ranking-showcase">
            {showcaseMovies.map(({ movie, rank, tied }) => (
              <li className="ranking-card" key={movie.id}>
                <Image
                  src={movie.poster}
                  alt=""
                  width={220}
                  height={330}
                  unoptimized
                  loading="lazy"
                />
                <div className="ranking-card-copy">
                  <span className="showcase-rank">{rank}</span>
                  <span className="showcase-title">{movie.title}</span>
                  {tied && <span className="showcase-tie">Tie</span>}
                </div>
              </li>
            ))}
          </ol>

          {remainingMovies.length > 0 && (
            <ol className="ranking-columns" start={13}>
              {remainingMovies.map(({ movie, rank, tied }) => (
                <li className="ranking-compact-row" key={movie.id}>
                  <span className="compact-rank">{rank}</span>
                  <span className="compact-title">{movie.title}</span>
                  {tied && <span className="compact-tie">Tie</span>}
                </li>
              ))}
            </ol>
          )}
        </section>

        <footer className="results-footer">
          <p>Your ranking is only stored on this device until you copy it.</p>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw aria-hidden="true" /> New sort
          </Button>
        </footer>
        {notice && <output className="toast">{notice}</output>}
      </main>
    );
  }

  const leftMovie = byId.get(state.left![state.leftIndex])!;
  const rightMovie = byId.get(state.right![state.rightIndex])!;
  const progress = Math.min(
    99,
    Math.round((state.decisions / maxComparisons) * 100),
  );

  return (
    <main className="site-shell sorting-view">
      <header className="sort-header">
        <a
          href={`${ASSET_PREFIX}/`}
          className="wordmark"
          aria-label="Return to Screen Ranking home"
        >
          <ScreenRankingWordmark />
        </a>
        <div className="sort-progress">
          <div className="progress-copy">
            <span>Decision {state.decisions + 1}</span>
            <span>about {maxComparisons} total</span>
          </div>
          <Progress value={progress} aria-label={`${progress}% complete`} />
        </div>
        <div className="sort-tools">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!history.length}
          >
            <RotateCcw aria-hidden="true" /> Undo
          </Button>
          <Button variant="outline" size="sm" onClick={() => saveProgress()}>
            <Save aria-hidden="true" /> Save
          </Button>
        </div>
      </header>

      <section className="battle-stage" aria-labelledby="battle-title">
        <div className="battle-heading">
          <p className="eyebrow">Head to head</p>
          <h1 id="battle-title">Which movie do you prefer?</h1>
        </div>

        <div className="battle-grid">
          <Button
            variant="outline"
            className="movie-choice movie-choice-left"
            onClick={() => choose('left')}
            aria-label={`Choose ${leftMovie.title}`}
          >
            <Poster movie={leftMovie} priority />
            <span className="choice-footer">
              <span className="choice-title">{leftMovie.title}</span>
              <span className="choice-key">
                <Kbd>H</Kbd>
                <ArrowLeft aria-hidden="true" />
              </span>
            </span>
          </Button>

          <div className="versus-mark" aria-hidden="true">
            <span>or</span>
          </div>

          <Button
            variant="outline"
            className="movie-choice movie-choice-right"
            onClick={() => choose('right')}
            aria-label={`Choose ${rightMovie.title}`}
          >
            <Poster movie={rightMovie} priority />
            <span className="choice-footer">
              <span className="choice-title">{rightMovie.title}</span>
              <span className="choice-key">
                <ArrowRight aria-hidden="true" />
                <Kbd>L</Kbd>
              </span>
            </span>
          </Button>
        </div>

        <Button
          variant="outline"
          className="tie-button"
          onClick={() => choose('tie')}
        >
          <Equal aria-hidden="true" />
          Tie or haven’t seen both
          <Kbd>K</Kbd>
        </Button>
      </section>

      <div className="mobile-sort-tools">
        <Button variant="ghost" onClick={undo} disabled={!history.length}>
          <RotateCcw aria-hidden="true" /> Undo
        </Button>
        <Button variant="ghost" onClick={() => saveProgress()}>
          <Save aria-hidden="true" /> Save
        </Button>
      </div>

      {notice && <output className="toast">{notice}</output>}
    </main>
  );
}
