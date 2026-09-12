import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const analyticsRuns = sqliteTable(
  'analytics_runs',
  {
    runId: text('run_id').primaryKey(),
    sorterId: text('sorter_id').notNull(),
    listVersion: text('list_version').notNull(),
    completedAt: integer('completed_at').notNull(),
    decisionCount: integer('decision_count').notNull(),
    movieCount: integer('movie_count').notNull(),
    choicesJson: text('choices_json').notNull(),
    rankingJson: text('ranking_json').notNull(),
  },
  (table) => [
    index('idx_analytics_runs_sorter_completed').on(
      table.sorterId,
      table.completedAt,
    ),
  ],
);
