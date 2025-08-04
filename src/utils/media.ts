import { formatDate, slugify } from '.';
import { GENRES } from './constants/TMDB';

export const getRating = (rating: number) => (rating % 1 === 0 ? rating : rating.toFixed(1));

export const getReleaseYear = (media: Media, format: 'year' | 'full' = 'year') => {
  const dateStr = (media as Movie).release_date || (media as TvShow).first_air_date;

  if (!dateStr) return null;

  if (format === 'year') {
    return new Date(dateStr).getFullYear();
  } else {
    return formatDate(dateStr);
  }
};

export const getMediaType = (media: Media): MediaType => {
  if (media.media_type) return media.media_type;
  if ((media as Movie).release_date !== undefined) {
    return 'movie';
  } else if ((media as TvShow).first_air_date !== undefined) {
    return 'tv';
  }
  throw new Error('Unknown media type');
};

export const getTmdbImage = (
  item?: Media | Person | Collection | Episode | Image | Season | Suggestion | null,
  size: TmdbImageSize = 'w500'
): string => {
  if (!item) return '/images/placeholder.png';
  if ('poster_path' in item && item.poster_path) return `http://image.tmdb.org/t/p/${size}${item.poster_path}`;
  if ('backdrop_path' in item && item.backdrop_path) return `http://image.tmdb.org/t/p/${size}${item.backdrop_path}`;
  if ('profile_path' in item && item.profile_path) return `http://image.tmdb.org/t/p/${size}${item.profile_path}`;
  if ('still_path' in item && item.still_path) return `http://image.tmdb.org/t/p/${size}${item.still_path}`;
  if ('file_path' in item && item.file_path) return `http://image.tmdb.org/t/p/${size}${item.file_path}`;
  if ('logo_path' in item && item.logo_path) return `http://image.tmdb.org/t/p/${size}${item.logo_path}`;
  return '/images/placeholder.png';
};

