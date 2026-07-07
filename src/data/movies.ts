import type {
  AudioStory,
  ContinueWatchingItem,
  Episode,
  Movie,
  MovieRow,
  NotificationItem,
  Podcast,
  SubscriptionPlan,
} from '../types/movie';

const tmdb = (path: string, size: 'w500' | 'w1280' = 'w500') =>
  `https://image.tmdb.org/t/p/${size}${path}`;

export const movies: Movie[] = [
  {
    id: 'm1',
    title: 'Oppenheimer',
    year: 2023,
    rating: 8.4,
    match: 97,
    runtimeMin: 180,
    genres: ['Drama', 'Thriller'],
    poster: tmdb('/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'),
    backdrop: tmdb('/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', 'w1280'),
    synopsis:
      'A dramatization of the life of physicist J. Robert Oppenheimer, the man behind the Manhattan Project and the development of the atomic bomb.',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    director: 'Christopher Nolan',
    maturity: 'R',
  },
  {
    id: 'm2',
    title: 'Nebula Rising',
    year: 2024,
    rating: 8.9,
    match: 98,
    runtimeMin: 154,
    genres: ['Sci-Fi', 'Adventure'],
    poster: tmdb('/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'),
    backdrop: tmdb('/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', 'w1280'),
    synopsis:
      'In a galaxy consumed by shadow, one pilot must find the light that has never meant to be. An interstellar epic that redefines the boundaries of space opera.',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    director: 'Denis Villeneuve',
    maturity: 'PG-13',
    isNew: true,
    trending: true,
  },
  {
    id: 'm3',
    title: 'Inception',
    year: 2010,
    rating: 8.8,
    match: 96,
    runtimeMin: 148,
    genres: ['Sci-Fi', 'Thriller', 'Action'],
    poster: tmdb('/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'),
    backdrop: tmdb('/s3TBrRGB1iav7gFOCNx3H31MoES.jpg', 'w1280'),
    synopsis:
      'A skilled thief who steals corporate secrets through dream-sharing technology is given a chance at redemption if he can plant an idea in a target\u2019s mind.',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    director: 'Christopher Nolan',
    maturity: 'PG-13',
  },
  {
    id: 'm4',
    title: 'Interstellar',
    year: 2014,
    rating: 8.7,
    match: 98,
    runtimeMin: 169,
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    poster: tmdb('/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'),
    backdrop: tmdb('/xJHokMbljvjADYdit5fK5VQsXEG.jpg', 'w1280'),
    synopsis:
      'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\u2019s survival.',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    director: 'Christopher Nolan',
    maturity: 'PG-13',
  },
  {
    id: 'm5',
    title: 'The Dark Knight',
    year: 2008,
    rating: 9.0,
    match: 99,
    runtimeMin: 152,
    genres: ['Action', 'Crime', 'Drama'],
    poster: tmdb('/qJ2tW6WMUDux911r6m7haRef0WH.jpg'),
    backdrop: tmdb('/hqkIcbrOHL86UncnHIsHVcVmzue.jpg', 'w1280'),
    synopsis:
      'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests of his ability to fight injustice.',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    director: 'Christopher Nolan',
    maturity: 'PG-13',
  },
  {
    id: 'm6',
    title: 'John Wick: Chapter 4',
    year: 2023,
    rating: 7.7,
    match: 89,
    runtimeMin: 169,
    genres: ['Action', 'Thriller'],
    poster: tmdb('/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg'),
    backdrop: tmdb('/7I6VUdPj6tQECNHdviJkUHXzISy.jpg', 'w1280'),
    synopsis:
      'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy.',
    cast: ['Keanu Reeves', 'Donnie Yen', 'Bill Skarsg\u00e5rd'],
    director: 'Chad Stahelski',
    maturity: 'R',
  },
  {
    id: 'm7',
    title: 'Spider-Man: Across the Spider-Verse',
    year: 2023,
    rating: 8.6,
    match: 96,
    runtimeMin: 140,
    genres: ['Animation', 'Action', 'Adventure'],
    poster: tmdb('/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg'),
    backdrop: tmdb('/4HodYYKEIsGOdinkGi2Ucfxbxu5.jpg', 'w1280'),
    synopsis:
      'After reuniting with Gwen Stacy, Brooklyn\u2019s Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People.',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
    director: 'Joaquim Dos Santos',
    maturity: 'PG',
  },
  {
    id: 'm8',
    title: 'Top Gun: Maverick',
    year: 2022,
    rating: 8.3,
    match: 93,
    runtimeMin: 130,
    genres: ['Action', 'Drama'],
    poster: tmdb('/62HCnUTziyWcpDaBO2i1DX17ljH.jpg'),
    backdrop: tmdb('/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg', 'w1280'),
    synopsis:
      'After more than thirty years of service as one of the Navy\u2019s top aviators, Pete Mitchell is where he belongs \u2014 pushing the envelope as a courageous test pilot.',
    cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly'],
    director: 'Joseph Kosinski',
    maturity: 'PG-13',
  },
  {
    id: 'm9',
    title: 'Everything Everywhere All at Once',
    year: 2022,
    rating: 7.8,
    match: 90,
    runtimeMin: 139,
    genres: ['Action', 'Adventure', 'Comedy'],
    poster: tmdb('/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg'),
    backdrop: tmdb('/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg', 'w1280'),
    synopsis:
      'A middle-aged Chinese immigrant is swept up in an insane adventure in which she alone can save existence by exploring other universes.',
    cast: ['Michelle Yeoh', 'Ke Huy Quan', 'Stephanie Hsu'],
    director: 'Daniels',
    maturity: 'R',
  },
  {
    id: 'm10',
    title: 'The Batman',
    year: 2022,
    rating: 7.8,
    match: 91,
    runtimeMin: 176,
    genres: ['Action', 'Crime', 'Drama'],
    poster: tmdb('/74xTEgt7R36Fpooo50r9T25onhq.jpg'),
    backdrop: tmdb('/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg', 'w1280'),
    synopsis:
      'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\u2019s hidden corruption.',
    cast: ['Robert Pattinson', 'Zo\u00eb Kravitz', 'Paul Dano'],
    director: 'Matt Reeves',
    maturity: 'PG-13',
  },
  {
    id: 'm11',
    title: 'Parasite',
    year: 2019,
    rating: 8.5,
    match: 94,
    runtimeMin: 132,
    genres: ['Drama', 'Thriller'],
    poster: tmdb('/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'),
    backdrop: tmdb('/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg', 'w1280'),
    synopsis:
      'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    director: 'Bong Joon-ho',
    maturity: 'R',
  },
  {
    id: 'm12',
    title: 'Avatar: The Way of Water',
    year: 2022,
    rating: 7.6,
    match: 88,
    runtimeMin: 192,
    genres: ['Sci-Fi', 'Adventure'],
    poster: tmdb('/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg'),
    backdrop: tmdb('/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg', 'w1280'),
    synopsis:
      'Jake Sully lives with his newfound family on Pandora. When a familiar threat returns, Jake must work with Neytiri to protect their family.',
    cast: ['Sam Worthington', 'Zoe Salda\u00f1a', 'Sigourney Weaver'],
    director: 'James Cameron',
    maturity: 'PG-13',
  },
  {
    id: 's1',
    title: 'Cyber Pulse',
    year: 2024,
    rating: 8.9,
    match: 97,
    runtimeMin: 55,
    genres: ['Sci-Fi', 'Thriller', 'Mystery'],
    poster: tmdb('/58QT4cPJ2u2TqWZkterDq9q4yxQ.jpg'),
    backdrop: tmdb('/rIB4YsBFtdbPCTUXKa7uS8AjZmQ.jpg', 'w1280'),
    synopsis:
      'In a world where consciousness can be uploaded to the net, a rogue detective discovers a conspiracy that threatens to override the physical realm.',
    cast: ['Zendaya', 'Oscar Isaac', 'John Boyega'],
    director: 'Alex Garland',
    maturity: 'TV-MA',
    seasons: 2,
    isNew: true,
    trending: true,
  },
  {
    id: 's2',
    title: 'Stellar Voyage',
    year: 2024,
    rating: 8.6,
    match: 96,
    runtimeMin: 130,
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    poster: tmdb('/lPPeqRIRZg9pjujwOsmnJc1TPmT.jpg'),
    backdrop: tmdb('/8gxRefF5PfPUUsWcbEHDbGnkrX7.jpg', 'w1280'),
    synopsis:
      'An epic journey across the cosmos to save the last remnants of a fading humanity.',
    cast: ['Florence Pugh', 'Idris Elba', 'Anya Taylor-Joy'],
    director: 'Denis Villeneuve',
    maturity: 'PG-13',
    isNew: true,
  },
  {
    id: 's3',
    title: 'Midnight Echoes',
    year: 2024,
    rating: 8.2,
    match: 92,
    runtimeMin: 118,
    genres: ['Thriller', 'Mystery'],
    poster: tmdb('/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg'),
    backdrop: tmdb('/gGqnp4dOA9M5nMZOxSJnbjkBmvS.jpg', 'w1280'),
    synopsis:
      'Sound designer Rae hears a voice from another decade calling her name every midnight.',
    cast: ['Anya Taylor-Joy', 'Riz Ahmed'],
    director: 'Ari Aster',
    maturity: 'R',
  },
];

