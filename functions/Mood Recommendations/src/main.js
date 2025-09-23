import { GoogleGenerativeAI } from '@google/generative-ai';

// Response helper functions
const createResponse = (status, data, message) => ({
  status,
  data,
  message,
  timestamp: new Date().toISOString()
});

const createErrorResponse = (status, message, error = null) => ({
  ...createResponse(status, null, message),
  error: error?.message || error
});

// Mood to genre mapping
const MOOD_MAPPINGS = {
  happy: {
    genres: [35, 10751, 16, 10402], // Comedy, Family, Animation, Music
    keywords: ['uplifting', 'feel-good', 'comedy', 'lighthearted', 'joyful'],
    avoid: ['horror', 'thriller', 'dark', 'depressing']
  },
  sad: {
    genres: [18, 10749], // Drama, Romance
    keywords: ['emotional', 'touching', 'heartfelt', 'moving', 'dramatic'],
    avoid: ['comedy', 'action', 'horror']
  },
  excited: {
    genres: [28, 12, 878, 14], // Action, Adventure, Sci-Fi, Fantasy
    keywords: ['thrilling', 'exciting', 'adventure', 'fast-paced', 'epic'],
    avoid: ['slow', 'quiet', 'contemplative']
  },
  relaxed: {
    genres: [10749, 35, 10751, 99], // Romance, Comedy, Family, Documentary
    keywords: ['calm', 'peaceful', 'slow-paced', 'comfortable', 'gentle'],
    avoid: ['intense', 'violent', 'suspense']
  },
  anxious: {
    genres: [35, 10751, 16, 10402], // Comedy, Family, Animation, Music
    keywords: ['comforting', 'familiar', 'light', 'reassuring', 'positive'],
    avoid: ['thriller', 'horror', 'suspense', 'intense']
  },
  adventurous: {
    genres: [12, 28, 14, 878], // Adventure, Action, Fantasy, Sci-Fi
    keywords: ['adventure', 'exploration', 'journey', 'discovery', 'epic'],
    avoid: ['mundane', 'realistic', 'domestic']
  },
  romantic: {
    genres: [10749, 18, 35], // Romance, Drama, Comedy
    keywords: ['romantic', 'love', 'relationships', 'heartwarming', 'emotional'],
    avoid: ['action', 'horror', 'war']
  },
  nostalgic: {
    genres: [18, 10751, 35], // Drama, Family, Comedy
    keywords: ['classic', 'retro', 'coming-of-age', 'nostalgic', 'memories'],
    avoid: ['futuristic', 'modern', 'dystopian']
  },
  curious: {
    genres: [99, 878, 9648, 80], // Documentary, Sci-Fi, Mystery, Crime
    keywords: ['mystery', 'discovery', 'learning', 'exploration', 'thought-provoking'],
    avoid: ['mindless', 'simple']
  },
  energetic: {
    genres: [28, 35, 10402, 16], // Action, Comedy, Music, Animation
    keywords: ['energetic', 'dynamic', 'vibrant', 'lively', 'upbeat'],
    avoid: ['slow', 'contemplative', 'melancholy']
  }
};

// Content analysis helper
const analyzeUserLibrary = (libraryItems) => {
  if (!libraryItems || libraryItems.length === 0) {
    return {
      favoriteGenres: [],
      averageRating: 0,
      preferredTypes: [],
      recentWatches: [],
      totalItems: 0
    };
  }

  const genreCounts = {};
  const typeCounts = { movie: 0, tv: 0 };
  const ratings = [];
  const recentItems = [];

  libraryItems.forEach(item => {
    // Count genres
    if (item.genres && Array.isArray(item.genres)) {
      item.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    }

    // Count media types
    if (item.media_type) {
      typeCounts[item.media_type]++;
    }

    // Collect ratings
    if (item.userRating && item.userRating > 0) {
      ratings.push(item.userRating);
    }

    // Recent items (completed or favorites)
    if (item.status === 'completed' || item.isFavorite) {
      recentItems.push({
        title: item.title,
        genres: item.genres || [],
        rating: item.userRating || item.rating || 0,
        type: item.media_type
      });
    }
  });

  // Sort genres by frequency
  const favoriteGenres = Object.entries(genreCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([genre]) => parseInt(genre));

  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    : 0;

  const preferredTypes = Object.entries(typeCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([type]) => type);

  return {
    favoriteGenres,
    averageRating: Math.round(averageRating * 10) / 10,
    preferredTypes,
    recentWatches: recentItems.slice(0, 10),
    totalItems: libraryItems.length
  };
};

