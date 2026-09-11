import { movies, type Movie } from './movies';

const additionalMovies: Movie[] = [
  {
    id: 'barbie-2023',
    title: 'Barbie',
    poster:
      'https://media.themoviedb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
  },
  {
    id: 'dead-poets-society-1989',
    title: 'Dead Poets Society',
    poster:
      'https://media.themoviedb.org/t/p/w500/tNvKkSnnn4Z6RCBThyK1gfCSSvv.jpg',
  },
  {
    id: 'joker-2019',
    title: 'Joker',
    poster:
      'https://media.themoviedb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
  },
  {
    id: 'kill-bill-vol-1-2003',
    title: 'Kill Bill: Vol. 1',
    poster:
      'https://media.themoviedb.org/t/p/w500/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg',
  },
  {
    id: 'ratatouille-2007',
    title: 'Ratatouille',
    poster:
      'https://media.themoviedb.org/t/p/w500/t3vaWRPSf6WjDSamIkKDs1iQWna.jpg',
  },
  {
    id: 'avengers-infinity-war-2018',
    title: 'Avengers: Infinity War',
    poster:
      'https://media.themoviedb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
  },
  {
    id: 'terminator-2-judgment-day-1991',
    title: 'Terminator 2: Judgment Day',
    poster:
      'https://media.themoviedb.org/t/p/w500/jFTVD4XoWQTcg7wdyJKa8PEds5q.jpg',
  },
  {
    id: 'die-hard-1988',
    title: 'Die Hard',
    poster:
      'https://media.themoviedb.org/t/p/w500/7Bjd8kfmDSOzpmhySpEhkUyK2oH.jpg',
  },
  {
    id: 'titanic-1997',
    title: 'Titanic',
    poster:
      'https://media.themoviedb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
  },
  {
    id: 'scott-pilgrim-vs-the-world-2010',
    title: 'Scott Pilgrim vs. the World',
    poster:
      'https://media.themoviedb.org/t/p/w500/g5IoYeudx9XBEfwNL0fHvSckLBz.jpg',
  },
  {
    id: 'back-to-the-future-1985',
    title: 'Back to the Future',
    poster:
      'https://media.themoviedb.org/t/p/w500/vN5B5WgYscRGcQpVhHl6p9DDTP0.jpg',
  },
  {
    id: 'star-wars-a-new-hope-1977',
    title: 'Star Wars: A New Hope',
    poster:
      'https://media.themoviedb.org/t/p/w500/fai0rspsNeJCS69wHNjOdWxcI7P.jpg',
  },
  {
    id: 'the-empire-strikes-back-1980',
    title: 'The Empire Strikes Back',
    poster:
      'https://media.themoviedb.org/t/p/w500/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg',
  },
  {
    id: 'toy-story-1995',
    title: 'Toy Story',
    poster:
      'https://media.themoviedb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg',
  },
  {
    id: 'brokeback-mountain-2005',
    title: 'Brokeback Mountain',
    poster:
      'https://media.themoviedb.org/t/p/w500/aByfQOQBNa4CMFwIgq3QrqY2ZHh.jpg',
  },
  {
    id: 'jurassic-park-1993',
    title: 'Jurassic Park',
    poster:
      'https://media.themoviedb.org/t/p/w500/63viWuPfYQjRYLSZSZNq7dglJP5.jpg',
  },
  {
    id: 'the-breakfast-club-1985',
    title: 'The Breakfast Club',
    poster:
      'https://media.themoviedb.org/t/p/w500/gp4zlj7wgbiofLMNsTPndMuO3PN.jpg',
  },
  {
    id: 'jaws-1975',
    title: 'Jaws',
    poster:
      'https://media.themoviedb.org/t/p/w500/lxM6kqilAdpdhqUl2biYp5frUxE.jpg',
  },
  {
    id: 'schindlers-list-1993',
    title: "Schindler's List",
    poster:
      'https://media.themoviedb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
  },
  {
    id: 'saving-private-ryan-1998',
    title: 'Saving Private Ryan',
    poster:
      'https://media.themoviedb.org/t/p/w500/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg',
  },
  {
    id: 'the-green-mile-1999',
    title: 'The Green Mile',
    poster:
      'https://media.themoviedb.org/t/p/w500/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg',
  },
  {
    id: 'raiders-of-the-lost-ark-1981',
    title: 'Raiders of the Lost Ark',
    poster:
      'https://media.themoviedb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg',
  },
  {
    id: 'rocky-1976',
    title: 'Rocky',
    poster:
      'https://media.themoviedb.org/t/p/w500/xSI0dbKLDETwhiVUy6hGE8KXUln.jpg',
  },
  {
    id: 'top-gun-maverick-2022',
    title: 'Top Gun: Maverick',
    poster:
      'https://media.themoviedb.org/t/p/w500/n0YuM4f5lvGAP6MAW2kBIzugXnc.jpg',
  },
  {
    id: 'scarface-1983',
    title: 'Scarface',
    poster:
      'https://media.themoviedb.org/t/p/w500/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg',
  },
  {
    id: 'oceans-eleven-2001',
    title: "Ocean's Eleven",
    poster:
      'https://media.themoviedb.org/t/p/w500/hQQCdZrsHtZyR6NbKH2YyCqd2fR.jpg',
  },
  {
    id: 'the-lion-king-1994',
    title: 'The Lion King',
    poster:
      'https://media.themoviedb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
  },
  {
    id: 'casablanca-1942',
    title: 'Casablanca',
    poster:
      'https://media.themoviedb.org/t/p/w500/lGCEKlJo2CnWydQj7aamY7s1S7Q.jpg',
  },
];