const byId = Object.fromEntries(movies.map(m => [m.id, m]));

export const getMovie = (id: string): Movie | undefined => byId[id];

export const featuredMovie: Movie = byId.m2;
export const featuredShow: Movie = byId.s1;
export const discoverFeatured: Movie = byId.s2;

export const trending: Movie[] = ['s1', 'm2', 'm5', 'm4', 'm10', 'm3'].map(
  id => byId[id],
);
export const newReleases: Movie[] = ['m2', 's1', 's2', 'm6', 'm7', 'm12'].map(
  id => byId[id],
);
export const actionMovies: Movie[] = ['m5', 'm6', 'm10', 'm8', 'm9'].map(
  id => byId[id],
);
export const nolanCollection: Movie[] = ['m1', 'm3', 'm4', 'm5'].map(
  id => byId[id],
);
export const forYou: Movie[] = ['s2', 's3', 'm11', 'm7'].map(id => byId[id]);
export const becauseYouWatched: Movie[] = ['m6', 'm3', 'm7'].map(id => byId[id]);
export const savedTitles: Movie[] = ['s1', 's2', 'm5', 'm10', 'm11', 'm4'].map(
  id => byId[id],
);
export const downloadedMovies: Movie[] = ['m3', 'm8', 'm11'].map(
  id => byId[id],
);

