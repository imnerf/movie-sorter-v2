import { MovieSorter } from '@/app/components/movie-sorter';
import { popularMovies } from '@/app/data/popular-movies';

export default function FanFavoritesMovieSorterPage() {
  return (
    <MovieSorter
      movies={popularMovies}
      saveKey="screen-ranking-fan-favorites-progress"
      dataVersion="2026-09-11-fan-favorites-1"
      listLabel="The movies everybody knows"
    />
  );
}