const popularTitles = [
  'Interstellar',
  'Fight Club',
  'Parasite',
  'Barbie',
  'La La Land',
  'Whiplash',
  'The Truman Show',
  'Pulp Fiction',
  'Dead Poets Society',
  'Everything Everywhere All at Once',
  'Oppenheimer',
  'Eternal Sunshine of the Spotless Mind',
  'Get Out',
  'Spider-Man: Into the Spider-Verse',
  'Dune',
  'The Dark Knight',
  'Inception',
  'Joker',
  'American Psycho',
  'Se7en',
  'The Wolf of Wall Street',
  'Spirited Away',
  'Spider-Man: Across the Spider-Verse',
  'Forrest Gump',
  'Dune: Part Two',
  'Good Will Hunting',
  'The Grand Budapest Hotel',
  'Black Swan',
  'Kill Bill: Vol. 1',
  'The Shining',
  'The Silence of the Lambs',
  'Shutter Island',
  'Inglourious Basterds',
  'One Battle After Another',
  'The Godfather',
  'The Godfather Part II',
  'Ratatouille',
  'Gone Girl',
  'Fantastic Mr. Fox',
  'Django Unchained',
  'The Shawshank Redemption',
  'Avengers: Infinity War',
  'The Lord of the Rings: The Fellowship of the Ring',
  'The Lord of the Rings: The Two Towers',
  'The Lord of the Rings: The Return of the King',
  'The Matrix',
  'Terminator 2: Judgment Day',
  'Die Hard',
  'Titanic',
  'Taxi Driver',
  'Hereditary',
  'Harry Potter and the Prisoner of Azkaban',
  'Scott Pilgrim vs. the World',
  'The Social Network',
  'Arrival',
  'Back to the Future',
  'Goodfellas',
  'Star Wars: A New Hope',
  'The Empire Strikes Back',
  'Prisoners',
  'WALL·E',
  'Toy Story',
  'Brokeback Mountain',
  'Jurassic Park',
  'Jaws',
  'Alien',
  'Gladiator',
  'The Breakfast Club',
  '12 Angry Men',
  'The Incredibles',
  'Moonlight',
  "Schindler's List",
  'There Will Be Blood',
  'No Country for Old Men',
  'Heat',
  'Psycho',
  'The Thing',
  'Blade Runner 2049',
  'The Departed',
  'Saving Private Ryan',
  'The Green Mile',
  'Raiders of the Lost Ark',
  'Full Metal Jacket',
  "One Flew Over the Cuckoo's Nest",
  'Rocky',
  'Top Gun: Maverick',
  'Scarface',
  "Ocean's Eleven",
  'The Lion King',
  'Casablanca',
] as const;

const movieByTitle = new Map(
  [...movies, ...additionalMovies].map((movie) => [movie.title, movie]),
);

export const popularMovies: Movie[] = popularTitles.map((title) => {
  const movie = movieByTitle.get(title);
  if (!movie) throw new Error(`Missing movie data for ${title}`);
  return movie;
});