export const continueWatching: ContinueWatchingItem[] = [
  {id: 'cw1', movie: byId.m3, progress: 0.42, remainingMin: 47},
  {id: 'cw2', movie: byId.m8, progress: 0.68, remainingMin: 22},
  {id: 'cw3', movie: byId.m11, progress: 0.15, remainingMin: 84},
  {id: 'cw4', movie: byId.m9, progress: 0.86, remainingMin: 12},
];

export const rows: MovieRow[] = [
  {id: 'r1', title: 'Trending Now', movies: trending},
  {id: 'r2', title: 'New Releases', movies: newReleases},
  {id: 'r3', title: 'Action & Adventure', movies: actionMovies},
  {id: 'r4', title: 'The Nolan Collection', movies: nolanCollection},
];

export const episodes: Episode[] = [
  {
    id: 'e1',
    season: 2,
    number: 1,
    title: 'The Ghost Protocol',
    synopsis:
      'The investigation into the breach begins as Rae finds a hidden signal in the deep web.',
    runtimeMin: 52,
    thumb: tmdb('/rIB4YsBFtdbPCTUXKa7uS8AjZmQ.jpg', 'w500'),
  },
  {
    id: 'e2',
    season: 2,
    number: 2,
    title: 'Fragmented Realities',
    synopsis:
      'Reality begins to blur for Rae as her consciousness is fractured across the outage.',
    runtimeMin: 48,
    thumb: tmdb('/xJHokMbljvjADYdit5fK5VQsXEG.jpg', 'w500'),
  },
  {
    id: 'e3',
    season: 2,
    number: 3,
    title: 'Silent Frequencies',
    synopsis:
      'A rogue AI network begins broadcasting on a channel only Rae can hear.',
    runtimeMin: 56,
    thumb: tmdb('/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg', 'w500'),
  },
  {
    id: 'e4',
    season: 2,
    number: 4,
    title: 'The Deep Sync',
    synopsis:
      'Rae dives into the deep sync layer to expose the mastermind, but discovers a familiar face.',
    runtimeMin: 61,
    thumb: tmdb('/s3TBrRGB1iav7gFOCNx3H31MoES.jpg', 'w500'),
  },
];

