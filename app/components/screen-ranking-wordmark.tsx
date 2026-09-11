type WordmarkVariant = 'primary' | 'gothic' | 'editorial';

export function ScreenRankingWordmark({
  variant = 'primary',
  className = '',
}: {
  variant?: WordmarkVariant;
  className?: string;
}) {
  return (
    <span
      className={`screen-ranking-wordmark screen-ranking-wordmark--${variant} ${className}`.trim()}
      aria-label="Screen Ranking"
    >
      <span className="wordmark-screen" aria-hidden="true">
        Screen
      </span>
      <span className="wordmark-cut" aria-hidden="true">
        /
      </span>
      <span className="wordmark-ranking" aria-hidden="true">
        Ranking
      </span>
    </span>
  );
}
