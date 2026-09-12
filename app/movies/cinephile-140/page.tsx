import { MovieSorter } from '@/app/components/movie-sorter';
import { movies } from '@/app/data/movies';

export default function PersonalMovieSorterPage() {
  return (
    <MovieSorter
      movies={movies}
      sorterId="nerfs-movie-list"
      saveKey="movie-sorter-progress-v2"
      dataVersion="2026-09-09-2"
      listLabel="Nerf’s personal movie list"
      heroImages={{
        left: 'https://image.tmdb.org/t/p/original/8NJpmxMewkXsBRiXRxZf5GmTXrv.jpg',
        right:
          'https://image.tmdb.org/t/p/original/3kSYSzZZX0L6iFRgKUmg6A0blfl.jpg',
      }}
    />
  );
}
