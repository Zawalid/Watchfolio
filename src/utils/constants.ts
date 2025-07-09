import { MonitorPlay, Bookmark, MonitorCheck, MonitorPause, MonitorX, Heart } from 'lucide-react';

export const RATING_LABELS = {
  1: 'Terrible',
  2: 'Poor',
  3: 'Below Average',
  4: 'Disappointing',
  5: 'Average',
  6: 'Good',
  7: 'Very Good',
  8: 'Great',
  9: 'Excellent',
  10: 'Masterpiece',
} as const;

export const LIBRARY_MEDIA_STATUS = [
  {
    value: 'watching',
    label: 'Currently Watching',
    descriptions: {
      modal: 'Currently enjoying this one.',
      stats: 'In progress',
    },
    icon: MonitorPlay,
    className: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    shortcut: 'setStatusWatching',
  },
  {
    value: 'willWatch',
    label: 'Plan to Watch',
    descriptions: {
      modal: 'On your watchlist for later.',
      stats: 'Saved for later',
    },
    icon: Bookmark,
    className: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    shortcut: 'setStatusPlanToWatch',
  },
  {
    value: 'completed',
    label: 'Completed',
    descriptions: {
      modal: 'Finished watching this.',
      stats: 'Completed',
    },
    icon: MonitorCheck,
    className: 'text-green-400 bg-green-500/20 border-green-500/30',
    shortcut: 'setStatusWatched',
  },
  {
    value: 'onHold',
    label: 'On Hold',
    descriptions: {
      modal: 'Paused but planning to continue.',
      stats: 'Temporarily paused',
    },
    icon: MonitorPause,
    className: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    shortcut: 'setStatusOnHold',
  },
  {
    value: 'dropped',
    label: 'Dropped',
    descriptions: {
      modal: 'Decided not to continue watching.',
      stats: 'Abandoned',
    },
    icon: MonitorX,
    className: 'text-red-400 bg-red-500/20 border-red-500/30',
    shortcut: 'setStatusDropped',
  },
  {
    value: 'favorites',
    label: 'Favorites',
    descriptions: {
      modal: 'One of your absolute favorites.',
      stats: 'Top picks',
    },
    icon: Heart,
    className: 'text-pink-400 bg-pink-500/20 border-pink-500/30',
    shortcut: 'setStatusFavorite',
  },
] as const;

export const LIBRARY_IMPORT_MAX_SIZE = 10 * 1024 * 1024; // 10 MB
export const LIBRARY_SYNC_DELAY = 3000;

export const LOCAL_STORAGE_PREFIX = 'watchfolio-';

export const TMDB_MOVIE_CATEGORIES: Categories[] = ['popular', 'top-rated', 'now-playing', 'upcoming'];
export const TMDB_TV_CATEGORIES: Categories[] = ['popular', 'top-rated', 'airing-today', 'on-tv'];

