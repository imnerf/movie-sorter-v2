CREATE TABLE `analytics_runs` (
	`run_id` text PRIMARY KEY NOT NULL,
	`sorter_id` text NOT NULL,
	`list_version` text NOT NULL,
	`completed_at` integer NOT NULL,
	`decision_count` integer NOT NULL,
	`movie_count` integer NOT NULL,
	`choices_json` text NOT NULL,
	`ranking_json` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_analytics_runs_sorter_completed` ON `analytics_runs` (`sorter_id`,`completed_at`);