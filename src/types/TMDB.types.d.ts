/**
 * Standard response format from TMDB API list endpoints
 */
declare type TMDBResponse = {
  page: number; // Current page of results
  results: TvShow[] | Movie[]; // Array of movies or TV shows
  total_pages: number; // Total number of available pages
  total_results: number; // Total number of matching results
};

/**
 * Basic movie information for list/search results
 */
declare interface Movie {
  id: number; // Unique TMDB movie identifier
  vote_average: number; // Average user rating (0-10)
  poster_path: string | null; // Relative path to poster image
  genre_ids: number[]; // Array of genre identifiers
  media_type: 'tv' | 'movie'; // Type of media
  title: string; // Movie title
  release_date: string | null; // Release date in format YYYY-MM-DD
}

/**
 * Basic TV show information for list/search results
 */
declare interface TvShow {
  id: number; // Unique TMDB TV show identifier
  vote_average: number; // Average user rating (0-10)
  poster_path: string | null; // Relative path to poster image
  genre_ids: number[]; // Array of genre identifiers
  media_type: 'tv' | 'movie'; // Type of media
  name: string; // TV show name/title
  first_air_date: string | null; // First air date in format YYYY-MM-DD
}

/**
 * Cast or crew member information
 */
declare interface Person {
  adult: boolean; // Whether person is marked as adult content
  gender: number; // Gender identifier (1=female, 2=male)
  id: number; // Unique TMDB person identifier
  known_for_department: string; // Primary department (Acting, Directing, etc.)
  name: string; // Person's name
  original_name: string; // Person's name in original language
  popularity: number; // Popularity score on TMDB
  profile_path: string | null; // Relative path to profile image
  character: string; // Character name (for cast members)
  credit_id: string; // Unique credit identifier
  order: number; // Order in credits list
}

/**
 * Video information for trailers, teasers, clips, etc.
 */
declare interface Video {
  id: string; // Unique video identifier
  iso_639_1: string; // Language code (e.g., 'en' for English)
  iso_3166_1: string; // Country code (e.g., 'US' for United States)
  key: string; // YouTube video key for embedding
  name: string; // Title of the video
  official: boolean; // Whether it's an official video
  published_at: string; // Publication date
  site: string; // Video hosting site (YouTube, Vimeo, etc.)
  size: number; // Resolution (480, 720, 1080)
  type: string; // Type (Trailer, Teaser, Clip, etc.)
}

/**
 * Common media properties shared by both movies and TV shows
 */
declare interface TMDBMedia {
  id: number; // Unique TMDB identifier
  vote_average: number; // Average user rating (0-10)
  backdrop_path: string; // Relative path to backdrop image
  poster_path: string | null; // Relative path to poster image
  overview: string; // Plot summary/description
  genres: {
    id: number; // Genre identifier
    name: string; // Genre name (e.g., "Action", "Drama")
  }[];
  credits: {
    cast: Person[]; // Cast members
    crew: Person[]; // Crew members
  };
  videos?: {
    results: Video[]; // Associated videos
  };
  genre_ids: number[]; // Array of genre identifiers
  original_language: string; // Original language code (e.g., 'en')
  media_type: 'tv' | 'movie'; // Type of media
}

/**
 * Information about a TV episode
 */
declare interface Episode {
  air_date: string; // Air date of the episode in format YYYY-MM-DD
  episode_number: number; // Episode number within the season
  episode_type: string; // Type of episode (e.g., "standard")
  id: number; // Unique episode identifier
  name: string; // Episode title
  overview: string; // Episode description/summary
  production_code: string; // Production code identifier
  runtime: number; // Episode runtime in minutes
  season_number: number; // Season number this episode belongs to
  show_id: number; // ID of the show this episode belongs to
  still_path: string | null; // Relative path to episode still image
  vote_average: number; // Average user rating (0-10)
  vote_count: number; // Number of votes
}

/**
 * Information about a TV season
 */
declare interface Season {
  _id?: string; // MongoDB ID (if applicable)
  air_date: string; // First air date of the season
  episode_count?: number; // Number of episodes in the season
  episodes?: Episode[]; // Array of episodes in this season
  id: number; // Unique season identifier
  name: string; // Season name
  overview: string; // Season description
  poster_path: string | null; // Relative path to season poster
  season_number: number; // Season number (1, 2, etc.)
  vote_average: number; // Average user rating for the season
  show_id?: number; // ID of the show this season belongs to
}

/**
 * Detailed TV show information
 */
declare interface TvShowDetails extends TMDBMedia {
  original_name: string; // Original name in native language
  name: string; // TV show name/title
  status: string; // Status (e.g., "Returning Series", "Ended")
  first_air_date: string | null; // First air date in format YYYY-MM-DD
  last_air_date: string; // Most recent air date
  number_of_seasons: number; // Total number of seasons
  number_of_episodes: number; // Total number of episodes
  episode_run_time: number[]; // Average episode runtime in minutes
  seasons: Season[]; // Array of seasons
}

/**
 * Detailed movie information
 */
declare interface MovieDetails extends TMDBMedia {
  original_title: string; // Original title in native language
  title: string; // Movie title
  release_date: string | null; // Release date in format YYYY-MM-DD
  runtime: number; // Runtime in minutes
}
