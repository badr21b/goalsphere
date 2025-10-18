import { FootballApiConfig, NormalizedMatch, ApiTestResult } from '@/lib/types/api'
import { testFootballApis } from './apiTestService'

export interface FootballData {
  liveMatches: NormalizedMatch[]
  todaysMatches: NormalizedMatch[]
  news: any[]
  featuredNews: any
  lastUpdated: string
}

export class FootballDataService {
  private config: FootballApiConfig | null = null
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.loadConfig()
  }

  private async loadConfig() {
    try {
      const response = await fetch('/football_apis_config.json')
      if (response.ok) {
        this.config = await response.json()
      }
    } catch (error) {
      console.error('Failed to load football API config:', error)
    }
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.CACHE_DURATION
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key)
    return cached ? cached.data : null
  }

  async getLiveMatches(): Promise<NormalizedMatch[]> {
    const cacheKey = 'live_matches'
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey)
    }

    if (!this.config) {
      return this.getMockLiveMatches()
    }

    try {
      const results = await testFootballApis(this.config)
      const liveMatches: NormalizedMatch[] = []

      results.forEach(result => {
        if (result.normalizedData) {
          const live = result.normalizedData.filter(match => 
            match.status === 'Live' || match.status === 'LIVE'
          )
          liveMatches.push(...live)
        }
      })

      // If no live matches from APIs, return mock data
      const data = liveMatches.length > 0 ? liveMatches : this.getMockLiveMatches()
      this.setCache(cacheKey, data)
      return data
    } catch (error) {
      console.error('Failed to fetch live matches:', error)
      return this.getMockLiveMatches()
    }
  }

  async getTodaysMatches(): Promise<NormalizedMatch[]> {
    const cacheKey = 'todays_matches'
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey)
    }

    if (!this.config) {
      return this.getMockTodaysMatches()
    }

    try {
      const results = await testFootballApis(this.config)
      const todaysMatches: NormalizedMatch[] = []

      results.forEach(result => {
        if (result.normalizedData) {
          const today = result.normalizedData.filter(match => 
            match.status === 'Scheduled' || match.status === 'SCHEDULED'
          )
          todaysMatches.push(...today)
        }
      })

      // If no today's matches from APIs, return mock data
      const data = todaysMatches.length > 0 ? todaysMatches : this.getMockTodaysMatches()
      this.setCache(cacheKey, data)
      return data
    } catch (error) {
      console.error('Failed to fetch today\'s matches:', error)
      return this.getMockTodaysMatches()
    }
  }

  async getNews(): Promise<any[]> {
    const cacheKey = 'news'
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey)
    }

    // For now, return mock news data
    // In the future, this would integrate with news APIs
    const data = this.getMockNews()
    this.setCache(cacheKey, data)
    return data
  }

  async getFeaturedNews(): Promise<any> {
    const cacheKey = 'featured_news'
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey)
    }

    // For now, return mock featured news
    const data = this.getMockFeaturedNews()
    this.setCache(cacheKey, data)
    return data
  }

  async getAllData(): Promise<FootballData> {
    const [liveMatches, todaysMatches, news, featuredNews] = await Promise.all([
      this.getLiveMatches(),
      this.getTodaysMatches(),
      this.getNews(),
      this.getFeaturedNews()
    ])

    return {
      liveMatches,
      todaysMatches,
      news,
      featuredNews,
      lastUpdated: new Date().toISOString()
    }
  }

  // Mock data methods
  private getMockLiveMatches(): NormalizedMatch[] {
    return [
      {
        match_id: 1,
        league: "Premier League",
        home_team: "Arsenal",
        away_team: "Chelsea",
        status: "Live",
        timestamp: new Date().toISOString(),
        score: { home: 2, away: 1 },
        venue: "Emirates Stadium",
        api_source: "mock",
        raw_data: {}
      },
      {
        match_id: 2,
        league: "Premier League",
        home_team: "Manchester United",
        away_team: "Liverpool",
        status: "Live",
        timestamp: new Date().toISOString(),
        score: { home: 0, away: 0 },
        venue: "Old Trafford",
        api_source: "mock",
        raw_data: {}
      }
    ]
  }

  private getMockTodaysMatches(): NormalizedMatch[] {
    return [
      {
        match_id: 3,
        league: "Premier League",
        home_team: "Brighton",
        away_team: "Newcastle",
        status: "Scheduled",
        timestamp: new Date().toISOString(),
        venue: "Amex Stadium",
        api_source: "mock",
        raw_data: {}
      },
      {
        match_id: 4,
        league: "Premier League",
        home_team: "Burnley",
        away_team: "Leeds",
        status: "Scheduled",
        timestamp: new Date().toISOString(),
        venue: "Turf Moor",
        api_source: "mock",
        raw_data: {}
      }
    ]
  }

  private getMockNews(): any[] {
    return [
      {
        id: 1,
        title: "Postecoglou: My story always ends with a trophy",
        category: "News",
        thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
        summary: "Tottenham manager discusses his winning mentality and future ambitions",
        publishedAt: "2 hours ago"
      },
      {
        id: 2,
        title: "Palmer out for six weeks: How will it affect Chelsea?",
        category: "Features",
        thumbnail: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&h=200&fit=crop",
        summary: "Analysis of Chelsea's midfield options without their star player",
        publishedAt: "4 hours ago"
      }
    ]
  }

  private getMockFeaturedNews(): any {
    return {
      id: 1,
      title: "Forest v Chelsea: Caicedo and Wood benched, Enzo misses out",
      category: "Live",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
      summary: "Team news and line-ups for today's Premier League clash",
      publishedAt: "Live"
    }
  }

  // Clear cache method
  clearCache() {
    this.cache.clear()
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        age: Date.now() - value.timestamp,
        isValid: this.isCacheValid(key)
      }))
    }
  }
}

// Export singleton instance
export const footballDataService = new FootballDataService()
