import axios from 'axios'
import * as cheerio from 'cheerio'
import { Article, ArticleCategory } from '@/lib/types'

export interface ExternalAPIConfig {
  name: string
  baseUrl: string
  apiKey: string
  rateLimit: number
  endpoints: {
    news: string
    liveScores: string
    teams: string
  }
}

export interface ScrapedArticle {
  title: string
  body: string
  imageUrl?: string
  publishedAt: Date
  source: string
  category: ArticleCategory
  externalId: string
  rawData: any
}

export class ContentIngestionService {
  private configs: Map<string, ExternalAPIConfig> = new Map()

  constructor() {
    this.initializeConfigs()
  }

  private initializeConfigs() {
    // Sportmonks configuration
    this.configs.set('sportmonks', {
      name: 'Sportmonks',
      baseUrl: 'https://api.sportmonks.com/v3/football',
      apiKey: process.env.SPORTMONKS_API_KEY || '',
      rateLimit: 100,
      endpoints: {
        news: '/news',
        liveScores: '/fixtures',
        teams: '/teams'
      }
    })

    // API-Football configuration
    this.configs.set('api_football', {
      name: 'API-Football',
      baseUrl: 'https://v3.football.api-sports.io',
      apiKey: process.env.API_FOOTBALL_KEY || '',
      rateLimit: 100,
      endpoints: {
        news: '/news',
        liveScores: '/fixtures',
        teams: '/teams'
      }
    })
  }

  async fetchFromSportmonks(categories: ArticleCategory[] = []): Promise<ScrapedArticle[]> {
    const config = this.configs.get('sportmonks')
    if (!config || !config.apiKey) {
      throw new Error('Sportmonks API key not configured')
    }

    try {
      const response = await axios.get(`${config.baseUrl}${config.endpoints.news}`, {
        params: {
          api_token: config.apiKey,
          include: 'tags,author',
          per_page: 50
        }
      })

      return this.transformSportmonksData(response.data.data || [])
    } catch (error) {
      console.error('Error fetching from Sportmonks:', error)
      throw error
    }
  }

  async fetchFromAPIFootball(categories: ArticleCategory[] = []): Promise<ScrapedArticle[]> {
    const config = this.configs.get('api_football')
    if (!config || !config.apiKey) {
      throw new Error('API-Football API key not configured')
    }

    try {
      const response = await axios.get(`${config.baseUrl}${config.endpoints.news}`, {
        headers: {
          'X-RapidAPI-Key': config.apiKey,
          'X-RapidAPI-Host': 'v3.football.api-sports.io'
        },
        params: {
          season: new Date().getFullYear(),
          page: 1
        }
      })

      return this.transformAPIFootballData(response.data.response || [])
    } catch (error) {
      console.error('Error fetching from API-Football:', error)
      throw error
    }
  }

  async scrapeFromWebsites(): Promise<ScrapedArticle[]> {
    const articles: ScrapedArticle[] = []

    // Scrape from popular Arabic football news sites
    const websites = [
      'https://www.goal.com/ar',
      'https://www.kooora.com',
      'https://www.alarabiya.net/sports'
    ]

    for (const website of websites) {
      try {
        const websiteArticles = await this.scrapeWebsite(website)
        articles.push(...websiteArticles)
      } catch (error) {
        console.error(`Error scraping ${website}:`, error)
      }
    }

    return articles
  }

  private async scrapeWebsite(url: string): Promise<ScrapedArticle[]> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      const $ = cheerio.load(response.data)
      const articles: ScrapedArticle[] = []

      // Generic selectors for Arabic football news
      $('article, .article, .news-item, .post').each((index, element) => {
        const $el = $(element)
        
        const title = $el.find('h1, h2, h3, .title, .headline').first().text().trim()
        const body = $el.find('.content, .body, .text, p').first().text().trim()
        const imageUrl = $el.find('img').first().attr('src')
        const link = $el.find('a').first().attr('href')

        if (title && body && title.length > 10) {
          articles.push({
            title: this.cleanText(title),
            body: this.cleanText(body),
            imageUrl: this.normalizeImageUrl(imageUrl, url),
            publishedAt: new Date(),
            source: this.extractDomain(url),
            category: this.categorizeArticle(title, body),
            externalId: link || `${url}-${index}`,
            rawData: {
              url,
              link,
              scrapedAt: new Date().toISOString()
            }
          })
        }
      })

