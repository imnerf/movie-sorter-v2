import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { ScreenRankingWordmark } from '@/app/components/screen-ranking-wordmark';

const ASSET_PREFIX = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const studies = [
  {
    variant: 'primary' as const,
    number: '01',
    name: 'The Cut',
    note: 'Chosen direction',
    description:
      'A blunt, modern wordmark interrupted by one sharp cinematic slash. Strong enough for the poster wall, restrained enough for every kind of sorter.',
  },
  {
    variant: 'gothic' as const,
    number: '02',
    name: 'After Midnight',
    note: 'Gothic study',
    description:
      'Expressionist and theatrical. Beautiful at a large scale, but it pulls the whole brand closer to horror and repertory cinema.',
  },
  {
    variant: 'editorial' as const,
    number: '03',
    name: 'The Premiere',
    note: 'Editorial study',
    description:
      'Soft, elegant, and magazine-like. It brings taste and contrast, though it has less impact in a small navigation bar.',
  },
];

export default function BrandStudies() {
  return (
    <main className="brand-lab">
      <header className="brand-lab-header">
        <Link href={`${ASSET_PREFIX}/`} className="brand-back-link">
          <ArrowLeft aria-hidden="true" /> Back to the sorter
        </Link>
        <span className="brand-lab-index">Screen Ranking · Wordmark studies</span>
      </header>

      <section className="brand-lab-intro">
        <p className="eyebrow">Three open-source directions</p>
        <h1>One name. Three moods.</h1>
        <p>
          The first treatment is the strongest long-term identity: cinematic,
          memorable, and flexible without becoming genre-specific.
        </p>
      </section>

      <section className="logo-studies" aria-label="Screen Ranking logo options">
        {studies.map((study) => (
          <article
            className={`logo-study ${study.variant === 'primary' ? 'logo-study--selected' : ''}`}
            key={study.variant}
          >
            <div className="logo-study-meta">
              <span>{study.number}</span>
              <span>{study.note}</span>
            </div>
            <div className="logo-study-stage">
              <ScreenRankingWordmark variant={study.variant} />
            </div>
            <div className="logo-study-copy">
              <h2>{study.name}</h2>
              <p>{study.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="brand-size-test" aria-labelledby="size-test-title">
        <div>
          <p className="eyebrow">Real-world test</p>
          <h2 id="size-test-title">The Cut holds up at every size.</h2>
        </div>
        <div className="brand-size-samples">
          <ScreenRankingWordmark variant="primary" className="size-sample-large" />
          <ScreenRankingWordmark variant="primary" className="size-sample-medium" />
          <ScreenRankingWordmark variant="primary" className="size-sample-small" />
        </div>
      </section>
    </main>
  );
}
