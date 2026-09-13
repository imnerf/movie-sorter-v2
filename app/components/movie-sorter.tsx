'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code,
  Download,
  Equal,
  ExternalLink,
  Film,
  Keyboard,
  Play,
  RotateCcw,
  Save,
  Share2,
  Trophy,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import type { Movie } from '@/app/data/movies';
import { ScreenRankingWordmark } from '@/app/components/screen-ranking-wordmark';
import {
  createFullRankingCard,
  createTopTwentyCard,
  downloadRankingImage,
  type ExportRankingItem,
} from '@/app/components/ranking-export';

const ASSET_PREFIX = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

type SortState = {
  runId: string;
  pending: string[][];
  built: string[][];
  left: string[] | null;
  right: string[] | null;
  leftIndex: number;
  rightIndex: number;
  merged: string[];
  decisions: number;
  choices: BattleChoice[];
  ties: [string, string][];
  result: string[] | null;
};

type BattleChoice = {
  leftMovieId: string;
  rightMovieId: string;
  result: 'left' | 'tie' | 'right';
};

type BattleTransition = {
  id: number;
  left: Movie;
  right: Movie;
  choice: 'left' | 'tie' | 'right';
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
    runId: state.runId || crypto.randomUUID(),
    pending: state.pending.map((run) => [...run]),
    built: state.built.map((run) => [...run]),
    left: state.left ? [...state.left] : null,
    right: state.right ? [...state.right] : null,
    merged: [...state.merged],
    choices: (state.choices ?? []).map((choice) => ({ ...choice })),
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
    runId: crypto.randomUUID(),
    pending: shuffled.map((id) => [id]),
    built: [],
    left: null,
    right: null,
    leftIndex: 0,
    rightIndex: 0,
    merged: [],
    decisions: 0,
    choices: [],
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

  state.choices.push({
    leftMovieId: leftId,
    rightMovieId: rightId,
    result: choice,
  });

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

function estimateRemainingComparisons(state: SortState) {
  if (state.result) return 0;

  let comparisons = 0;
  const nextRound = state.built.map((run) => run.length);

  if (state.left && state.right) {
    const leftRemaining = state.left.length - state.leftIndex;
    const rightRemaining = state.right.length - state.rightIndex;
    if (leftRemaining > 0 && rightRemaining > 0) {
      comparisons += leftRemaining + rightRemaining - 1;
    }
    nextRound.push(state.merged.length + leftRemaining + rightRemaining);
  }

  for (let index = 0; index < state.pending.length; index += 2) {
    const leftLength = state.pending[index].length;
    const rightLength = state.pending[index + 1]?.length;
    if (rightLength === undefined) {
      nextRound.push(leftLength);
    } else {
      comparisons += leftLength + rightLength - 1;
      nextRound.push(leftLength + rightLength);
    }
  }

  let round = nextRound;
  while (round.length > 1) {
    const followingRound: number[] = [];
    for (let index = 0; index < round.length; index += 2) {
      const leftLength = round[index];
      const rightLength = round[index + 1];
      if (rightLength === undefined) {
        followingRound.push(leftLength);
      } else {
        comparisons += leftLength + rightLength - 1;
        followingRound.push(leftLength + rightLength);
      }
    }
    round = followingRound;
  }

  return comparisons;
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function formatTimeRemaining(seconds: number) {
  if (seconds < 60) return 'under 1 min left';

  const minutes = seconds / 60;
  if (minutes < 10) return `about ${Math.max(1, Math.round(minutes))} min left`;
  if (minutes < 60) {
    return `about ${Math.max(5, Math.round(minutes / 5) * 5)} min left`;
  }

  const roundedMinutes = Math.round(minutes / 15) * 15;
  const hours = Math.floor(roundedMinutes / 60);
  const extraMinutes = roundedMinutes % 60;
  return extraMinutes
    ? `about ${hours} hr ${extraMinutes} min left`
    : `about ${hours} hr left`;
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
  sorterId,
  saveKey,
  dataVersion,
  listLabel,
  heroImages,
}: {
  movies: Movie[];
  sorterId: 'nerfs-movie-list' | 'fan-favorites';
  saveKey: string;
  dataVersion: string;
  listLabel: string;
  heroImages: {
    left: string;
    right: string;
  };
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
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareCard, setShareCard] = useState<{
    blob: Blob;
    previewUrl: string;
  } | null>(null);
  const [isCreatingShareCard, setIsCreatingShareCard] = useState(false);
  const [isCreatingFullRanking, setIsCreatingFullRanking] = useState(false);
  const [paceSamples, setPaceSamples] = useState<number[]>([]);
  const [battleTransition, setBattleTransition] =
    useState<BattleTransition | null>(null);
  const lastChoiceAt = useRef<number | null>(null);
  const transitionId = useRef(0);
  const byId = useMemo(
    () => new Map(movies.map((movie) => [movie.id, movie])),
    [movies],
  );
  const resultGroups = useMemo(
    () => (state?.result ? buildResultGroups(state, byId) : []),
    [byId, state],
  );
  const exportRanking = useMemo<ExportRankingItem[]>(
    () =>
      resultGroups.flatMap((group) =>
        group.movies.map((movie) => ({
          movie,
          rank: group.rank,
          tied: group.movies.length > 1,
        })),
      ),
    [resultGroups],
  );
  const shareListName =
    sorterId === 'fan-favorites' ? 'Fan Favorites' : "Nerf's Movie List";
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(
    () => () => {
      if (shareCard) URL.revokeObjectURL(shareCard.previewUrl);
    },
    [shareCard],
  );

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
    setPaceSamples([]);
    setBattleTransition(null);
    lastChoiceAt.current = null;
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
      setPaceSamples([]);
      setBattleTransition(null);
      lastChoiceAt.current = null;
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

      const now = performance.now();
      if (lastChoiceAt.current !== null) {
        const sample = (now - lastChoiceAt.current) / 1000;
        if (sample >= 0.35 && sample <= 20) {
          setPaceSamples((samples) => [...samples, sample].slice(-20));
        }
      }
      lastChoiceAt.current = now;

      const leftId = state.left?.[state.leftIndex];
      const rightId = state.right?.[state.rightIndex];
      const left = leftId ? byId.get(leftId) : undefined;
      const right = rightId ? byId.get(rightId) : undefined;
      if (left && right) {
        const id = transitionId.current + 1;
        transitionId.current = id;
        setBattleTransition({ id, left, right, choice });
        window.setTimeout(() => {
          setBattleTransition((transition) =>
            transition?.id === id ? null : transition,
          );
        }, 190);
      }

      setHistory((previous) => [...previous.slice(-79), cloneState(state)]);
      setState(applyChoice(state, choice));
    },
    [byId, state],
  );

  const undo = useCallback(() => {
    if (!history.length) return;
    const previous = history[history.length - 1];
    setState(previous);
    setHistory((items) => items.slice(0, -1));
    setBattleTransition(null);
    lastChoiceAt.current = null;
    setNotice('Last choice undone');
  }, [history]);

  const reset = useCallback(() => {
    setState(null);
    setHistory([]);
    setNotice(null);
    setShareDialogOpen(false);
    setShareCard(null);
    setPaceSamples([]);
    setBattleTransition(null);
    lastChoiceAt.current = null;
    window.localStorage.removeItem(saveKey);
    setHasSave(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [saveKey]);

  const copyRanking = useCallback(async () => {
    if (!state?.result) return;
    const text = resultGroups
      .flatMap((group) =>
        group.movies.map((movie) => `${group.rank}. ${movie.title}`),
      )
      .join('\n');
    await navigator.clipboard.writeText(text);
    setNotice('Ranking copied to clipboard');
  }, [resultGroups, state]);

  const openShareCard = useCallback(async () => {
    if (!state?.result) return;
    setShareDialogOpen(true);
    if (shareCard || isCreatingShareCard) return;

    setIsCreatingShareCard(true);
    try {
      const blob = await createTopTwentyCard({
        ranking: exportRanking,
        listName: shareListName,
        movieCount: movies.length,
        decisionCount: state.decisions,
      });
      setShareCard({ blob, previewUrl: URL.createObjectURL(blob) });
    } catch {
      setShareDialogOpen(false);
      setNotice('Could not create the share card');
    } finally {
      setIsCreatingShareCard(false);
    }
  }, [
    exportRanking,
    isCreatingShareCard,
    movies.length,
    shareCard,
    shareListName,
    state,
  ]);

  const downloadShareCard = useCallback(() => {
    if (!shareCard) return;
    downloadRankingImage(
      shareCard.blob,
      `screen-ranking-${sorterId}-top-20.png`,
    );
    setNotice('Share card downloaded');
  }, [shareCard, sorterId]);

  const sharePreparedCard = useCallback(async () => {
    if (!shareCard) return;
    const filename = `screen-ranking-${sorterId}-top-20.png`;
    const file = new File([shareCard.blob], filename, { type: 'image/png' });

    try {
      if (
        navigator.share &&
        (!navigator.canShare || navigator.canShare({ files: [file] }))
      ) {
        await navigator.share({
          files: [file],
          title: `My ${shareListName} ranking`,
          text: 'Made with Screen Ranking — https://screenranking.com',
        });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }

    downloadRankingImage(shareCard.blob, filename);
    setNotice('Share card downloaded');
  }, [shareCard, shareListName, sorterId]);

  const downloadFullRanking = useCallback(async () => {
    if (!state?.result || isCreatingFullRanking) return;
    setIsCreatingFullRanking(true);
    try {
      const blob = await createFullRankingCard({
        ranking: exportRanking,
        listName: shareListName,
        movieCount: movies.length,
        decisionCount: state.decisions,
      });
      downloadRankingImage(blob, `screen-ranking-${sorterId}-complete.png`);
      setNotice('Full ranking downloaded');
    } catch {
      setNotice('Could not create the full ranking image');
    } finally {
      setIsCreatingFullRanking(false);
    }
  }, [
    exportRanking,
    isCreatingFullRanking,
    movies.length,
    shareListName,
    sorterId,
    state,
  ]);

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

  useEffect(() => {
    if (!state?.result || !state.runId) return;
    if (window.location.hostname.endsWith('.github.io')) return;

    const submit = async () => {
      try {
        const response = await fetch(`${ASSET_PREFIX}/analytics/completions`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            version: 1,
            runId: state.runId,
            sorterId,
            listVersion: dataVersion,
            decisionCount: state.decisions,
            movieCount: movies.length,
            choices: state.choices,
            ranking: state.result,
          }),
          keepalive: true,
        });
        if (!response.ok) throw new Error('Analytics submission failed');
      } catch {
        // Analytics must never interrupt or delay the completed ranking.
      }
    };

    void submit();
  }, [dataVersion, movies.length, sorterId, state]);

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
            <Image src={heroImages.left} alt="" fill sizes="32vw" priority />
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
            <Image src={heroImages.right} alt="" fill sizes="32vw" priority />
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
          <p className="last-updated">Latest update · September 12, 2026</p>
        </footer>
      </main>
    );
  }

  if (state.result) {
    const rankedMovies = resultGroups.flatMap((group) =>
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
            <Button size="lg" onClick={openShareCard}>
              <Share2 aria-hidden="true" /> Share Top 20
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={downloadFullRanking}
              disabled={isCreatingFullRanking}
            >
              {isCreatingFullRanking ? (
                <Spinner aria-hidden="true" />
              ) : (
                <Download aria-hidden="true" />
              )}
              {isCreatingFullRanking ? 'Creating image…' : 'Download full list'}
            </Button>
            <Button size="lg" variant="ghost" onClick={copyRanking}>
              Copy as text
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
          <p>
            Completed rankings contribute to anonymous community stats. No
            account or personal details are collected.
          </p>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw aria-hidden="true" /> New sort
          </Button>
        </footer>

        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="share-card-dialog">
            <DialogHeader>
              <DialogTitle>Your Top 20</DialogTitle>
              <DialogDescription>
                A story-sized card with your top five posters and the rest of
                your top twenty.
              </DialogDescription>
            </DialogHeader>

            <div className="share-card-preview" aria-live="polite">
              {shareCard ? (
                <Image
                  src={shareCard.previewUrl}
                  alt={`Share card preview for ${shareListName}`}
                  width={1080}
                  height={1920}
                  unoptimized
                />
              ) : (
                <div className="share-card-loading">
                  <Spinner aria-hidden="true" />
                  <span>Creating your card…</span>
                </div>
              )}
            </div>

            <DialogFooter className="share-card-actions">
              <Button
                variant="outline"
                onClick={downloadShareCard}
                disabled={!shareCard}
              >
                <Download aria-hidden="true" /> Download
              </Button>
              <Button onClick={sharePreparedCard} disabled={!shareCard}>
                <Share2 aria-hidden="true" /> Share image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {notice && <output className="toast">{notice}</output>}
      </main>
    );
  }

  const leftMovie = byId.get(state.left![state.leftIndex])!;
  const rightMovie = byId.get(state.right![state.rightIndex])!;
  const remainingComparisons = estimateRemainingComparisons(state);
  const estimatedTotal = state.decisions + remainingComparisons;
  const progress = Math.min(
    99,
    Math.round((state.decisions / Math.max(estimatedTotal, 1)) * 100),
  );
  const pace = paceSamples.length >= 8 ? median(paceSamples) : null;
  const timeRemaining = pace
    ? formatTimeRemaining(remainingComparisons * pace)
    : 'Learning your pace…';

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
            <span
              title={
                pace
                  ? `Approximately ${remainingComparisons} decisions remaining at your current pace`
                  : 'A time estimate appears after your first few decisions'
              }
            >
              {timeRemaining}
            </span>
          </div>
          <Progress
            value={progress}
            aria-label={`${progress}% complete, approximately ${remainingComparisons} decisions remaining`}
          />
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

        <div className="battle-grid-wrap">
          <div
            className="battle-grid battle-grid-current"
            key={`${leftMovie.id}-${rightMovie.id}-${state.decisions}`}
          >
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

          {battleTransition && (
            <div
              className={`battle-grid battle-grid-transition battle-transition-${battleTransition.choice}`}
              aria-hidden="true"
            >
              <div className="movie-choice transition-choice transition-left">
                <Poster movie={battleTransition.left} />
                <span className="choice-footer">
                  <span className="choice-title">
                    {battleTransition.left.title}
                  </span>
                </span>
              </div>
              <div className="versus-mark">
                <span>or</span>
              </div>
              <div className="movie-choice transition-choice transition-right">
                <Poster movie={battleTransition.right} />
                <span className="choice-footer">
                  <span className="choice-title">
                    {battleTransition.right.title}
                  </span>
                </span>
              </div>
            </div>
          )}
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