// Generate AI prompt
const generatePrompt = (description, userAnalysis, preferences = {}, userProfile = {}, batchNumber = 1, excludeTitles = []) => {
  const profileGenres = userProfile.favoriteGenres || [];
  const profileContentPrefs = userProfile.contentPreferences || [];
  const profileNetworks = userProfile.favoriteNetworks || [];
  const profileContentType = userProfile.favoriteContentType || '';

  return `You are an expert movie and TV show curator with access to The Movie Database (TMDB). Your goal is to provide highly personalized recommendations with detailed analysis.

USER'S REQUEST: "${description}"

USER'S VIEWING PROFILE:
- Library size: ${userAnalysis.totalItems} titles
- Favorite genres (from library): ${userAnalysis.favoriteGenres.join(', ')} (TMDB genre IDs)
- Profile favorite genres: ${profileGenres.join(', ')} (TMDB genre IDs)
- Content preferences: ${profileContentPrefs.join(', ')}
- Favorite networks: ${profileNetworks.join(', ')} (TMDB network IDs)
- Preferred content type: ${profileContentType}
- Average rating: ${userAnalysis.averageRating}/10 (shows taste preference)
- Recent activity: ${userAnalysis.preferredTypes.join(', ')}
- Recent favorites: ${userAnalysis.recentWatches.slice(0, 3).map(item => item.title).join(', ')}

FILTERING PREFERENCES:
- Content type: ${preferences.contentType || 'movies and TV shows'}
- Era preference: ${preferences.decade || 'any time period'}
- Runtime preference: ${preferences.duration || 'any length'}

BATCH CONTEXT:
- This is batch ${batchNumber} of recommendations
- Previous recommendations to AVOID: ${excludeTitles.length > 0 ? excludeTitles.join(', ') : 'None yet'}

TASK:
Provide exactly 5 highly curated recommendations that match "${description}". For each recommendation, provide:

1. Exact movie/TV show title (as it appears in TMDB)
2. Release year
3. Content type (movie or tv)
4. Detailed analysis (3-4 sentences explaining the match)
5. Specific mood alignment explanation

CRITICAL OUTPUT REQUIREMENTS:
- MUST respond with ONLY a valid JSON array
- NO explanatory text before or after the JSON
- NO markdown code blocks or formatting
- JUST the raw JSON array

FORMAT (respond with exactly this structure):
[
  {
    "title": "Exact Title as in TMDB",
    "year": 2023,
    "type": "movie",
    "detailed_analysis": "Comprehensive 3-4 sentence explanation covering: why this matches their request, how it aligns with their viewing history, what specific elements make it perfect for their current mood, and what they can expect from the experience.",
    "mood_alignment": "Specific explanation of how this title delivers exactly what they're looking for based on '${description}'"
  }
]

CRITICAL REQUIREMENTS:
- Use EXACT titles as they appear in The Movie Database (TMDB)
- Provide accurate release years
- Make detailed_analysis substantive and personalized
- Consider their viewing history patterns
- Balance popular titles with hidden gems
- Ensure variety in genres, eras, and styles
- Match the specific mood/request: "${description}"
- DO NOT include TMDB IDs or IMDB IDs (we will look these up separately)
- RESPOND WITH ONLY THE JSON ARRAY - NO OTHER TEXT

Remember: Quality over quantity. Each recommendation should feel hand-picked for this specific user and request.`;
};