export const getFormattedRuntime = (media: Media): string => {
  const runtime = (media as Movie).runtime || (media as TvShow).episode_run_time?.[0];

  if (!runtime) return 'N/A';

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${getMediaType(media) === 'tv' ? '/Episode' : ''}`;
};

export const getDirectorOrCreator = (media: Media): Person | null => {
  const mediaType = getMediaType(media);

  if (mediaType === 'movie') {
    const movieMedia = media as Movie;
    return movieMedia.credits?.crew?.find((person) => person.job === 'Director') || null;
  } else {
    const tvMedia = media as TvShow;
    return tvMedia.created_by?.[0] || null;
  }
};

export const generateMediaLink = (item?: Media | LibraryMedia) => {
  if (!item) return '/';
  const mediaType = 'media_type' in item ? item.media_type : getMediaType(item);
  const title = 'title' in item ? item.title : (item as TvShow).name;
  return `/${mediaType === 'tv' ? 'tv' : 'movies'}/details/${(item as LibraryMedia).tmdbId || item.id}-${slugify(title || '')}`;
};

export const isMedia = (obj: Media | LibraryMedia): obj is Media => obj && ('vote_average' in obj || 'overview' in obj);

export const getGenres = (genre_ids?: number[]) =>
  genre_ids
    ?.slice(0, 2)
    .map((id) => GENRES.find((genre) => genre.id === id)?.label || 'Unknown')
    .filter(Boolean) || [];

// Person Details Utilities
/**
 * Processes a raw list of credits from the TMDB API, filtering out irrelevant entries
 * and sorting the rest into clean, distinct categories. This function acts as a "bouncer,"
 * ensuring only high-quality, relevant work is passed on for display.
 *
 * The key steps are:
 * 1. Filter out low-quality data (e.g., items with no poster or very few votes).
 * 2. Consolidate multiple roles for the same project into a single entry.
 * 3. Assign a definitive `primaryRole` to each project ('acting', 'production', 'voice', 'guest').
 * 4. Exclude irrelevant appearances (like on talk shows).
 * 5. Return a structured object containing arrays for each category.
 *
 * @param {Credit[]} credits - The raw array of cast and crew credits from the TMDB API.
 * @returns An object containing categorized arrays of processed credits.
 */
export const categorizeCredits = (
  credits: Credit[]
): {
  movies: Credit[];
  tvShows: Credit[];
  voice: Credit[];
  guest: Credit[];
  production: Credit[];
} => {
  // Use a Map to ensure each project (movie/TV show) is processed only once,
  // consolidating all of a person's roles for that project.
  const projectMap = new Map<string, Credit>();

  const excludedCharacterKeywords = ['self', 'archive footage', 'uncredited', 'himself', 'herself', 'themselves'];
  const guestShowTypes = ['Talk Show', 'Reality', 'News', 'Game Show'];

  credits.forEach((credit) => {
    // --- Step 1: Quality Control Filter ---
    // Ignore entries that are likely to be low-quality or incomplete data.
    if (!credit.poster_path || (credit.vote_count || 0) < 5) {
      return;
    }

    const projectKey = `${credit.id}-${credit.media_type}`;
    const existing = projectMap.get(projectKey);

    // --- Step 2: Role Consolidation ---
    // If we've already seen this project, just add the new role to the existing entry.
    if (existing) {
      if (credit.job && !existing.roles.includes(credit.job)) {
        existing.roles.push(credit.job);
      } else if (credit.character && !existing.roles.some((r) => r.includes(credit.character!))) {
        existing.roles.push(`as ${credit.character}`);
      }
      return; // Stop processing this duplicate credit.
    }

    // --- Step 3: Assign a Primary Role ---
    // This is for new projects we haven't seen before. We determine its main category.
    let primaryRole: Credit['primaryRole'] | 'exclude' = 'acting';
    const roles: string[] = [];
    let character: string | undefined;

    if (credit.job) {
      // Production roles (Director, Writer, etc.) take highest priority.
      primaryRole = 'production';
      roles.push(credit.job);
    } else if (credit.character) {
      // Acting roles are processed next.
      character = credit.character;
      const characterLower = character.toLowerCase();
      roles.push(`as ${character}`);

      // Check if it's a guest or miscellaneous appearance that shouldn't be in the main acting list.
      if (excludedCharacterKeywords.some((keyword) => characterLower.includes(keyword))) {
        primaryRole = 'guest';
      }

      // A specific check for voice work is more reliable than a general keyword search.
      if (characterLower.endsWith('(voice)')) {
        primaryRole = 'voice';
      }

      // --- Step 4: Exclusion Filter ---
      // Completely exclude appearances on certain types of shows (e.g., talk shows).
      const showType = (credit as TvShow).type;
      if (showType && guestShowTypes.includes(showType)) {
        primaryRole = 'exclude';
      }
    } else {
      // If a credit has no character and no job, it's unusable data.
      return;
    }

    // If flagged for exclusion, we stop processing it here.
    if (primaryRole === 'exclude') {
      return;
    }

    const finalCredit: Credit = { ...credit, roles, primaryRole };
    projectMap.set(projectKey, finalCredit);
  });

  // --- Step 5: Final Categorization ---
  // Convert the Map back to an array and split it into the final category buckets.
  const consolidated = Array.from(projectMap.values());

  const movies = consolidated.filter((c) => c.media_type === 'movie' && c.primaryRole === 'acting');
  const tvShows = consolidated.filter((c) => c.media_type === 'tv' && c.primaryRole === 'acting');
  const voice = consolidated.filter((c) => c.primaryRole === 'voice');
  const guest = consolidated.filter((c) => c.primaryRole === 'guest');
  const production = consolidated.filter((c) => c.primaryRole === 'production');

  return { movies, tvShows, voice, guest, production };
};

/**
 * Calculates a weighted "importance" score for a given credit to determine
 * how likely it is to be part of what a person is "Known For".
 *
 * This is not a simple sort. It intelligently combines multiple factors:
 * 1.  **Popularity (Logarithmic):** Uses the raw popularity score but "tames" it so that
 *     modern, hyped-up shows don't completely dominate timeless classics.
 * 2.  **Rating (Bayesian Average):** Calculates a "trustworthiness" score for the rating.
 *     A 9/10 from 50,000 votes is valued much higher than a 10/10 from 50 votes.
 * 3.  **Role Importance:** Gives a multiplier bonus for significant roles like 'Director' or lead actor.
 * 4.  **Recency:** Gives a slight bonus to more recent work, acknowledging that it's often
 *     more relevant to what someone is currently known for.
 *
 * @param {Credit} credit - The processed credit object to be scored.
 * @returns {number} A numerical score representing the credit's importance. A higher score is better.
 */
export const calculateKnownForScore = (credit: Credit): number => {
  const popularity = credit.popularity || 1;
  const rating = credit.vote_average || 0;
  const voteCount = credit.vote_count || 0;

  // A credit must have a meaningful number of votes to even be considered.
  if (voteCount < 50) {
    return 0;
  }

  // Logarithmic scaling of popularity to prevent extreme values from skewing the result.
  const popularityScore = Math.log10(popularity + 1) * 2;

  // Bayesian average calculation variables.
  const C = 7.0; // The global average rating across all media (~7.0).
  const M = 500; // The minimum number of votes required for a "trustworthy" rating.

  // This formula pulls the item's score towards the global average if it has few votes,
  // making the rating more "trusted" as the vote count increases.
  const bayesianRating = (rating * voteCount + C * M) / (voteCount + M);
  const ratingScore = bayesianRating * 1.5;

  // Apply multipliers to give extra weight to more significant roles.
  let roleMultiplier = 1.0;
  if (credit.primaryRole === 'acting') roleMultiplier = 1.5;
  if (credit.primaryRole === 'production' && credit.roles.includes('Director')) roleMultiplier = 1.4;

  // Apply a multiplier to give a slight boost to more recent work.
  const releaseYear = new Date(credit.release_date || credit.first_air_date || 0).getFullYear();
  const currentYear = new Date().getFullYear();
  const yearDiff = currentYear - releaseYear;
  // The score boost decays over 40 years, but never drops below 80% of its value.
  const recencyMultiplier = Math.max(0.8, 1 - yearDiff / 40);

  // Combine all factors into the final score.
  return (popularityScore + ratingScore) * roleMultiplier * recencyMultiplier;
};

export const calculateTotalMinutesRuntime = (media: Media) => {
  let totalMinutesRuntime = 0;
  if (media.media_type === 'movie') {
    totalMinutesRuntime = (media as Movie).runtime || 0;
  } else if (media.media_type === 'tv') {
    const show = media as TvShow;
    const totalEpisodes = show.number_of_episodes || 0;
    let runtime = 0;

    // 1. Prioritize the runtime of the last aired episode
    if (show.last_episode_to_air?.runtime) runtime = show.last_episode_to_air.runtime;
    // 2. Fallback to the first value in the general episode_run_time array
    else if (show.episode_run_time && show.episode_run_time?.length > 0) runtime = show.episode_run_time[0];
    // 3. Final fallback to a sensible default if no data is available
    else runtime = 45;

    totalMinutesRuntime = Math.round(runtime * totalEpisodes);
  }
  return totalMinutesRuntime;
};
