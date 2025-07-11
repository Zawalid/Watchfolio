/**
 * Standard response format from TMDB API list endpoints
 */
declare type TMDBResponse<T = Media> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

/**
 * Cast or crew member information
 */
declare interface Person {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  character: string;
  credit_id: string;
  order: number;
  job?: string;
  birthday?: string;
  place_of_birth?: string;
  biography?: string;
  homepage?: string;
  deathday?: string;
}

/**
 * Video information for trailers, teasers, clips, etc.
 */
declare interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

/**
 * Information about a TV episode
 */
declare interface Episode {
  air_date: string;
  episode_number: number;
  episode_type: string;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}

/**
 * Information about a TV season
 */
declare interface Season {
  _id?: string;
  air_date: string;
  episode_count?: number;
  episodes?: Episode[];
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
  show_id?: number;
}

/**
 * Base properties shared by all media types
 */
declare interface BaseMedia {
  id: number;
  vote_average: number;
  vote_count: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  original_language: string;
  adult: boolean;
  popularity: number;
}

/**
 * Movie information - works for both basic and detailed responses
 */
declare interface Movie extends BaseMedia {
  media_type: 'movie' | 'tv';
  title: string;
  original_title: string;
  release_date: string | null;

  genre_ids?: number[];
  genres?: { id: number; name: string }[];

  runtime?: number;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
  credits?: { cast: Person[]; crew: Person[] };
  videos?: { results: Video[] };
  production_companies?: { id: number; logo_path: string | null; name: string; origin_country: string }[];
  production_countries?: { iso_3166_1: string; name: string }[];
  spoken_languages?: { english_name: string; iso_639_1: string; name: string }[];
  belongs_to_collection?: { id: number; name: string; poster_path: string | null; backdrop_path: string | null };
}

/**
 * TV Show information - works for both basic and detailed responses
 */
declare interface TvShow extends BaseMedia {
  media_type: 'tv' | 'movie';
  name: string;
  original_name: string;
  first_air_date: string | null;
  origin_country: string[];

  genre_ids?: number[];
  genres?: { id: number; name: string }[];

  status?: string;
  last_air_date?: string | null;
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  seasons?: Season[];
  created_by?: Person[];
  credits?: { cast: Person[]; crew: Person[] };
  videos?: { results: Video[] };
  production_companies?: { id: number; logo_path: string | null; name: string; origin_country: string }[];
  production_countries?: { iso_3166_1: string; name: string }[];
  spoken_languages?: { english_name: string; iso_639_1: string; name: string }[];
  networks?: { id: number; name: string; logo_path: string | null; origin_country: string }[];
  type?: string;
  in_production?: boolean;
}

type Media = Movie | TvShow;

/**
 * Collection information
 */
declare interface Collection {
  id: number;
  name: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  parts: Array<Media>;
}

/**
 * Images information
 */
type Image = {
  aspect_ratio: number;
  height: number;
  iso_639_1: string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
};
declare interface Images {
  backdrops: Image[];
  id: 1119878;
  logos: Image[];
  posters: Image[];
}

/**
 * Credits information
 */
interface Credit extends Movie, TvShow {
  character: string;
  credit_id: string;
  order: number;
  job: string;
  roles: string[]; // Array of all roles for this project
  primaryRole: 'acting' | 'voice' | 'guest' | 'production'; // Primary role type
}
declare interface PersonCredits {
  cast: Credit[];
  crew: Credit[];
  id: number;
}