// Main function
export default async ({ req, res, log, error }) => {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return res.json(createErrorResponse(405, 'Method not allowed. Use POST.'), 405);
    }

    // Parse request body
    let body;
    try {
      body = JSON.parse(req.body || '{}');
    } catch (parseError) {
      log('Error parsing request body:', parseError);
      return res.json(createErrorResponse(400, 'Invalid JSON in request body'), 400);
    }

    // Validate required fields
    const { description, userLibrary = [], preferences = {}, userProfile = {}, batchNumber = 1, excludeTitles = [] } = body;

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.json(createErrorResponse(400, 'Description is required and must be a non-empty string'), 400);
    }

    // Get Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      error('GEMINI_API_KEY environment variable is not set');
      return res.json(createErrorResponse(500, 'AI service configuration error'), 500);
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 32,
        topP: 0.9,
        maxOutputTokens: 4096,
      }
    });

    // Analyze user's library
    const userAnalysis = analyzeUserLibrary(userLibrary);
    log('User analysis completed:', {
      totalItems: userAnalysis.totalItems,
      favoriteGenres: userAnalysis.favoriteGenres.slice(0, 3),
      averageRating: userAnalysis.averageRating
    });

    // Generate prompt and get AI recommendations
    const prompt = generatePrompt(description, userAnalysis, preferences, userProfile, batchNumber, excludeTitles);

    log('Requesting recommendations for description:', description);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let recommendations;

    try {
      // Extract JSON from the response
      const text = response.text();
      log('AI response received, length:', text.length);
      log('AI response preview:', text.substring(0, 500) + '...');

      // Multiple strategies to extract JSON
      let jsonString = null;

      // Strategy 1: Look for JSON array with enhanced regex
      let jsonMatch = text.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
        log('Found JSON using strategy 1 (basic array match)');
      }

      // Strategy 2: Look for JSON between ```json blocks
      if (!jsonString) {
        jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1].trim();
          log('Found JSON using strategy 2 (code block)');
        }
      }

      // Strategy 3: Look for JSON between ``` blocks (without json)
      if (!jsonString) {
        jsonMatch = text.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          const content = jsonMatch[1].trim();
          if (content.startsWith('[') && content.endsWith(']')) {
            jsonString = content;
            log('Found JSON using strategy 3 (generic code block)');
          }
        }
      }

      // Strategy 4: Look for anything that starts with [ and ends with ]
      if (!jsonString) {
        const startIndex = text.indexOf('[');
        const endIndex = text.lastIndexOf(']');
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          jsonString = text.substring(startIndex, endIndex + 1);
          log('Found JSON using strategy 4 (manual extraction)');
        }
      }

      if (!jsonString) {
        log('Full AI response:', text);
        throw new Error('No JSON array found in AI response using any strategy');
      }

      log('Attempting to parse JSON:', jsonString.substring(0, 200) + '...');
      recommendations = JSON.parse(jsonString);

      if (!Array.isArray(recommendations)) {
        throw new Error('AI response is not an array');
      }

      // Validate recommendation structure (no tmdb_id expected)
      recommendations = recommendations.filter(rec =>
        rec &&
        typeof rec === 'object' &&
        rec.title &&
        rec.year &&
        rec.detailed_analysis &&
        rec.mood_alignment &&
        rec.type
      );

      if (recommendations.length === 0) {
        throw new Error('No valid recommendations found in AI response');
      }

    } catch (parseError) {
      log('Error parsing AI response:', parseError);
      error('Failed to parse AI recommendations:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // Add metadata
    const responseData = {
      recommendations,
      description,
      total: recommendations.length,
      userAnalysis: {
        totalLibraryItems: userAnalysis.totalItems,
        favoriteGenres: userAnalysis.favoriteGenres.slice(0, 3),
        averageRating: userAnalysis.averageRating,
        preferredDecades: [],
        contentTypePreference: userAnalysis.preferredTypes[0] || 'balanced'
      },
      generatedAt: new Date().toISOString()
    };

    log('Successfully generated recommendations:', {
      description: description.substring(0, 50) + '...',
      count: recommendations.length,
      userLibrarySize: userAnalysis.totalItems
    });

    return res.json(createResponse(200, responseData, 'Recommendations generated successfully'));

  } catch (err) {
    error('Unexpected error in mood recommendations function:', err);
    return res.json(createErrorResponse(500, 'Internal server error', err), 500);
  }
};