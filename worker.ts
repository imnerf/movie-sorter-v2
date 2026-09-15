import vinextHandler from 'vinext/server/fetch-handler';

import { movies } from './app/data/movies';
import { popularMovies } from './app/data/popular-movies';
import { recordCompletedRun, type CompletedRun } from './lib/analytics-db';

type BattleChoice = {
  leftMovieId: string;
  rightMovieId: string;
  result: 'left' | 'right' | 'unseen-left' | 'unseen-right' | 'unseen-both';
};

type Submission = {
  version: number;
  runId: string;
  sorterId: 'nerfs-movie-list' | 'fan-favorites';
  listVersion: string;
  decisionCount: number;
  movieCount: number;
  choices: BattleChoice[];
  ranking: string[];
  unseen: string[];
};

const sorterMovies = {
  'nerfs-movie-list': new Set(movies.map((movie) => movie.id)),
  'fan-favorites': new Set(popularMovies.map((movie) => movie.id)),
};

const sorterMovieTitles = {
  'nerfs-movie-list': new Map(
    movies.map((movie) => [movie.id, movie.title] as const),
  ),
  'fan-favorites': new Map(
    popularMovies.map((movie) => [movie.id, movie.title] as const),
  ),
};

const jsonHeaders = {
  'cache-control': 'no-store',
  'content-type': 'application/json; charset=utf-8',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function isUuid(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

function validateSubmission(value: unknown): value is Submission {
  if (!value || typeof value !== 'object') return false;
  const input = value as Partial<Submission>;
  if (input.version !== 2 || !isUuid(input.runId)) return false;
  if (
    input.sorterId !== 'nerfs-movie-list' &&
    input.sorterId !== 'fan-favorites'
  ) {
    return false;
  }
  if (
    typeof input.listVersion !== 'string' ||
    input.listVersion.length < 1 ||
    input.listVersion.length > 80
  ) {
    return false;
  }

  const validMovies = sorterMovies[input.sorterId];
  if (!Array.isArray(input.ranking) || !Array.isArray(input.unseen)) {
    return false;
  }

  const rankedMovies = new Set(input.ranking);
  const unseenMovies = new Set(input.unseen);
  const minimumDecisions =
    Math.ceil(unseenMovies.size / 2) + Math.max(0, rankedMovies.size - 1);

  if (
    !Number.isInteger(input.decisionCount) ||
    input.decisionCount! < minimumDecisions ||
    input.decisionCount! > 1200 ||
    input.movieCount !== validMovies.size ||
    rankedMovies.size !== input.ranking.length ||
    unseenMovies.size !== input.unseen.length ||
    rankedMovies.size + unseenMovies.size !== validMovies.size ||
    input.ranking.some((movieId) => !validMovies.has(movieId)) ||
    input.unseen.some(
      (movieId) => !validMovies.has(movieId) || rankedMovies.has(movieId),
    ) ||
    !Array.isArray(input.choices) ||
    input.choices.length !== input.decisionCount
  ) {
    return false;
  }

  return input.choices.every(
    (choice) =>
      choice &&
      typeof choice === 'object' &&
      validMovies.has(choice.leftMovieId) &&
      validMovies.has(choice.rightMovieId) &&
      choice.leftMovieId !== choice.rightMovieId &&
      (choice.result === 'left' ||
        choice.result === 'right' ||
        choice.result === 'unseen-left' ||
        choice.result === 'unseen-right' ||
        choice.result === 'unseen-both'),
  );
}

async function handleAnalytics(request: Request, database?: D1Database) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 160_000) return json({ error: 'Payload too large' }, 413);

  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 160_000) return json({ error: 'Payload too large' }, 413);
    payload = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  if (!validateSubmission(payload)) {
    return json({ error: 'Invalid completed run' }, 400);
  }

  if (!database) {
    return json({ error: 'Analytics temporarily unavailable' }, 503);
  }

  try {
    const movieTitles = sorterMovieTitles[payload.sorterId];
    const completedRun: CompletedRun = {
      ...payload,
      choices: payload.choices.map((choice) => ({
        ...choice,
        leftMovieTitle: movieTitles.get(choice.leftMovieId)!,
        rightMovieTitle: movieTitles.get(choice.rightMovieId)!,
      })),
      ranking: payload.ranking.map((movieId) => ({
        movieId,
        movieTitle: movieTitles.get(movieId)!,
      })),
    };
    const result = await recordCompletedRun(database, completedRun);
    return json({ recorded: Number(result.meta.changes) > 0 });
  } catch {
    return json({ error: 'Analytics temporarily unavailable' }, 503);
  }
}

const worker = {
  async fetch(
    request: Request,
    workerEnv: { DB?: D1Database },
    context: ExecutionContext,
  ) {
    const url = new URL(request.url);
    if (
      url.pathname === '/movies/cinephile-140' ||
      url.pathname === '/movies/cinephile-140/'
    ) {
      return Response.redirect(new URL('/movies/nerfs-list', url), 308);
    }
    if (url.pathname === '/analytics/completions') {
      return handleAnalytics(request, workerEnv.DB);
    }
    return vinextHandler.fetch(request, workerEnv, context);
  },
};

export default worker;
