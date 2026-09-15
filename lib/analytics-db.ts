export type CompletedRun = {
  runId: string;
  sorterId: string;
  listVersion: string;
  decisionCount: number;
  movieCount: number;
  choices: {
    leftMovieId: string;
    leftMovieTitle: string;
    rightMovieId: string;
    rightMovieTitle: string;
    result: 'left' | 'right' | 'unseen-left' | 'unseen-right' | 'unseen-both';
  }[];
  ranking: { movieId: string; movieTitle: string }[];
};

export async function recordCompletedRun(
  database: D1Database,
  run: CompletedRun,
) {
  return database
    .prepare(
      `INSERT OR IGNORE INTO analytics_runs (
        run_id,
        sorter_id,
        list_version,
        completed_at,
        decision_count,
        movie_count,
        choices_json,
        ranking_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      run.runId,
      run.sorterId,
      run.listVersion,
      Date.now(),
      run.decisionCount,
      run.movieCount,
      JSON.stringify(run.choices),
      JSON.stringify(run.ranking),
    )
    .run();
}