      return articles
    } catch (error) {
      console.error(`Error scraping website ${url}:`, error)
      return []
    }
  }

  private transformSportmonksData(data: any[]): ScrapedArticle[] {
    return data.map(item => ({
      title: this.cleanText(item.title || ''),
      body: this.cleanText(item.content || ''),
      imageUrl: item.image?.url,
      publishedAt: new Date(item.published_at || Date.now()),
      source: 'Sportmonks',
      category: this.categorizeArticle(item.title || '', item.content || ''),
      externalId: item.id?.toString() || '',
      rawData: item
    }))
  }

  private transformAPIFootballData(data: any[]): ScrapedArticle[] {
    return data.map(item => ({
      title: this.cleanText(item.title || ''),
      body: this.cleanText(item.description || ''),
      imageUrl: item.image,
      publishedAt: new Date(item.date || Date.now()),
      source: 'API-Football',
      category: this.categorizeArticle(item.title || '', item.description || ''),
      externalId: item.id?.toString() || '',
      rawData: item
    }))
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\w\.,!?\-]/g, '')
      .trim()
  }

  private normalizeImageUrl(imageUrl: string | undefined, baseUrl: string): string | undefined {
    if (!imageUrl) return undefined
    
    if (imageUrl.startsWith('http')) {
      return imageUrl
    }
    
    if (imageUrl.startsWith('/')) {
      const url = new URL(baseUrl)
      return `${url.protocol}//${url.host}${imageUrl}`
    }
    
    return `${baseUrl}/${imageUrl}`
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  private categorizeArticle(title: string, body: string): ArticleCategory {
    const text = `${title} ${body}`.toLowerCase()
    
    // Transfer news keywords
    if (text.includes('انتقال') || text.includes('صفقة') || text.includes('تعاقد') || 
        text.includes('transfer') || text.includes('signing')) {
      return 'transfers'
    }
    
    // Analysis keywords
    if (text.includes('تحليل') || text.includes('تقييم') || text.includes('analysis') || 
        text.includes('review')) {
      return 'analysis'
    }
    
    // Breaking news keywords
    if (text.includes('عاجل') || text.includes('فوري') || text.includes('breaking') || 
        text.includes('urgent')) {
      return 'breaking'
    }
    
    // League-specific keywords
    if (text.includes('الدوري الإنجليزي') || text.includes('premier league') || 
        text.includes('manchester') || text.includes('liverpool')) {
      return 'premier-league'
    }
    
    if (text.includes('دوري أبطال أوروبا') || text.includes('champions league') || 
        text.includes('uefa')) {
      return 'champions-league'
    }
    
    if (text.includes('الدوري السعودي') || text.includes('saudi pro league') || 
        text.includes('الهلال') || text.includes('النصر')) {
      return 'saudi-pro-league'
    }
    
    if (text.includes('الدوري الإسباني') || text.includes('la liga') || 
        text.includes('real madrid') || text.includes('barcelona')) {
      return 'la-liga'
    }
    
    if (text.includes('الدوري الإيطالي') || text.includes('serie a') || 
        text.includes('juventus') || text.includes('milan')) {
      return 'serie-a'
    }
    
    if (text.includes('الدوري الألماني') || text.includes('bundesliga') || 
        text.includes('bayern') || text.includes('dortmund')) {
      return 'bundesliga'
    }
    
    return 'transfers' // Default category
  }

  async processArticles(articles: ScrapedArticle[]): Promise<{
    processed: number
    created: number
    updated: number
    errors: string[]
  }> {
    const results = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [] as string[]
    }

    for (const article of articles) {
      try {
        // Here you would call your API to save/update the article
        // For now, we'll just simulate the process
        results.processed++
        
        // Simulate random creation/update
        if (Math.random() > 0.5) {
          results.created++
        } else {
          results.updated++
        }
      } catch (error) {
        results.errors.push(`Error processing article "${article.title}": ${error}`)
      }
    }

    return results
  }
}

export const contentIngestionService = new ContentIngestionService()
