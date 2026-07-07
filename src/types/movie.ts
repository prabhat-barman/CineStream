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
  | 'Horror';

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
};

export type MovieRow = {
  id: string;
  title: string;
  movies: Movie[];
};
