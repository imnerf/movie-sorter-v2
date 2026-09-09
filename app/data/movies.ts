export type Movie = {
  id: string;
  title: string;
  poster: string;
};

type MovieSeed = {
  name: string;
  img: string;
  opts: Record<string, never>;
};

// Add, remove, or reorder movies in this single list. Poster URLs use TMDB's CDN.
const movieSeeds: MovieSeed[] = [
  {
    name: 'Parasite',
    img: 'https://image.tmdb.org/t/p/original/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    opts: {},
  },
  {
    name: 'Everything Everywhere All at Once',
    img: 'https://image.tmdb.org/t/p/w500/u68AjlvlutfEIcpmbYpKcdi09ut.jpg',
    opts: {},
  },
  {
    name: 'Interstellar',
    img: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    opts: {},
  },
  {
    name: 'Oppenheimer',
    img: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    opts: {},
  },
  {
    name: 'Whiplash',
    img: 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
    opts: {},
  },
  {
    name: 'Spider-Man: Into the Spider-Verse',
    img: 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
    opts: {},
  },
  {
    name: 'The Dark Knight',
    img: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    opts: {},
  },
  {
    name: 'The Truman Show',
    img: 'https://image.tmdb.org/t/p/w500/vuza0WqY239yBXOadKlGwJsZJFE.jpg',
    opts: {},
  },
  {
    name: 'Poor Things',
    img: 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
    opts: {},
  },
  {
    name: 'Inception',
    img: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    opts: {},
  },
  {
    name: 'Spider-Man: Across the Spider-Verse',
    img: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    opts: {},
  },
  {
    name: 'Dune: Part Two',
    img: 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
    opts: {},
  },
  {
    name: 'The Grand Budapest Hotel',
    img: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
    opts: {},
  },
  {
    name: 'Spirited Away',
    img: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    opts: {},
  },
  {
    name: 'The Shining',
    img: 'https://image.tmdb.org/t/p/w500/fFYAlrOudDJRYs8tvuHbUk0OGdL.jpg',
    opts: {},
  },
  {
    name: 'Se7en',
    img: 'https://image.tmdb.org/t/p/w500/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg',
    opts: {},
  },
  {
    name: 'Inglourious Basterds',
    img: 'https://image.tmdb.org/t/p/w500/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg',
    opts: {},
  },
  {
    name: 'The Silence of the Lambs',
    img: 'https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg',
    opts: {},
  },
  {
    name: 'The Godfather',
    img: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    opts: {},
  },
  {
    name: 'Django Unchained',
    img: 'https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg',
    opts: {},
  },
  {
    name: 'Fantastic Mr. Fox',
    img: 'https://image.tmdb.org/t/p/w500/bOVr292mwn3jxr1e0NmUPM1rcjo.jpg',
    opts: {},
  },
  {
    name: 'Jojo Rabbit',
    img: 'https://image.tmdb.org/t/p/w500/7GsM4mtM0worCtIVeiQt28HieeN.jpg',
    opts: {},
  },
  {
    name: 'Blade Runner 2049',
    img: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    opts: {},
  },
  {
    name: 'Arrival',
    img: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg',
    opts: {},
  },
  {
    name: 'Dunkirk',
    img: 'https://image.tmdb.org/t/p/w500/b4Oe15CGLL61Ped0RAS9JpqdmCt.jpg',
    opts: {},
  },
  {
    name: 'Moonlight',
    img: 'https://image.tmdb.org/t/p/w500/rcICfiL9fvwRjoWHxW8QeroLYrJ.jpg',
    opts: {},
  },
  {
    name: '2001: A Space Odyssey',
    img: 'https://image.tmdb.org/t/p/w500/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg',
    opts: {},
  },
  {
    name: "It's a Wonderful Life",
    img: 'https://image.tmdb.org/t/p/original/bSqt9rhDZx1Q7UZ86dBPKdNomp2.jpg',
    opts: {},
  },
  {
    name: '1917',
    img: 'https://image.tmdb.org/t/p/w500/iZf0KyrE25z1sage4SYFLCCrMi9.jpg',
    opts: {},
  },
  {
    name: 'Prisoners',
    img: 'https://image.tmdb.org/t/p/w500/jsS3a3ep2KyBVmmiwaz3LvK49b1.jpg',
    opts: {},
  },
  {
    name: 'Alien',
    img: 'https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg',
    opts: {},
  },
  {
    name: 'WALL·E',
    img: 'https://image.tmdb.org/t/p/original/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg',
    opts: {},
  },
  {
    name: 'Aftersun',
    img: 'https://image.tmdb.org/t/p/w500/evKz85EKouVbIr51zy5fOtpNRPg.jpg',
    opts: {},
  },
  {
    name: 'Anora',
    img: 'https://image.tmdb.org/t/p/original/9leBvae1CCbti0BhoArm6kInKwF.jpg',
    opts: {},
  },
  {
    name: 'Coraline',
    img: 'https://image.tmdb.org/t/p/w500/4jeFXQYytChdZYE9JYO7Un87IlW.jpg',
    opts: {},
  },
  {
    name: 'The Shawshank Redemption',
    img: 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    opts: {},
  },
  {
    name: 'Mad Max: Fury Road',
    img: 'https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg',
    opts: {},
  },
  {
    name: 'Past Lives',
    img: 'https://image.tmdb.org/t/p/w500/rzO71VFu7CpJMfF5TQNMj0d1lSV.jpg',
    opts: {},
  },
  {
    name: 'Harry Potter and the Prisoner of Azkaban',
    img: 'https://image.tmdb.org/t/p/w500/aWxwnYoe8p2d2fcxOqtvAtJ72Rw.jpg',
    opts: {},
  },
  {
    name: 'Anatomy of a Fall',
    img: 'https://image.tmdb.org/t/p/w500/kQs6keheMwCxJxrzV83VUwFtHkB.jpg',
    opts: {},
  },
  {
    name: 'Goodfellas',
    img: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
    opts: {},
  },
  {
    name: 'Memento',
    img: 'https://image.tmdb.org/t/p/w500/nWtySDlffTfwAa0rSfq61o33ZXV.jpg',
    opts: {},
  },
  {
    name: 'Catch Me If You Can',
    img: 'https://image.tmdb.org/t/p/w500/sdYgEkKCDPWNU6KnoL4qd8xZ4w7.jpg',
    opts: {},
  },
  {
    name: 'Psycho',
    img: 'https://image.tmdb.org/t/p/w500/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg',
    opts: {},
  },
  {
    name: 'Perfect Blue',
    img: 'https://image.tmdb.org/t/p/w500/6WTiOCfDPP8XV4jqfloiVWf7KHq.jpg',
    opts: {},
  },
  {
    name: 'Oldboy',
    img: 'https://image.tmdb.org/t/p/original/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg',
    opts: {},
  },
  {
    name: 'Requiem for a Dream',
    img: 'https://image.tmdb.org/t/p/w500/nOd6vjEmzCT0k4VYqsA2hwyi87C.jpg',
    opts: {},
  },
  {
    name: 'The Prestige',
    img: 'https://image.tmdb.org/t/p/w500/bdN3gXuIZYaJP7ftKK2sU0nPtEA.jpg',
    opts: {},
  },
  {
    name: 'The Incredibles',
    img: 'https://image.tmdb.org/t/p/w500/2LqaLgk4Z226KkgPJuiOQ58wvrm.jpg',
    opts: {},
  },
  {
    name: 'The Lord of the Rings: The Two Towers',
    img: 'https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg',
    opts: {},
  },
  {
    name: 'There Will Be Blood',
    img: 'https://image.tmdb.org/t/p/w500/spYrDOOLnkIfUOwTKKixC3h5j6G.jpg',
    opts: {},
  },
  {
    name: 'The Departed',
    img: 'https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg',
    opts: {},
  },
  {
    name: 'The Nightmare Before Christmas',
    img: 'https://image.tmdb.org/t/p/w500/oQffRNjK8e19rF7xVYEN8ew0j7b.jpg',
    opts: {},
  },
  {
    name: '12 Angry Men',
    img: 'https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg',
    opts: {},
  },
  {
    name: 'Once Upon a Time in Hollywood',
    img: 'https://image.tmdb.org/t/p/original/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg',
    opts: {},
  },
  {
    name: 'City of God',
    img: 'https://image.tmdb.org/t/p/w500/k7eYdWvhYQyRQoU2TB2A2Xu2TfD.jpg',
    opts: {},
  },
  {
    name: 'La Haine',
    img: 'https://image.tmdb.org/t/p/w500/8rgPyWjYZhsphSSxbXguMnhN7H0.jpg',
    opts: {},
  },
  {
    name: 'Children of Men',
    img: 'https://image.tmdb.org/t/p/original/8Xgvmx7WWc7Z9Ws9RAYk7uya2kh.jpg',
    opts: {},
  },
  {
    name: "Pan's Labyrinth",
    img: 'https://image.tmdb.org/t/p/w500/2VVhikIxoztAXEDQZLOdtBsu6vf.jpg',
    opts: {},
  },
  {
    name: 'Godzilla Minus One',
    img: 'https://image.tmdb.org/t/p/w500/hkxxMIGaiCTmrEArK7J56JTKUlB.jpg',
    opts: {},
  },
  {
    name: 'Full Metal Jacket',
    img: 'https://image.tmdb.org/t/p/w500/kMKyx1k8hWWscYFnPbnxxN4Eqo4.jpg',
    opts: {},
  },
  {
    name: 'Apocalypse Now',
    img: 'https://image.tmdb.org/t/p/w500/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg',
    opts: {},
  },
  {
    name: 'The Godfather Part II',
    img: 'https://image.tmdb.org/t/p/w500/sSuQTCZwqKrNBNIsksO9IAUoWP9.jpg',
    opts: {},
  },
  {
    name: 'The Thing',
    img: 'https://image.tmdb.org/t/p/w500/a9RjXOIIB56k2rGoL3Fk3nRHHHQ.jpg',
    opts: {},
  },
  {
    name: 'Memories of Murder',
    img: 'https://image.tmdb.org/t/p/w500/rxndHKwUeFgTHx0PuuhZS4dMtrB.jpg',
    opts: {},
  },
  {
    name: "One Flew Over the Cuckoo's Nest",
    img: 'https://image.tmdb.org/t/p/original/kjWsMh72V6d8KRLV4EOoSJLT1H7.jpg',
    opts: {},
  },
  {
    name: '12 Years a Slave',
    img: 'https://image.tmdb.org/t/p/w500/xdANQijuNrJaw1HA61rDccME4Tm.jpg',
    opts: {},
  },
  {
    name: 'The Hunt',
    img: 'https://image.tmdb.org/t/p/original/jkixsXzRh28q3PCqFoWcf7unghT.jpg',
    opts: {},
  },
  {
    name: 'Incendies',
    img: 'https://image.tmdb.org/t/p/w500/yH6DAQVgbyj72S66gN4WWVoTjuf.jpg',
    opts: {},
  },
  {
    name: 'Cure',
    img: 'https://image.tmdb.org/t/p/original/yTRrqIGusJuzG5Pe3iFQTnHg1Ps.jpg',
    opts: {},
  },
  {
    name: 'Fight Club',
    img: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    opts: {},
  },
  {
    name: 'Pulp Fiction',
    img: 'https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg',
    opts: {},
  },
  {
    name: 'Dune',
    img: 'https://image.tmdb.org/t/p/w500/v1tRXZ4JtD2Iv6fjkPvT4GiwslV.jpg',
    opts: {},
  },
  {
    name: 'Get Out',
    img: 'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg',
    opts: {},
  },
  {
    name: 'Midsommar',
    img: 'https://image.tmdb.org/t/p/w500/vqPtSD5kJJTEFuJluj4C1J8wKKf.jpg',
    opts: {},
  },
  {
    name: 'Do the Right Thing',
    img: 'https://image.tmdb.org/t/p/original/5HLbsqpJ2VOFvnaMnghRQVZKaV4.jpg',
    opts: {},
  },
  {
    name: 'American Psycho',
    img: 'https://image.tmdb.org/t/p/w500/9uGHEgsiUXjCNq8wdq4r49YL8A1.jpg',
    opts: {},
  },
  {
    name: 'The Wolf of Wall Street',
    img: 'https://image.tmdb.org/t/p/w500/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg',
    opts: {},
  },
  {
    name: 'Eternal Sunshine of the Spotless Mind',
    img: 'https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg',
    opts: {},
  },
  {
    name: 'Gone Girl',
    img: 'https://image.tmdb.org/t/p/w500/lv5xShBIDPe7m4ufdlV0IAc7Avk.jpg',
    opts: {},
  },
  {
    name: 'Black Swan',
    img: 'https://image.tmdb.org/t/p/w500/viWheBd44bouiLCHgNMvahLThqx.jpg',
    opts: {},
  },
  {
    name: 'Hereditary',
    img: 'https://image.tmdb.org/t/p/w500/p9fmuz2Oj3HtEJEqbIwkFGUhVXD.jpg',
    opts: {},
  },
  {
    name: 'Shutter Island',
    img: 'https://image.tmdb.org/t/p/w500/nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg',
    opts: {},
  },
  {
    name: 'Taxi Driver',
    img: 'https://image.tmdb.org/t/p/w500/ekstpH614fwDX8DUln1a2Opz0N8.jpg',
    opts: {},
  },
  {
    name: 'Forrest Gump',
    img: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    opts: {},
  },
  {
    name: 'Donnie Darko',
    img: 'https://image.tmdb.org/t/p/w500/6FKym4sm5LcqUC80HNpn2ejVoro.jpg',
    opts: {},
  },
  {
    name: 'Eyes Wide Shut',
    img: 'https://image.tmdb.org/t/p/w500/knEIz1eNGl5MQDbrEAVWA7iRqF9.jpg',
    opts: {},
  },
  {
    name: 'The Lord of the Rings: The Fellowship of the Ring',
    img: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    opts: {},
  },
  {
    name: 'Princess Mononoke',
    img: 'https://image.tmdb.org/t/p/original/cMYCDADoLKLbB83g4WnJegaZimC.jpg',
    opts: {},
  },
  {
    name: 'Killers of the Flower Moon',
    img: 'https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg',
    opts: {},
  },
  {
    name: 'Zodiac',
    img: 'https://image.tmdb.org/t/p/w500/6YmeO4pB7XTh8P8F960O1uA14JO.jpg',
    opts: {},
  },
  {
    name: "Singin' in the Rain",
    img: 'https://image.tmdb.org/t/p/original/w03EiJVHP8Un77boQeE7hg9DVdU.jpg',
    opts: {},
  },
  {
    name: 'Fargo',
    img: 'https://image.tmdb.org/t/p/w500/rUjUCT6GvFS475sKJVfHWZUdnv5.jpg',
    opts: {},
  },
  {
    name: 'Mulholland Drive',
    img: 'https://image.tmdb.org/t/p/w500/x7A59t6ySylr1L7aubOQEA480vM.jpg',
    opts: {},
  },
  {
    name: "Howl's Moving Castle",
    img: 'https://image.tmdb.org/t/p/original/13kOl2v0nD2OLbVSHnHk8GUFEhO.jpg',
    opts: {},
  },
  {
    name: 'Manchester by the Sea',
    img: 'https://image.tmdb.org/t/p/w500/e8daDzP0vFOnGyKmve95Yv0D0io.jpg',
    opts: {},
  },
  {
    name: 'All Quiet on the Western Front',
    img: 'https://image.tmdb.org/t/p/w500/2IRjbi9cADuDMKmHdLK7LaqQDKA.jpg',
    opts: {},
  },
  {
    name: 'Heat',
    img: 'https://image.tmdb.org/t/p/w500/umSVjVdbVwtx5ryCA2QXL44Durm.jpg',
    opts: {},
  },
  {
    name: 'The Chungking Express',
    img: 'https://image.tmdb.org/t/p/w500/43I9DcNoCzpyzK8JCkJYpHqHqGG.jpg',
    opts: {},
  },
  {
    name: 'Aliens',
    img: 'https://image.tmdb.org/t/p/w500/r1x5JGpyqZU8PYhbs4UcrO1Xb6x.jpg',
    opts: {},
  },
  {
    name: 'Room',
    img: 'https://image.tmdb.org/t/p/w500/pCURNjeomWbMSdiP64gj8NVVHTQ.jpg',
    opts: {},
  },
  {
    name: 'The Usual Suspects',
    img: 'https://image.tmdb.org/t/p/w500/rWbsxdwF9qQzpTPCLmDfVnVqTK1.jpg',
    opts: {},
  },
  {
    name: 'The Apartment',
    img: 'https://image.tmdb.org/t/p/w500/hhSRt1KKfRT0yEhEtRW3qp31JFU.jpg',
    opts: {},
  },
  {
    name: 'Autumn Sonata',
    img: 'https://image.tmdb.org/t/p/w500/6beNbtCXv3GkzHkxkGYf38ib7v8.jpg',
    opts: {},
  },
  {
    name: 'Paris, Texas',
    img: 'https://image.tmdb.org/t/p/w500/tqsz4nHSLvKcKio4FSEYFBEIEbo.jpg',
    opts: {},
  },
  {
    name: 'Rear Window',
    img: 'https://image.tmdb.org/t/p/w500/o9U7kbBLY1jtis5dnEc2V1qRsvk.jpg',
    opts: {},
  },
  {
    name: 'Vertigo',
    img: 'https://image.tmdb.org/t/p/w500/15uOEfqBNTVtDUT7hGBVCka0rZz.jpg',
    opts: {},
  },
  {
    name: 'After Hours',
    img: 'https://image.tmdb.org/t/p/w500/3eLTAg0A7Ae66D5dkn4c7akpR39.jpg',
    opts: {},
  },
  {
    name: 'Gladiator',
    img: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
    opts: {},
  },
  {
    name: 'The Matrix',
    img: 'https://image.tmdb.org/t/p/w500/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg',
    opts: {},
  },
  {
    name: 'The Seventh Seal',
    img: 'https://image.tmdb.org/t/p/w500/j6z3c6dGXtPHUATJX8J7Y70mM1S.jpg',
    opts: {},
  },
  {
    name: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    img: 'https://image.tmdb.org/t/p/w500/gHm96BRW4GoI339rF1vYoYTB6Qe.jpg',
    opts: {},
  },
  {
    name: 'The Lord of the Rings: The Return of the King',
    img: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
    opts: {},
  },
  {
    name: 'Persona',
    img: 'https://image.tmdb.org/t/p/w500/mAE4uwrXLlzo5AAxEorFvErdumq.jpg',
    opts: {},
  },
  {
    name: 'Good Will Hunting',
    img: 'https://image.tmdb.org/t/p/w500/z2FnLKpFi1HPO7BEJxdkv6hpJSU.jpg',
    opts: {},
  },
  {
    name: 'Reservoir Dogs',
    img: 'https://image.tmdb.org/t/p/w500/xi8Iu6qyTfyZVDVy60raIOYJJmk.jpg',
    opts: {},
  },
  {
    name: 'Chinatown',
    img: 'https://image.tmdb.org/t/p/original/kZRSP3FmOcq0xnBulqpUQngJUXY.jpg',
    opts: {},
  },
  {
    name: 'High and Low',
    img: 'https://image.tmdb.org/t/p/original/tgNjemQPG96uIezpiUiXFcer5ga.jpg',
    opts: {},
  },
  {
    name: 'The Social Network',
    img: 'https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg',
    opts: {},
  },
  {
    name: 'The Exorcist',
    img: 'https://image.tmdb.org/t/p/w500/5x0CeVHJI8tcDx8tUUwYHQSNILq.jpg',
    opts: {},
  },
  {
    name: 'Minari',
    img: 'https://image.tmdb.org/t/p/w500/6mPNdmjdbVKPITv3LLCmQoKs9Zw.jpg',
    opts: {},
  },
  {
    name: 'The Holdovers',
    img: 'https://image.tmdb.org/t/p/w500/VHSzNBTwxV8vh7wylo7O9CLdac.jpg',
    opts: {},
  },
  {
    name: 'Stand by Me',
    img: 'https://image.tmdb.org/t/p/original/7QbJa6syM4ZYxtey0d7qB7bmhzb.jpg',
    opts: {},
  },
  {
    name: 'Dog Day Afternoon',
    img: 'https://image.tmdb.org/t/p/original/mavrhr0ig2aCRR8d48yaxtD5aMQ.jpg',
    opts: {},
  },
  {
    name: 'Portrait of a Lady on Fire',
    img: 'https://image.tmdb.org/t/p/original/2LquGwEhbg3soxSCs9VNyh5VJd9.jpg',
    opts: {},
  },
  {
    name: 'One Battle After Another',
    img: 'https://image.tmdb.org/t/p/original/m1jFoahEbeQXtx4zArT2FKdbNIj.jpg',
    opts: {},
  },
  {
    name: 'Boogie Nights',
    img: 'https://image.tmdb.org/t/p/original/6fzz3HkAGJxhGcwRZwpbEZxgZMu.jpg',
    opts: {},
  },
  {
    name: 'Uncut Gems',
    img: 'https://image.tmdb.org/t/p/w500/6XN1vxHc7kUSqNWtaQKN45J5x2v.jpg',
    opts: {},
  },
  {
    name: 'No Country for Old Men',
    img: 'https://image.tmdb.org/t/p/w500/bj1v6YKF8yHqA489VFfnQvOJpnc.jpg',
    opts: {},
  },
  {
    name: 'The Odyssey',
    img: 'https://image.tmdb.org/t/p/w500/5rhTDKUhPYvpdQIijFIs5VoWsON.jpg',
    opts: {},
  },
  {
    name: 'Sing Sing',
    img: 'https://image.tmdb.org/t/p/w500/ig5ju3Tt56UGoBrc6IlkUS6ahfE.jpg',
    opts: {},
  },
  {
    name: 'Phantom Thread',
    img: 'https://image.tmdb.org/t/p/w500/hgoWjp9Sh0MI97eAMZCnIoVfgvq.jpg',
    opts: {},
  },
  {
    name: 'Sentimental Value',
    img: 'https://image.tmdb.org/t/p/w500/pz9NCWxxOk3o0W3v1Zkhawrwb4i.jpg',
    opts: {},
  },
  {
    name: 'The Florida Project',
    img: 'https://image.tmdb.org/t/p/w500/5QnDxdJg1fi6uMSkSi4x8tHsltm.jpg',
    opts: {},
  },
  {
    name: 'The Battle of Algiers',
    img: 'https://image.tmdb.org/t/p/w500/2p3AFtOHFvP6OeVMqlnL1zLKOqL.jpg',
    opts: {},
  },
  {
    name: 'Le Trou',
    img: 'https://image.tmdb.org/t/p/w500/xyZhiOz5NHVBUKlpioxjwajy7pm.jpg',
    opts: {},
  },
  {
    name: 'Being John Malkovich',
    img: 'https://image.tmdb.org/t/p/w500/31FGQu3OnwdmS4COquENe0vMZc0.jpg',
    opts: {},
  },
  {
    name: 'Argo',
    img: 'https://image.tmdb.org/t/p/w500/m5gPWFZFIp4UJFABgWyLkbXv8GX.jpg',
    opts: {},
  },
  {
    name: 'La La Land',
    img: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
    opts: {},
  },
  {
    name: 'Red Rooms',
    img: 'https://image.tmdb.org/t/p/w500/uBJvbf0g9rcsYElcwZCMYU0Vrj8.jpg',
    opts: {},
  },
  {
    name: 'The Conversation',
    img: 'https://image.tmdb.org/t/p/w500/dHqVBwcv1SGymOpUueRoKzcmdes.jpg',
    opts: {},
  },
  {
    name: 'Sinners',
    img: 'https://image.tmdb.org/t/p/w500/fWPgbnt2LSqkQ6cdQc0SZN9CpLm.jpg',
    opts: {},
  },
  {
    name: 'Hamnet',
    img: 'https://image.tmdb.org/t/p/w500/vbeyOZm2bvBXcbgPD3v6o94epPX.jpg',
    opts: {},
  },
  {
    name: 'The Fabelmans',
    img: 'https://image.tmdb.org/t/p/w500/h7llKkqkkJtJrTOaDLuVeUYDQ7I.jpg',
    opts: {},
  },
];

export const movies: Movie[] = movieSeeds.map((movie, index) => ({
  id: `${index + 1}-${movie.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}`,
  title: movie.name,
  poster: movie.img.replace('/original/', '/w500/'),
}));
