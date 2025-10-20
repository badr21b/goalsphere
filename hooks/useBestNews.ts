import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setBestNews, setLoading, setError } from '@/store/slices/bestNewsSlice'
import { geminiService, BestNewsRequest } from '@/lib/services/geminiService'
import { FootballNews } from '@/lib/types'

export const useBestNews = () => {
  const dispatch = useAppDispatch()

  // Derive required state once per render
  const bestNewsByCategory = useAppSelector(
    (state) => state.bestNews.bestNewsByCategory
  )
  const lastFetched = useAppSelector((state) => state.bestNews.lastFetched)
  const isLoading = useAppSelector((state) => state.bestNews.loading)
  const error = useAppSelector((state) => state.bestNews.error)

  const getBestNews = useCallback(
    (category: string) => bestNewsByCategory[category] || null,
    [bestNewsByCategory]
  )

  const isCacheValid = useCallback(
    (category: string) => {
      const ts = lastFetched[category]
      if (!ts) return false
      return Date.now() - ts < 5 * 60 * 1000 // 5 minutes
    },
    [lastFetched]
  )

  const fetchBestNews = useCallback(async (
    category: string, 
    newsItems: FootballNews[]
  ): Promise<FootballNews | null> => {
    // Check if we have valid cached data
    if (isCacheValid(category)) {
      const cachedNews = getBestNews(category)
      if (cachedNews) {
        return cachedNews
      }
    }

    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      if (!newsItems || newsItems.length === 0) {
        dispatch(setBestNews({ category, news: null }))
        return null
      }

      // Filter news by selected category
      const filteredNews = category && category !== 'all' 
        ? newsItems.filter(news => news.category === category)
        : newsItems

      if (filteredNews.length === 0) {
        dispatch(setBestNews({ category, news: null }))
        return null
      }

      // Prepare request for Gemini
      const request: BestNewsRequest = {
        category: category || 'all',
        newsItems: filteredNews.slice(0, 5).map(news => ({
          title: news.title,
          description: news.description,
          image: news.image,
          publishedAt: news.publishedAt,
          league: {
            name: news.league.name,
            country: news.league.country
          }
        }))
      }

      // Generate best news using Gemini
      const generatedNews = await geminiService.generateBestNews(request)
      
      let bestNewsItem: FootballNews | null = null

      if (generatedNews) {
        // Convert GeneratedContent to FootballNews format
        bestNewsItem = {
          id: `best-${Date.now()}`,
          title: generatedNews.title,
          description: generatedNews.content,
          image: generatedNews.thumbnail || '/images/placeholder-news.jpg',
          publishedAt: generatedNews.publishedAt,
          category: generatedNews.category,
          link: `/article/${generatedNews.id || `best-${Date.now()}`}`,
          isBreaking: generatedNews.tags?.includes('breaking') || false,
          league: {
            id: 0,
            name: generatedNews.category.replace('-', ' ').toUpperCase(),
            country: 'International',
            logo: '/images/league-logo.png',
            flag: '/images/flag.png'
          }
        }
      } else {
        // Fallback to first news item if Gemini fails
        bestNewsItem = filteredNews[0]
      }

      dispatch(setBestNews({ category, news: bestNewsItem }))
      return bestNewsItem

    } catch (err) {
      console.error('Error generating best news:', err)
      const errorMessage = 'Failed to generate best news'
      dispatch(setError(errorMessage))
      
      // Fallback to first news item
      const filteredNews = category && category !== 'all' 
        ? newsItems.filter(news => news.category === category)
        : newsItems
      
      const fallbackNews = filteredNews.length > 0 ? filteredNews[0] : null
      dispatch(setBestNews({ category, news: fallbackNews }))
      return fallbackNews
    }
  }, [dispatch, isCacheValid, getBestNews])

  // Bulk generation for multiple categories in one Gemini call
  const fetchBestNewsBulk = useCallback(async (
    categories: string[],
    newsByCategory: Record<string, FootballNews[]>
  ): Promise<Record<string, FootballNews | null>> => {
    try {
      const requests = categories.map((cat) => ({
        category: cat,
        newsItems: (newsByCategory[cat] || []).slice(0, 5).map(n => ({
          title: n.title,
          description: n.description,
          image: n.image,
          publishedAt: n.publishedAt,
          league: { name: n.league.name, country: n.league.country }
        }))
      }))

      const batch = await geminiService.generateBestNewsBatch(requests)

      const mapped: Record<string, FootballNews | null> = {}
      Object.entries(batch).forEach(([cat, item]) => {
        if (!item) {
          mapped[cat] = null
          dispatch(setBestNews({ category: cat, news: null }))
          return
        }
        const converted: FootballNews = {
          id: `best-${cat}-${Date.now()}`,
          title: item.title,
          description: item.content,
          image: item.thumbnail || '/images/placeholder-news.jpg',
          publishedAt: item.publishedAt,
          category: cat,
          link: `/article/best-${cat}`,
          isBreaking: (item.tags || []).includes('breaking'),
          league: {
            id: 0,
            name: cat.replace('-', ' ').toUpperCase(),
            country: 'International',
            logo: '/images/league-logo.png',
            flag: '/images/flag.png'
          }
        }
        mapped[cat] = converted
        dispatch(setBestNews({ category: cat, news: converted }))
      })

      return mapped
    } catch (e) {
      console.error('Error in fetchBestNewsBulk', e)
      return {}
    }
  }, [dispatch])

  return {
    getBestNews,
    isLoading,
    error,
    isCacheValid,
    fetchBestNews,
    fetchBestNewsBulk
  }
}
