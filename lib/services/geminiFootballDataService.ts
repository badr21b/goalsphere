import { NormalizedMatch } from '@/lib/types/api';
import { geminiService, GeneratedContent, LiveMatchData } from './geminiService';

export interface GeminiFootballData {
  liveMatches: NormalizedMatch[];
  todaysMatches: NormalizedMatch[];
  news: GeneratedContent[];
  featuredNews: GeneratedContent;
  standings: any[];
  lastUpdated: string;
}

export class GeminiFootballDataService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for live data

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  async getLiveMatches(): Promise<NormalizedMatch[]> {
    const cacheKey = 'gemini_live_matches';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const liveScores = await geminiService.getLiveScores('soccer');
      const normalizedMatches = this.normalizeLiveMatches(liveScores.liveMatches);
      
      this.setCache(cacheKey, normalizedMatches);
      return normalizedMatches;
    } catch (error) {
      console.error('Failed to fetch live matches from Gemini:', error);
      return this.getFallbackLiveMatches();
    }
  }

  async getTodaysMatches(): Promise<NormalizedMatch[]> {
    const cacheKey = 'gemini_todays_matches';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const fixtures = await geminiService.getTodaysFixtures('soccer');
      const normalizedMatches = this.normalizeFixtures(fixtures.fixtures);
      
      this.setCache(cacheKey, normalizedMatches);
      return normalizedMatches;
    } catch (error) {
      console.error('Failed to fetch today\'s matches from Gemini:', error);
      return this.getFallbackTodaysMatches();
    }
  }

  async getNews(): Promise<GeneratedContent[]> {
    const cacheKey = 'gemini_news';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const news = await geminiService.generateBreakingNews();
      this.setCache(cacheKey, news);
      return news;
    } catch (error) {
      console.error('Failed to generate news from Gemini:', error);
      return this.getFallbackNews();
    }
  }

  async getFeaturedNews(): Promise<GeneratedContent> {
    const cacheKey = 'gemini_featured_news';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const featuredNews = await geminiService.generateNewsContent('Breaking football news');
      this.setCache(cacheKey, featuredNews);
      return featuredNews;
    } catch (error) {
      console.error('Failed to generate featured news from Gemini:', error);
      return this.getFallbackFeaturedNews();
    }
  }

  async getStandings(league: string = 'Premier League'): Promise<any[]> {
    const cacheKey = `gemini_standings_${league}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const standings = await geminiService.getLeagueStandings(league);
      this.setCache(cacheKey, standings.standings);
      return standings.standings;
    } catch (error) {
      console.error('Failed to fetch standings from Gemini:', error);
      return this.getFallbackStandings();
    }
  }

  async getAllData(): Promise<GeminiFootballData> {
    const [liveMatches, todaysMatches, news, featuredNews, standings] = await Promise.all([
      this.getLiveMatches(),
      this.getTodaysMatches(),
      this.getNews(),
      this.getFeaturedNews(),
      this.getStandings()
    ]);

    return {
      liveMatches,
      todaysMatches,
      news,
      featuredNews,
      standings,
      lastUpdated: new Date().toISOString()
    };
  }

  private normalizeLiveMatches(liveMatches: LiveMatchData[]): NormalizedMatch[] {
    return liveMatches.map(match => ({
      match_id: match.match_id,
      league: match.league,
      home_team: match.home_team,
      away_team: match.away_team,
      status: match.status,
      timestamp: match.timestamp,
      score: match.score,
      venue: match.venue,
      referee: null,
      season: new Date().getFullYear().toString(),
      matchday: null,
      competition_id: null,
      api_source: 'gemini_thesportsdb',
      raw_data: match
    }));
  }

  private normalizeFixtures(fixtures: any[]): NormalizedMatch[] {
    return fixtures.map(fixture => ({
      match_id: fixture.match_id || fixture.idEvent,
      league: fixture.league || fixture.strLeague,
      home_team: fixture.home_team || fixture.strHomeTeam,
      away_team: fixture.away_team || fixture.strAwayTeam,
      status: this.normalizeStatus(fixture.status || fixture.strStatus),
      timestamp: fixture.timestamp || fixture.dateEvent,
      score: fixture.score ? {
        home: fixture.score.home || fixture.intHomeScore,
        away: fixture.score.away || fixture.intAwayScore
      } : undefined,
      venue: fixture.venue || fixture.strVenue,
      referee: fixture.referee || fixture.strReferee,
      season: fixture.season || new Date().getFullYear().toString(),
      matchday: fixture.matchday || fixture.intRound,
      competition_id: fixture.competition_id || fixture.idLeague,
      api_source: 'gemini_thesportsdb',
      raw_data: fixture
    }));
  }

  private normalizeStatus(status: string): NormalizedMatch['status'] {
    const statusMap: { [key: string]: NormalizedMatch['status'] } = {
      'Live': 'Live',
      'LIVE': 'Live',
      'IN_PLAY': 'Live',
      'Finished': 'Finished',
      'FINISHED': 'Finished',
      'Scheduled': 'Scheduled',
      'SCHEDULED': 'Scheduled',
      'Postponed': 'Postponed',
      'POSTPONED': 'Postponed',
      'Cancelled': 'Cancelled',
      'CANCELLED': 'Cancelled'
    };
    return statusMap[status] || 'Scheduled';
  }

  // Fallback methods for when Gemini service fails
  private getFallbackLiveMatches(): NormalizedMatch[] {
    return [
      {
        match_id: 'fallback_1',
        league: 'Premier League',
        home_team: 'Arsenal',
        away_team: 'Chelsea',
        status: 'Live',
        timestamp: new Date().toISOString(),
        score: { home: 2, away: 1 },
        venue: 'Emirates Stadium',
        api_source: 'fallback',
        raw_data: {}
      }
    ];
  }

  private getFallbackTodaysMatches(): NormalizedMatch[] {
    return [
      {
        match_id: 'fallback_2',
        league: 'Premier League',
        home_team: 'Brighton',
        away_team: 'Newcastle',
        status: 'Scheduled',
        timestamp: new Date().toISOString(),
        venue: 'Amex Stadium',
        api_source: 'fallback',
        raw_data: {}
      }
    ];
  }

  private getFallbackNews(): GeneratedContent[] {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=300&fit=crop&crop=center'
    ];
    
    const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

    return [
      {
        title: 'Latest Football Updates',
        content: 'Stay tuned for the latest football news and updates.',
        summary: 'Breaking football news and updates',
        category: 'News',
        publishedAt: new Date().toISOString(),
        thumbnail: randomImage,
        tags: ['football', 'news'],
        source: 'gemini_generated'
      }
    ];
  }

  private getFallbackFeaturedNews(): GeneratedContent {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=300&fit=crop&crop=center'
    ];
    
    const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

    return {
      title: 'Featured Football News',
      content: 'Featured football news and analysis.',
      summary: 'Top football story of the day',
      category: 'Featured',
      publishedAt: new Date().toISOString(),
      thumbnail: randomImage,
      tags: ['featured', 'football'],
      source: 'gemini_generated'
    };
  }

  private getFallbackStandings(): any[] {
    return [
      {
        team_id: '1',
        team_name: 'Arsenal',
        position: 1,
        points: 30,
        played: 10,
        won: 9,
        drawn: 1,
        lost: 0,
        goals_for: 25,
        goals_against: 5,
        goal_difference: 20,
        league: 'Premier League'
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
export const geminiFootballDataService = new GeminiFootballDataService();
