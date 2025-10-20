import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ApiFootballConfig {
  apiKey: string;
  baseUrl?: string;
  geminiApiKey?: string;
}

export interface FootballMatch {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number | null;
      second: number | null;
    };
    venue: {
      id: number;
      name: string;
      city: string;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface LeagueStanding {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string | null;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  home: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  away: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
}

export interface Team {
  team: {
    id: number;
    name: string;
    code: string | null;
    country: string;
    founded: number | null;
    national: boolean;
    logo: string;
  };
  venue: {
    id: number;
    name: string;
    address: string | null;
    city: string;
    capacity: number;
    surface: string;
    image: string;
  };
}

export interface NewsArticle {
  title: string;
  content: string;
  summary: string;
  category: string;
  publishedAt: string;
  thumbnail: string;
  tags: string[];
  source: string;
}

export class ApiFootballService {
  private config: ApiFootballConfig;
  private geminiAI: GoogleGenerativeAI | null = null;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

  constructor(config: ApiFootballConfig) {
    this.config = {
      baseUrl: 'https://v3.football.api-sports.io',
      ...config
    };

    // Initialize Gemini AI if API key is provided
    if (config.geminiApiKey) {
      try {
        this.geminiAI = new GoogleGenerativeAI(config.geminiApiKey);
      } catch (error) {
        console.warn('Failed to initialize Gemini AI:', error);
      }
    }
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    const url = new URL(`${this.config.baseUrl}${endpoint}`);
    
    // Add API key to headers
    const headers = {
      'X-RapidAPI-Key': this.config.apiKey,
      'X-RapidAPI-Host': 'v3.football.api-sports.io'
    };

    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString(), { headers });
      
      if (!response.ok) {
        throw new Error(`API-Football error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API-Football request failed:', error);
      throw error;
    }
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    // Reduce cache duration for development
    return Date.now() - cached.timestamp < 30000; // 30 seconds for development
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private updateDatesToCurrent(matches: any[]): any[] {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    return matches.map(match => {
      const originalDate = new Date(match.fixture.date);
      const updatedDate = new Date(originalDate);
      updatedDate.setFullYear(currentYear);
      
      return {
        ...match,
        fixture: {
          ...match.fixture,
          date: updatedDate.toISOString(),
          timestamp: Math.floor(updatedDate.getTime() / 1000)
        },
        league: {
          ...match.league,
          season: currentYear
        }
      };
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  async getLiveMatches(leagueId?: number): Promise<FootballMatch[]> {
    const cacheKey = leagueId ? `live_matches_${leagueId}` : 'live_matches';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const params: Record<string, any> = {
        live: 'all',
        timezone: 'Europe/London',
        season: 2023
      };
      
      if (leagueId) {
        params.league = leagueId;
      }

      const data = await this.makeRequest('/fixtures', params);

      const matches = data.response || [];
      const updatedMatches = this.updateDatesToCurrent(matches);
      this.setCache(cacheKey, updatedMatches);
      return updatedMatches;
    } catch (error) {
      console.error('Failed to fetch live matches:', error);
      return [];
    }
  }

  async getTodaysMatches(leagueId?: number): Promise<FootballMatch[]> {
    const cacheKey = leagueId ? `todays_matches_${leagueId}` : 'todays_matches';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      // Use a date range instead of specific date to get matches
      const params: Record<string, any> = {
        from: '2023-12-09',
        to: '2023-12-09',
        timezone: 'Europe/London',
        season: 2023
      };
      
      if (leagueId) {
        params.league = leagueId;
      }

      const data = await this.makeRequest('/fixtures', params);

      const matches = data.response || [];
      const updatedMatches = this.updateDatesToCurrent(matches);
      this.setCache(cacheKey, updatedMatches);
      return updatedMatches;
    } catch (error) {
      console.error('Failed to fetch today\'s matches:', error);
      return [];
    }
  }

  async getMatchesByDateRange(leagueId: number, from: string, to: string): Promise<FootballMatch[]> {
    const cacheKey = `matches_${leagueId}_${from}_${to}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const params: Record<string, any> = {
        from: from,
        to: to,
        timezone: 'Europe/London',
        league: leagueId,
        season: 2023
      };

      console.log('🔍 API-Football request params:', params);
      const data = await this.makeRequest('/fixtures', params);
      console.log('🔍 API-Football response:', { results: data.results, responseLength: data.response?.length });

      const matches = data.response || [];
      const updatedMatches = this.updateDatesToCurrent(matches);
      this.setCache(cacheKey, updatedMatches);
      return updatedMatches;
    } catch (error) {
      console.error('Failed to fetch matches by date range:', error);
      return [];
    }
  }

  async getLeagueStandings(leagueId: number, season: number = new Date().getFullYear()): Promise<LeagueStanding[]> {
    const cacheKey = `standings_${leagueId}_${season}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const data = await this.makeRequest('/standings', {
        league: leagueId,
        season: season
      });

      const standings = data.response?.[0]?.league?.standings?.[0] || [];
      this.setCache(cacheKey, standings);
      return standings;
    } catch (error) {
      console.error('Failed to fetch league standings:', error);
      return [];
    }
  }

  async getTeamsByLeague(leagueId: number, season: number = new Date().getFullYear()): Promise<Team[]> {
    const cacheKey = `teams_${leagueId}_${season}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const data = await this.makeRequest('/teams', {
        league: leagueId,
        season: season
      });

      const teams = data.response || [];
      this.setCache(cacheKey, teams);
      return teams;
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      return [];
    }
  }

  async getMatchDetails(fixtureId: number): Promise<FootballMatch | null> {
    const cacheKey = `match_${fixtureId}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const data = await this.makeRequest('/fixtures', {
        id: fixtureId
      });

      const match = data.response?.[0] || null;
      if (match) {
        this.setCache(cacheKey, match);
      }
      return match;
    } catch (error) {
      console.error('Failed to fetch match details:', error);
      return null;
    }
  }

  async generateNewsWithGemini(matches: FootballMatch[]): Promise<NewsArticle[]> {
    if (!this.geminiAI || matches.length === 0) {
      return this.getFallbackNews();
    }

    try {
      const model = this.geminiAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const matchSummaries = matches.slice(0, 5).map(match => ({
        homeTeam: match.teams.home.name,
        awayTeam: match.teams.away.name,
        score: `${match.goals.home || 0}-${match.goals.away || 0}`,
        status: match.fixture.status.long,
        league: match.league.name,
        venue: match.fixture.venue.name
      }));

      const prompt = `Generate 3 engaging football news articles based on these recent matches:

${JSON.stringify(matchSummaries, null, 2)}

Create articles with:
- Compelling headlines
- Detailed content (at least 200 words each)
- Brief summaries
- Relevant categories (Match Report, Analysis, Transfer News, etc.)
- Appropriate tags
- Realistic publication times

Return as JSON array:
[
  {
    "title": "string",
    "content": "string",
    "summary": "string",
    "category": "string",
    "publishedAt": "ISO string",
    "thumbnail": "string (unsplash image URL)",
    "tags": ["string"],
    "source": "gemini_generated"
  }
]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const articles = JSON.parse(text);
      return Array.isArray(articles) ? articles : [articles];
    } catch (error) {
      console.error('Failed to generate news with Gemini:', error);
      return this.getFallbackNews();
    }
  }

  async getNews(leagueId?: number): Promise<NewsArticle[]> {
    const cacheKey = leagueId ? `news_${leagueId}` : 'news';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      // Get recent matches for the league to generate news
      const [liveMatches, todaysMatches] = await Promise.all([
        this.getLiveMatches(leagueId),
        this.getTodaysMatches(leagueId)
      ]);

      const allMatches = [...liveMatches, ...todaysMatches];
      const news = await this.generateNewsWithGemini(allMatches);
      
      this.setCache(cacheKey, news);
      return news;
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return this.getFallbackNews();
    }
  }

  async getAllData(): Promise<{
    liveMatches: FootballMatch[];
    todaysMatches: FootballMatch[];
    standings: LeagueStanding[];
    news: NewsArticle[];
    lastUpdated: string;
  }> {
    const [liveMatches, todaysMatches, standings, news] = await Promise.all([
      this.getLiveMatches(),
      this.getTodaysMatches(),
      this.getLeagueStandings(39), // Premier League
      this.generateNewsWithGemini([]) // Will generate general news
    ]);

    return {
      liveMatches,
      todaysMatches,
      standings,
      news,
      lastUpdated: new Date().toISOString()
    };
  }

  private getFallbackNews(): NewsArticle[] {
    return [
      {
        title: 'Premier League: Latest Updates and Analysis',
        content: 'Stay updated with the latest Premier League news, match reports, and analysis. Our comprehensive coverage brings you all the important developments from the world\'s most competitive football league.',
        summary: 'Latest Premier League news and analysis',
        category: 'News',
        publishedAt: new Date().toISOString(),
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        tags: ['premier-league', 'football', 'news'],
        source: 'api_football'
      }
    ];
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        age: Date.now() - value.timestamp,
        isValid: this.isCacheValid(key)
      }))
    };
  }
}

// Export singleton instance
export const apiFootballService = new ApiFootballService({
  apiKey: 'f59b93fa7e47c789f104002ef9957290',
  geminiApiKey: process.env.GEMINI_API_KEY || 'AIzaSyAYa0GQvGmLaIjMHqZrvheiCApZnVnnO2I'
});