export const podcasts: Podcast[] = [
  {
    id: 'p1',
    title: 'Behind the Lens',
    author: 'Director\u2019s Cut',
    cover: tmdb('/8QVDXDiOGHRcAD4oM6MXjE0osSj.jpg'),
    episodes: 24,
    category: 'Filmmaking',
  },
  {
    id: 'p2',
    title: 'Script to Screen',
    author: 'Writer\u2019s Room',
    cover: tmdb('/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'),
    episodes: 41,
    category: 'Writing',
  },
  {
    id: 'p3',
    title: 'Score & Sound',
    author: 'Composers Circle',
    cover: tmdb('/58QT4cPJ2u2TqWZkterDq9q4yxQ.jpg'),
    episodes: 12,
    category: 'Music',
  },
];

export const audioStories: AudioStory[] = [
  {
    id: 'a1',
    title: 'The Silent Star',
    description: 'A spatial audio journey through the outer edges of the galaxy.',
    cover: tmdb('/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg'),
    durationMin: 42,
  },
  {
    id: 'a2',
    title: 'Echo Chamber',
    description: 'Six voices, one room, one impossible confession.',
    cover: tmdb('/hqkIcbrOHL86UncnHIsHVcVmzue.jpg'),
    durationMin: 28,
  },
];

export const recentSearches = [
  'Interstellar',
  'Oppenheimer',
  'Dark Part Two',
];

export const searchCategories = ['All Genres', 'Action', 'Comedy'];

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'new_release',
    title: 'Beyond the Nebula',
    body: 'The highly anticipated sci-fi thriller is now streaming in your region.',
    thumb: tmdb('/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', 'w500'),
    time: '2h ago',
    unread: true,
  },
  {
    id: 'n2',
    type: 'recommendation',
    title: 'Top pick for you',
    body: 'CineStream\u2019s Neil Gallardan has been curated based on your recent activity.',
    time: '5h ago',
    unread: true,
  },
  {
    id: 'n3',
    type: 'trending',
    title: 'Midnight Protocol is now the #1 series in your region',
    body: 'Join millions catching the finale.',
    thumb: tmdb('/rIB4YsBFtdbPCTUXKa7uS8AjZmQ.jpg', 'w500'),
    time: 'Yesterday',
  },
  {
    id: 'n4',
    type: 'reminder',
    title: 'Continue watching',
    body: 'Resume watching City of Echoes.',
    thumb: tmdb('/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 'w500'),
    time: 'Yesterday',
  },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan_basic',
    name: 'Basic',
    price: '\u20b9199',
    interval: 'month',
    perks: ['720p streaming', '1 device at a time', 'Ad-supported'],
  },
  {
    id: 'plan_premium',
    name: 'Premium',
    price: '\u20b9499',
    interval: 'month',
    perks: [
      '4K UHD + HDR streaming',
      'Watch on 4 devices',
      'Unlimited downloads',
      'Ad-free experience',
    ],
    highlighted: true,
  },
  {
    id: 'plan_annual',
    name: 'Annual',
    price: '\u20b94,999',
    interval: 'year',
    perks: [
      'All Premium benefits',
      'Save 20% vs monthly',
      'Priority customer support',
    ],
  },
];
