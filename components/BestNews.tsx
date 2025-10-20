'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, ExternalLink, Calendar, Clock } from 'lucide-react'
import { FootballNews } from '@/lib/types'
import { useBestNews } from '@/hooks/useBestNews'

interface BestNewsProps {
  selectedCategory?: string | null
  newsItems: FootballNews[]
}

export default function BestNews({ selectedCategory, newsItems }: BestNewsProps) {
  const { getBestNews, isLoading, error, fetchBestNews } = useBestNews()
  const category = selectedCategory || 'all'
  const bestNews = getBestNews(category)

  useEffect(() => {
    // Debug: log incoming news items per category
    try {
      // Avoid noisy logs for huge arrays by mapping essentials
      // eslint-disable-next-line no-console
      console.log('[BestNews] incoming newsItems', {
        category,
        count: newsItems?.length || 0,
        sample: (newsItems || []).slice(0, 5).map(n => ({
          id: n.id,
          title: n.title,
          category: n.category,
          league: n.league?.name,
          publishedAt: n.publishedAt
        }))
      })
    } catch {}
    fetchBestNews(category, newsItems)
  }, [category, newsItems])

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-700/20 p-4"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </motion.div>
    )
  }

  if (error || !bestNews) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-700/20 p-4"
      >
        <div className="text-center text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-sm">No featured news available</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-700/20 p-4 flex flex-col h-full max-h-96 overflow-y-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-sm font-bold text-white">Featured News</h3>
        </div>
        {bestNews.isBreaking && (
          <span className="px-2 py-1 bg-red-600/20 text-red-300 text-xs rounded-full">
            Breaking
          </span>
        )}
      </div>

      {/* News Image */}
      <div className="relative mb-3 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={bestNews.image}
          alt={bestNews.title}
          className="w-full h-32 object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/placeholder-news.jpg'
          }}
        />
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
            {bestNews.league.name}
          </span>
        </div>
      </div>

      {/* News Content */}
      <div className="flex-1 flex flex-col space-y-2">
        <h4 className="text-sm font-bold text-white leading-tight line-clamp-2">
          {bestNews.title}
        </h4>
        
        <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 flex-1">
          {bestNews.description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(bestNews.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                {new Date(bestNews.publishedAt).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
          
          <a 
            href={bestNews.link}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>Read More</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
