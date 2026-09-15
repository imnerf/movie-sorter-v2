-- Completed sorts by list.
SELECT sorter_id, COUNT(*) AS completed_sorts
FROM analytics_runs
GROUP BY sorter_id
ORDER BY completed_sorts DESC;

-- Most battle wins. Unseen actions are excluded from wins and losses.
WITH battles AS (
  SELECT
    runs.sorter_id,
    CASE json_extract(choice.value, '$.result')
      WHEN 'left' THEN json_extract(choice.value, '$.leftMovieTitle')
      WHEN 'right' THEN json_extract(choice.value, '$.rightMovieTitle')
    END AS winner,
    CASE json_extract(choice.value, '$.result')
      WHEN 'left' THEN json_extract(choice.value, '$.rightMovieTitle')
      WHEN 'right' THEN json_extract(choice.value, '$.leftMovieTitle')
    END AS loser
  FROM analytics_runs AS runs, json_each(runs.choices_json) AS choice
),
appearances AS (
  SELECT sorter_id, winner AS movie, 1 AS won FROM battles WHERE winner IS NOT NULL
  UNION ALL
  SELECT sorter_id, loser AS movie, 0 AS won FROM battles WHERE loser IS NOT NULL
)
SELECT
  sorter_id,
  movie,
  SUM(won) AS wins,
  COUNT(*) - SUM(won) AS losses,
  ROUND(100.0 * SUM(won) / COUNT(*), 1) AS win_percentage
FROM appearances
GROUP BY sorter_id, movie
ORDER BY sorter_id, wins DESC, win_percentage DESC;

-- Average final rank and number-one finishes.
WITH finishes AS (
  SELECT
    runs.sorter_id,
    CAST(ranking.key AS INTEGER) + 1 AS final_rank,
    json_extract(ranking.value, '$.movieTitle') AS movie
  FROM analytics_runs AS runs, json_each(runs.ranking_json) AS ranking
)
SELECT
  sorter_id,
  movie,
  COUNT(*) AS completed_sorts,
  ROUND(AVG(final_rank), 1) AS average_rank,
  SUM(CASE WHEN final_rank = 1 THEN 1 ELSE 0 END) AS first_place_finishes,
  SUM(CASE WHEN final_rank <= 10 THEN 1 ELSE 0 END) AS top_ten_finishes
FROM finishes
GROUP BY sorter_id, movie
ORDER BY sorter_id, average_rank, first_place_finishes DESC;
