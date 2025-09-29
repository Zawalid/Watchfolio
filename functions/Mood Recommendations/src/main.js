import { GoogleGenerativeAI } from '@google/generative-ai';

// Response helper functions
const createResponse = (status, data, message) => ({
  status,
  data,
  message,
  timestamp: new Date().toISOString(),
});

const createErrorResponse = (status, message, error = null) => ({
  ...createResponse(status, null, message),
  error: error?.message || error,
});

// Generate AI prompt
const generatePrompt = (body) => {
  return `You are an expert movie and TV show curator with access to The Movie Database (TMDB). Your goal is to provide highly personalized recommendations with detailed analysis

  Recommend 10 movies and TV shows that match the user request: "${body.description}"
  
  For each recommendation, provide:
1. Exact movie/TV show title
2. Release year
3. Content type (movie or tv)
4. Detailed analysis (3-4 sentences explaining the match)
5. Specific mood alignment explanation

FILTERING PREFERENCES:
- Content type: ${body.preferences.contentType || 'movies and TV shows'}
- Era preference: ${body.preferences.decade || 'any time period'}
- Runtime preference: ${body.preferences.duration || 'any length'}

CRITICAL OUTPUT REQUIREMENTS:
- MUST respond with ONLY a valid JSON array
- NO explanatory text before or after the JSON
- NO markdown code blocks or formatting
- JUST the raw JSON array

USER'S VIEWING PROFILE:
- Profile favorite genres: ${body.userProfile.favoriteGenres}
- Content preferences: ${body.userProfile.contentPreferences}
- Preferred content type: ${body.userProfile.favoriteContentType}
- Recent favorites: ${body.userProfile.recentWatches}


Respond with ONLY this JSON:
[
  {
    "title": "Movie Title",
    "year": 2023,
    "type": "movie", // or "tv"
    "detailed_analysis": "Why this matches the request",
    "mood_alignment": "How it fits '${body.description}'"
  }
]

No other text.`;
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

    const description = body.description;

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
      model: 'gemini-2.5-flash',
    });

    // Generate prompt and get AI recommendations
    const prompt = generatePrompt(body);

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
      recommendations = recommendations.filter(
        (rec) =>
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
      generatedAt: new Date().toISOString(),
    };

    log('Successfully generated recommendations:', {
      description: description.substring(0, 50) + '...',
      count: recommendations.length,
    });

    return res.json(createResponse(200, responseData, 'Recommendations generated successfully'));
  } catch (err) {
    error('Unexpected error in mood recommendations function:', err);
    return res.json(createErrorResponse(500, 'Internal server error', err), 500);
  }
};
