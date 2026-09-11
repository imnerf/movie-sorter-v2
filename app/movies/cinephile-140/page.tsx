import { MovieSorter } from '@/app/components/movie-sorter';
import { movies } from '@/app/data/movies';

export default function PersonalMovieSorterPage() {
  return (
    <MovieSorter
      movies={movies}
      saveKey="movie-sorter-progress-v2"
      dataVersion="2026-09-09-2"
      listLabel="Nerf’s personal movie list"
    />
  );
}
