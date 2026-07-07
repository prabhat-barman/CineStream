export type Genre =
  | 'Action'
  | 'Adventure'
  | 'Sci-Fi'
  | 'Drama'
  | 'Thriller'
  | 'Comedy'
  | 'Animation'
  | 'Crime'
  | 'Romance'
  | 'Horror'
  | 'Documentary'
  | 'Fantasy'
  | 'Mystery';

export type Movie = {
  id: string;
  title: string;
  year: number;
  rating: number;
  match: number;
  runtimeMin: number;
  genres: Genre[];
  poster: string;
  backdrop: string;
  synopsis: string;
  cast: string[];
  director: string;
  maturity: string;
  seasons?: number;
  isNew?: boolean;
  trending?: boolean;
};

export type MovieRow = {
  id: string;
  title: string;
  movies: Movie[];
};

export type Episode = {
  id: string;
  season: number;
  number: number;
  title: string;
  synopsis: string;
  runtimeMin: number;
  thumb: string;
};

export type Podcast = {
  id: string;
  title: string;
  author: string;
  cover: string;
  episodes: number;
  category: string;
};

export type AudioStory = {
  id: string;
  title: string;
  description: string;
  cover: string;
  durationMin: number;
};

export type NotificationItem = {
  id: string;
  type: 'new_release' | 'recommendation' | 'reminder' | 'trending';
  title: string;
  body: string;
  thumb?: string;
  time: string;
  unread?: boolean;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  interval: 'month' | 'year';
  perks: string[];
  highlighted?: boolean;
};

export type ContinueWatchingItem = {
  id: string;
  movie: Movie;
  progress: number;
  remainingMin: number;
};