// Popular Movie Collections - Curated list of iconic and mainstream franchises
export const POPULAR_MOVIE_COLLECTIONS = {
  // Blockbuster Franchises
  blockbusters: [
    { id: 10, name: 'Star Wars Collection' },
    { id: 1241, name: 'Harry Potter Collection' },
    { id: 9485, name: 'The Fast and the Furious Collection' },
    { id: 328, name: 'Jurassic Park Collection' },
    { id: 295, name: 'Pirates of the Caribbean Collection' },
    { id: 8650, name: 'Transformers Collection' },
    { id: 2344, name: 'The Matrix Collection' },
    { id: 84, name: 'Indiana Jones Collection' },
    { id: 264, name: 'Back to the Future Collection' },
    { id: 86055, name: 'Men in Black Collection' },
    { id: 52984, name: 'National Treasure Collection' },
    { id: 420, name: 'The Chronicles of Narnia Collection' },
    { id: 87359, name: 'Mission: Impossible Collection' },
  ],

  // Superhero Collections
  superheroes: [
    { id: 748, name: 'X-Men Collection' },
    { id: 556, name: 'Spider-Man Collection' },
    { id: 263, name: 'The Dark Knight Collection' },
    { id: 8537, name: 'Superman Collection' },
    { id: 9744, name: 'Fantastic Four Collection' },
    { id: 17235, name: 'Hellboy Collection' },
    { id: 735, name: 'Blade Collection' },
    { id: 86311, name: 'The Avengers Collection' },
    { id: 131296, name: 'Thor Collection' },
  ],

  // Classic Action
  action: [
    { id: 645, name: 'James Bond Collection' },
    { id: 528, name: 'The Terminator Collection' },
    { id: 8091, name: 'Alien Collection' },
    { id: 399, name: 'Predator Collection' },
    { id: 1570, name: 'Die Hard Collection' },
    { id: 945, name: 'Lethal Weapon Collection' },
    { id: 31562, name: 'The Bourne Collection' },
    { id: 5039, name: 'Rambo Collection' },
    { id: 8945, name: 'Mad Max Collection' },
    { id: 14890, name: 'Bad Boys Collection' },
    { id: 5547, name: 'RoboCop Collection' },
    { id: 52785, name: 'xXx Collection' },
    { id: 86029, name: "Charlie's Angels Collection" },
    { id: 2467, name: 'Tomb Raider Collection' },
  ],

  // Legendary Cinema
  classics: [
    { id: 230, name: 'The Godfather Collection' },
    { id: 119, name: 'The Lord of the Rings Collection' },
    { id: 1575, name: 'Rocky Collection' },
    { id: 304, name: "Ocean's Collection" },
    { id: 9518, name: 'The Transporter Collection' },
    { id: 1733, name: 'The Mummy Collection' },
    { id: 2366, name: 'Jaws Collection' },
    { id: 1709, name: 'Planet of the Apes (Original) Collection' },
    { id: 2883, name: 'Kill Bill Collection' },
    { id: 8580, name: 'The Karate Kid Collection' },
    { id: 121938, name: 'The Hobbit Collection' },
    { id: 151, name: 'Star Trek: The Original Series Collection' },
  ],

  // Family & Animation
  family: [
    { id: 10194, name: 'Toy Story Collection' },
    { id: 2150, name: 'Shrek Collection' },
    { id: 8354, name: 'Ice Age Collection' },
    { id: 14740, name: 'Madagascar Collection' },
    { id: 12087, name: 'Herbie Collection' },
    { id: 9888, name: 'Home Alone Collection' },
    { id: 86066, name: 'Despicable Me Collection' },
    { id: 77816, name: 'Kung Fu Panda Collection' },
    { id: 85943, name: 'Night at the Museum Collection' },
    { id: 33085, name: 'The Little Mermaid Collection' },
    { id: 11716, name: 'Addams Family Collection' },
    { id: 53159, name: 'The Santa Clause Collection' },
  ],

  // Horror Classics
  horror: [
    { id: 656, name: 'Saw Collection' },
    { id: 2602, name: 'Scream Collection' },
    { id: 8581, name: 'A Nightmare on Elm Street Collection' },
    { id: 9735, name: 'Friday the 13th Collection' },
    { id: 12263, name: 'The Exorcist Collection' },
    { id: 17255, name: 'Resident Evil Collection' },
    { id: 2326, name: 'Underworld Collection' },
    { id: 8864, name: 'Final Destination Collection' },
    { id: 1960, name: 'Evil Dead Collection' },
    { id: 10455, name: "Child's Play Collection" },
    { id: 313086, name: 'The Conjuring Collection' },
  ],

  // Comedy Favorites
  comedy: [
    { id: 1006, name: 'Austin Powers Collection' },
    { id: 52988, name: 'Hot Shots! Collection' },
    { id: 51509, name: 'Meet the Parents Collection' },
    { id: 8979, name: "Wayne's World Collection" },
    { id: 44979, name: "Big Momma's House Collection" },
    { id: 30663, name: 'Harold & Kumar Collection' },
    { id: 2980, name: 'Ghostbusters Collection' },
    { id: 85861, name: 'Beverly Hills Cop Collection' },
    { id: 86119, name: 'The Hangover Collection' },
    { id: 9338, name: 'Police Academy Collection' },
    { id: 937, name: 'The Pink Panther (Original) Collection' },
    { id: 4246, name: 'Scary Movie Collection' },
    { id: 43072, name: 'The Mask Collection' },
    { id: 86117, name: 'Johnny English Collection' },
  ],

  // Teen & Young Adult
  teen: [
    { id: 33514, name: 'The Twilight Collection' },
    { id: 2806, name: 'American Pie Collection' },
    { id: 86092, name: 'Step Up Collection' },
    { id: 86024, name: 'Legally Blonde Collection' },
    { id: 86083, name: 'Grease Collection' },
    { id: 86058, name: 'Dirty Dancing Collection' },
  ],
} as const;

// Flattened list of all popular collections for easy lookup
export const ALL_POPULAR_COLLECTIONS = Object.values(POPULAR_MOVIE_COLLECTIONS).flat();
