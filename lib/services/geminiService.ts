import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export interface SportsDataRequest {
  type: 'live_scores' | 'news' | 'standings' | 'fixtures' | 'teams' | 'leagues';
  league?: string;
  team?: string;
  date?: string;
  limit?: number;
}

export interface GeneratedContent {
  title: string;
  content: string;
  summary: string;
  category: string;
  publishedAt: string;
  thumbnail?: string;
  tags: string[];
  source: 'gemini_generated';
}

export interface BestNewsRequest {
  category: string;
  newsItems: Array<{
    title: string;
    description: string;
    image: string;
    publishedAt: string;
    league: {
      name: string;
      country: string;
    };
  }>;
}

export interface LiveMatchData {
  match_id: string;
  home_team: string;
  away_team: string;
  score: {
    home: number;
    away: number;
  };
  status: 'Live' | 'Finished' | 'Scheduled';
  league: string;
  venue: string;
  timestamp: string;
  minute?: number;
  events?: Array<{
    type: 'goal' | 'card' | 'substitution';
    player: string;
    minute: number;
    team: 'home' | 'away';
  }>;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(config: GeminiConfig) {
    if (!config.apiKey) {
      throw new Error('Gemini API key is required');
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(config.apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: config.model || 'gemini-2.5-flash' 
      });
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
      throw new Error('Failed to initialize Gemini service');
    }
  }

  /**
   * Fetch data from TheSportsDB and process it with Gemini
   */
  async fetchAndProcessSportsData(request: SportsDataRequest): Promise<any> {
    try {
      // First, get raw data from TheSportsDB
      const rawData = await this.fetchFromTheSportsDB(request);
      
      // Process the data with Gemini
      const processedData = await this.processWithGemini(rawData, request);
      
      return processedData;
    } catch (error) {
      console.error('Error fetching and processing sports data:', error);
      throw error;
    }
  }

  /**
   * Fetch raw data from TheSportsDB API
   */
  private async fetchFromTheSportsDB(request: SportsDataRequest): Promise<any> {
    const baseUrl = 'https://www.thesportsdb.com/api/v1/json/123'; // Using free API key
    
    let endpoint = '';
    let params = new URLSearchParams();

    switch (request.type) {
      case 'live_scores':
        endpoint = '/livescore.php';
        if (request.league) {
          params.append('s', request.league);
        }
        break;
      case 'fixtures':
        endpoint = '/eventsday.php';
        if (request.date) {
          params.append('d', request.date);
        } else {
          params.append('d', new Date().toISOString().split('T')[0]);
        }
        break;
      case 'teams':
        endpoint = '/searchteams.php';
        if (request.team) {
          params.append('t', request.team);
        }
        break;
      case 'leagues':
        endpoint = '/all_leagues.php';
        break;
      case 'standings':
        endpoint = '/lookuptable.php';
        if (request.league) {
          params.append('l', request.league);
        }
        break;
      default:
        throw new Error(`Unsupported request type: ${request.type}`);
    }

    const url = `${baseUrl}${endpoint}?${params.toString()}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`TheSportsDB API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching from TheSportsDB:', error);
      // Return mock data if API fails
      return this.getMockTheSportsDBData(request);
    }
  }

  /**
   * Process raw data with Gemini AI
   */
  private async processWithGemini(rawData: any, request: SportsDataRequest): Promise<any> {
    const prompt = this.buildProcessingPrompt(rawData, request);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response from Gemini
      const parsedData = JSON.parse(text);
      return parsedData;
    } catch (error) {
      console.error('Error processing with Gemini:', error);
      
      // Check if it's an API key error
      if (error instanceof Error && error.message.includes('API key')) {
        console.warn('Gemini API key error, using fallback processing');
      }
      
      // Fallback to basic processing
      return this.basicDataProcessing(rawData, request);
    }
  }

  /**
   * Build processing prompt for Gemini
   */
  private buildProcessingPrompt(rawData: any, request: SportsDataRequest): string {
    const currentDate = new Date().toISOString();
    
    let prompt = `You are a sports data expert. Process the following raw data from TheSportsDB API and return a JSON response that matches our application's schema.

Raw Data:
${JSON.stringify(rawData, null, 2)}

Request Type: ${request.type}
Current Date: ${currentDate}

Please process this data and return a JSON object with the following structure based on the request type:

`;

    switch (request.type) {
      case 'live_scores':
        prompt += `{
  "liveMatches": [
    {
      "match_id": "string",
      "home_team": "string",
      "away_team": "string",
      "score": { "home": number, "away": number },
      "status": "Live" | "Finished" | "Scheduled",
      "league": "string",
      "venue": "string",
      "timestamp": "ISO string",
      "minute": number (if live),
      "events": [
        {
          "type": "goal" | "card" | "substitution",
          "player": "string",
          "minute": number,
          "team": "home" | "away"
        }
      ]
    }
  ],
  "lastUpdated": "ISO string"
}`;
        break;
      case 'news':
        prompt += `{
  "articles": [
    {
      "id": "string",
      "title": "string",
      "content": "string (detailed article content)",
      "summary": "string (brief summary)",
      "category": "string",
      "publishedAt": "ISO string",
      "thumbnail": "string (image URL)",
      "tags": ["string"],
      "source": "gemini_generated"
    }
  ],
  "featuredArticle": {
    "id": "string",
    "title": "string",
    "content": "string",
    "summary": "string",
    "category": "string",
    "publishedAt": "ISO string",
    "image": "string",
    "tags": ["string"],
    "source": "gemini_generated"
  }
}`;
        break;
      case 'standings':
        prompt += `{
  "standings": [
    {
      "team_id": "string",
      "team_name": "string",
      "position": number,
      "points": number,
      "played": number,
      "won": number,
      "drawn": number,
      "lost": number,
      "goals_for": number,
      "goals_against": number,
      "goal_difference": number,
      "league": "string"
    }
  ],
  "lastUpdated": "ISO string"
}`;
        break;
      case 'fixtures':
        prompt += `{
  "fixtures": [
    {
      "match_id": "string",
      "home_team": "string",
      "away_team": "string",
      "status": "Scheduled" | "Live" | "Finished",
      "league": "string",
      "venue": "string",
      "timestamp": "ISO string",
      "referee": "string"
    }
  ],
  "lastUpdated": "ISO string"
}`;
        break;
    }

    prompt += `

Instructions:
1. Extract relevant information from the raw data
2. Normalize team names, league names, and other data
3. Generate realistic and engaging content for news articles
4. Ensure all timestamps are in ISO format
5. Add realistic details like venues, referees, and match events
6. For news articles, create compelling headlines and detailed content
7. Return ONLY the JSON object, no additional text or formatting

Current time context: ${new Date().toLocaleString()}`;

    return prompt;
  }

  /**
   * Generate news content using Gemini
   */
  async generateNewsContent(topic: string, context?: any): Promise<GeneratedContent> {
    const prompt = `Generate a comprehensive football news article about: ${topic}

Context: ${context ? JSON.stringify(context) : 'General football news'}

Create a detailed, engaging article with:
- Compelling headline
- Detailed content (at least 300 words)
- Brief summary
- Relevant category
- Appropriate tags
- Realistic publication time

Return as JSON:
{
  "title": "string",
  "content": "string",
  "summary": "string", 
  "category": "string",
  "publishedAt": "ISO string",
  "thumbnail": "string (unsplash image URL)",
  "tags": ["string"],
  "source": "gemini_generated"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('Error generating news content:', error);
      return this.getFallbackNewsContent(topic);
    }
  }

  /**
   * Get live scores with AI enhancement
   */
  async getLiveScores(league?: string): Promise<{ liveMatches: LiveMatchData[]; lastUpdated: string }> {
    const request: SportsDataRequest = {
      type: 'live_scores',
      league: league || 'soccer'
    };

    const data = await this.fetchAndProcessSportsData(request);
    return {
      liveMatches: data.liveMatches || [],
      lastUpdated: data.lastUpdated || new Date().toISOString()
    };
  }

  /**
   * Get today's fixtures
   */
  async getTodaysFixtures(league?: string): Promise<{ fixtures: any[]; lastUpdated: string }> {
    const request: SportsDataRequest = {
      type: 'fixtures',
      date: new Date().toISOString().split('T')[0],
      league
    };

    const data = await this.fetchAndProcessSportsData(request);
    return {
      fixtures: data.fixtures || [],
      lastUpdated: data.lastUpdated || new Date().toISOString()
    };
  }

  /**
   * Get league standings
   */
  async getLeagueStandings(league: string): Promise<{ standings: any[]; lastUpdated: string }> {
    const request: SportsDataRequest = {
      type: 'standings',
      league
    };

    const data = await this.fetchAndProcessSportsData(request);
    return {
      standings: data.standings || [],
      lastUpdated: data.lastUpdated || new Date().toISOString()
    };
  }

  /**
   * Generate breaking news
   */
  async generateBreakingNews(): Promise<GeneratedContent[]> {
    const topics = [
      'Premier League transfer news',
      'Champions League latest updates',
      'Major football injuries and returns',
      'Manager changes and rumors',
      'International football news'
    ];

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const news = await this.generateNewsContent(randomTopic);
    return [news];
  }

  /**
   * Basic data processing fallback
   */
  private basicDataProcessing(rawData: any, request: SportsDataRequest): any {
    // Basic processing without AI enhancement
    switch (request.type) {
      case 'live_scores':
        const liveMatches = (rawData.events || []).map((event: any) => ({
          match_id: event.idEvent || event.id,
          home_team: event.strHomeTeam || event.homeTeam,
          away_team: event.strAwayTeam || event.awayTeam,
          score: {
            home: parseInt(event.intHomeScore) || 0,
            away: parseInt(event.intAwayScore) || 0
          },
          status: event.strStatus === 'Live' ? 'Live' : 'Finished',
          league: event.strLeague || 'Unknown League',
          venue: event.strVenue || 'Unknown Venue',
          timestamp: event.dateEvent || new Date().toISOString()
        }));
        return {
          liveMatches,
          lastUpdated: new Date().toISOString()
        };
      case 'fixtures':
        const fixtures = (rawData.events || []).map((event: any) => ({
          match_id: event.idEvent || event.id,
          home_team: event.strHomeTeam || event.homeTeam,
          away_team: event.strAwayTeam || event.awayTeam,
          status: 'Scheduled',
          league: event.strLeague || 'Unknown League',
          venue: event.strVenue || 'Unknown Venue',
          timestamp: event.dateEvent || new Date().toISOString()
        }));
        return {
          fixtures,
          lastUpdated: new Date().toISOString()
        };
      case 'standings':
        const standings = (rawData.table || []).map((team: any, index: number) => ({
          team_id: team.idTeam || index + 1,
          team_name: team.strTeam || `Team ${index + 1}`,
          position: team.intRank || index + 1,
          points: parseInt(team.intPoints) || 0,
          played: parseInt(team.intPlayed) || 0,
          won: parseInt(team.intWin) || 0,
          drawn: parseInt(team.intDraw) || 0,
          lost: parseInt(team.intLoss) || 0,
          goals_for: parseInt(team.intGoalsFor) || 0,
          goals_against: parseInt(team.intGoalsAgainst) || 0,
          goal_difference: parseInt(team.intGoalDifference) || 0,
          league: 'Premier League'
        }));
        return {
          standings,
          lastUpdated: new Date().toISOString()
        };
      default:
        return rawData;
    }
  }

  /**
   * Mock data for TheSportsDB when API fails
   */
  private getMockTheSportsDBData(request: SportsDataRequest): any {
    switch (request.type) {
      case 'live_scores':
        return {
          events: [
            {
              idEvent: '1',
              strEvent: 'Arsenal vs Chelsea',
              strHomeTeam: 'Arsenal',
              strAwayTeam: 'Chelsea',
              intHomeScore: '2',
              intAwayScore: '1',
              strStatus: 'Live',
              strLeague: 'Premier League',
              strVenue: 'Emirates Stadium',
              dateEvent: new Date().toISOString().split('T')[0],
              strTime: new Date().toTimeString().split(' ')[0]
            }
          ]
        };
      case 'fixtures':
        return {
          events: [
            {
              idEvent: '2',
              strEvent: 'Brighton vs Newcastle',
              strHomeTeam: 'Brighton',
              strAwayTeam: 'Newcastle',
              strStatus: 'Scheduled',
              strLeague: 'Premier League',
              strVenue: 'Amex Stadium',
              dateEvent: new Date().toISOString().split('T')[0],
              strTime: '15:00:00'
            }
          ]
        };
      default:
        return { events: [] };
    }
  }

  /**
   * Fallback news content
   */
  private getFallbackNewsContent(topic: string): GeneratedContent {
    return {
      title: `Latest updates on ${topic}`,
      content: `Stay tuned for the latest developments in ${topic}. We're working to bring you the most up-to-date information.`,
      summary: `Breaking news and updates about ${topic}`,
      category: 'News',
      publishedAt: new Date().toISOString(),
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      tags: [topic.toLowerCase()],
      source: 'gemini_generated'
    };
  }

  /**
   * Generate best news from a list of news items
   */
  async generateBestNews(request: BestNewsRequest): Promise<GeneratedContent | null> {
    try {
      if (!request.newsItems || request.newsItems.length === 0) {
        return null;
      }

      const newsList = request.newsItems.map(item =>
        `Title: ${item.title}\nDescription: ${item.description}\nLeague: ${item.league.name} (${item.league.country})\nImage: ${item.image}\nPublished: ${item.publishedAt}`
      ).join('\n\n---\n\n');

      const prompt = `
        You are an expert football journalist. Analyze the following recent news articles related to the category "${request.category}" and identify the single most important, impactful, or interesting news story.

        Based on the selected best news story, rewrite it in a concise, engaging, and professional tone suitable for a "featured news" section on a sports website. The rewritten news should be around 100-150 words.

        Focus on the core information, highlight its significance, and make it compelling for a reader.

        Here are the news articles to consider:
        ${newsList}

        Please provide the output in a JSON format with the following structure. Ensure the 'image' field uses the URL from the *original* best news item you selected. The 'category' should be derived from the original news item's league name, formatted as a slug (e.g., "premier-league").

        {
          "title": "Rewritten headline of the best news",
          "content": "Rewritten content of the best news (around 100-150 words)",
          "summary": "A short summary of the rewritten content (around 30-50 words)",
          "category": "slug-of-original-news-league",
          "publishedAt": "ISO string of original news published date",
          "thumbnail": "URL of the image from the original best news item",
          "tags": ["important", "featured", "football"],
          "source": "gemini_generated"
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to coerce JSON if the model wrapped it in code fences or extra prose
      let parsedContent: any | null = null;
      try {
        // Remove markdown code fences if present
        const withoutFences = text
          .replace(/```json[\s\S]*?\n/, '```')
          .replace(/```/g, '')
          .trim();
        const jsonSliceMatch = withoutFences.match(/\{[\s\S]*\}/);
        const jsonCandidate = jsonSliceMatch ? jsonSliceMatch[0] : withoutFences;
        parsedContent = JSON.parse(jsonCandidate);
      } catch {}

      try {
        if (parsedContent.title && parsedContent.content && parsedContent.summary && parsedContent.thumbnail) {
          return {
            ...parsedContent,
            source: 'gemini_generated',
            publishedAt: parsedContent.publishedAt || new Date().toISOString(),
            tags: parsedContent.tags || [],
          };
        }
      } catch (jsonError) {
        console.warn('Gemini response for best news was not valid JSON, attempting to extract text:', jsonError);
      }

      // Fallback if not JSON or invalid JSON
      return {
        title: `Featured News for ${request.category}`,
        content: text,
        summary: text.substring(0, 150) + '...',
        category: request.category,
        publishedAt: new Date().toISOString(),
        tags: ['gemini', 'featured'],
        source: 'gemini_generated',
        thumbnail: request.newsItems[0]?.image || '/images/placeholder-news.jpg',
      };

    } catch (error) {
      console.error('Error generating best news with Gemini:', error);
      return null;
    }
  }

  /**
   * Generate best news for multiple categories in one request to reduce latency
   */
  async generateBestNewsBatch(requests: BestNewsRequest[]): Promise<Record<string, GeneratedContent | null>> {
    const results: Record<string, GeneratedContent | null> = {}
    try {
      // Compose one batched prompt with clear separators
      const parts = requests.map((req, idx) => {
        const list = req.newsItems.map(item => `- ${item.title} | ${item.league.name} | ${item.publishedAt}\n${item.description}` ).join('\n')
        return `SECTION ${idx + 1} - CATEGORY: ${req.category.toUpperCase()}\n${list}`
      }).join('\n\n')

      const prompt = `You are an expert football editor. For each section below, pick exactly ONE most important story and rewrite it (100-150 words).\n\n${parts}\n\nReturn STRICT JSON as an array where each entry matches the input order:\n[{"category":"<slug>","title":"...","content":"...","summary":"...","thumbnail":"<image-url>","publishedAt":"<iso>","tags":["featured"],"source":"gemini_generated"}]`;

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Coerce JSON like above
      let parsed: any[] | null = null
      try {
        const cleaned = text.replace(/```json[\s\S]*?\n/, '```').replace(/```/g, '').trim()
        const arrayMatch = cleaned.match(/\[[\s\S]*\]/)
        const candidate = arrayMatch ? arrayMatch[0] : cleaned
        parsed = JSON.parse(candidate)
      } catch {}

      if (Array.isArray(parsed)) {
        parsed.forEach((item: any) => {
          if (item && item.category) {
            results[item.category] = {
              ...item,
              publishedAt: item.publishedAt || new Date().toISOString(),
              source: 'gemini_generated',
              tags: item.tags || []
            }
          }
        })
      }
    } catch (e) {
      console.error('Error in generateBestNewsBatch', e)
    }
    return results
  }
}

// Export singleton instance
export const geminiService = new GeminiService({
  apiKey: process.env.GEMINI_API_KEY || 'AIzaSyAYa0GQvGmLaIjMHqZrvheiCApZnVnnO2I' // Fallback to your key
});
