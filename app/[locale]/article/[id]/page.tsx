'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, ExternalLink, Trophy } from 'lucide-react'
import Link from 'next/link'
import { FootballNews } from '@/lib/types'
import { useBestNews } from '@/hooks/useBestNews'

export default function ArticlePage() {
  const params = useParams()
  const articleId = params.id as string
  const { getBestNews } = useBestNews()
  const [article, setArticle] = useState<FootballNews | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try to find the article in all categories
    const categories = ['all', 'premier-league', 'la-liga', 'serie-a', 'bundesliga', 'champions-league', 'saudi-pro-league']
    
    for (const category of categories) {
      const bestNews = getBestNews(category)
      if (bestNews && bestNews.id === articleId) {
        setArticle(bestNews)
        setLoading(false)
        return
      }
    }
    
    // If not found in cache, show loading or error
    setLoading(false)
  }, [articleId, getBestNews])

  if (loading) {
    return (
      <div className="min-h-screen bg-sport-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-sport-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-gray-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/en"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sport-dark">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-b border-purple-700/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/en"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-purple-300">Featured Article</span>
            {article.isBreaking && (
              <span className="px-2 py-1 bg-red-600/20 text-red-300 text-xs rounded-full">
                Breaking
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Article Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-full">
                {article.league.name}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(article.publishedAt).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder-news.jpg'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Article Body */}
          <div className="prose prose-invert max-w-none">
            <div className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
              {article.description}
            </div>
          </div>

          {/* Article Footer */}
          <footer className="border-t border-gray-700/30 pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                <p>Published in {article.league.name}</p>
                <p>Source: GoalSphere Featured News</p>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span>Share Article</span>
                </button>
              </div>
            </div>
          </footer>
        </motion.div>
      </article>
    </div>
  )
}
