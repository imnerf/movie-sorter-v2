import { MovieSorter } from '@/app/components/movie-sorter';
import { popularMovies } from '@/app/data/popular-movies';

export default function FanFavoritesMovieSorterPage() {
  return (
    <MovieSorter
      movies={popularMovies}
      sorterId="fan-favorites"
      saveKey="screen-ranking-fan-favorites-progress"
      dataVersion="2026-09-15-fan-favorites-unseen-1"
      listLabel="The movies everybody knows"
      heroImages={{
        left: 'https://image.tmdb.org/t/p/original/vGYJRor3pCyjbaCpJKC39MpJhIT.jpg',
        right:
          'https://image.tmdb.org/t/p/original/twXYxcrup1QzyT84g2kbuz1iN01.jpg',
      }}
    />
  );
}
