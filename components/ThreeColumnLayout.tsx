'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from '@/hooks/useTranslations'
import { Calendar, Clock, Trophy, TrendingUp, ExternalLink } from 'lucide-react'

interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  homeLogo: string
  awayLogo: string
  time: string
  league: string
  status: 'live' | 'upcoming' | 'finished'
  broadcasters: string[]
}

interface NewsItem {
  id: string
  title: string
  category: string
  image: string
  publishedAt: string
  isBreaking?: boolean
}

interface ThreeColumnLayoutProps {
  selectedCategory?: string | null
}

export default function ThreeColumnLayout({ selectedCategory }: ThreeColumnLayoutProps) {
  const t = useTranslations()

  // Mock data for news items
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Postecoglou: My story always ends with a trophy',
      category: 'News',
      image: '/images/news/postecoglou.jpg',
      publishedAt: '2 hours ago'
    },
    {
      id: '2',
      title: 'Palmer out for six weeks: How will it affect Chelsea?',
      category: 'Features',
      image: '/images/news/palmer.jpg',
      publishedAt: '3 hours ago'
    },
    {
      id: '3',
      title: 'Win a shirt signed by Spurs star Xavi Simons',
      category: 'News',
      image: '/images/news/simons.jpg',
      publishedAt: '4 hours ago',
      isBreaking: true
    },
    {
      id: '4',
      title: 'Premier League and clubs highlight power of education',
      category: 'Community',
      image: '/images/news/education.jpg',
      publishedAt: '5 hours ago'
    },
    {
      id: '5',
      title: 'Manchester City sign new defensive midfielder',
      category: 'Transfers',
      image: '/images/news/transfer.jpg',
      publishedAt: '6 hours ago'
    }
  ]

  // Mock data for today's matches
  const todayMatches: Match[] = [
    {
      id: '1',
      homeTeam: 'Nott\'m Forest',
      awayTeam: 'Chelsea',
      homeLogo: '/images/teams/forest.png',
      awayLogo: '/images/teams/chelsea.png',
      time: '14:30',
      league: 'Premier League',
      status: 'live',
      broadcasters: ['Sky Sports', 'BT Sport']
    },
    {
      id: '2',
      homeTeam: 'Brighton',
      awayTeam: 'Newcastle',
      homeLogo: '/images/teams/brighton.png',
      awayLogo: '/images/teams/newcastle.png',
      time: '17:00',
      league: 'Premier League',
      status: 'upcoming',
      broadcasters: ['Sky Sports']
    },
    {
      id: '3',
      homeTeam: 'Burnley',
      awayTeam: 'Leeds',
      homeLogo: '/images/teams/burnley.png',
      awayLogo: '/images/teams/leeds.png',
      time: '17:00',
      league: 'Premier League',
      status: 'upcoming',
      broadcasters: ['BT Sport']
    },
    {
      id: '4',
      homeTeam: 'Crystal Palace',
      awayTeam: 'Bournemouth',
      homeLogo: '/images/teams/palace.png',
      awayLogo: '/images/teams/bournemouth.png',
      time: '17:00',
      league: 'Premier League',
      status: 'upcoming',
      broadcasters: ['Sky Sports']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'text-red-500'
      case 'upcoming':
        return 'text-yellow-500'
      case 'finished':
        return 'text-green-500'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live':
        return t('common.live')
      case 'upcoming':
        return t('common.upcoming')
      case 'finished':
        return t('common.finished')
      default:
        return status
    }
  }

  return (
    <div className="w-full">
      {/* Mobile Layout - Stacked */}
      <div className="flex flex-col space-y-4 lg:hidden">
        {/* Hero Section - Full Width on Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl overflow-hidden border border-purple-700/30"
        >
          {/* Hero Image */}
          <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Mock hero image placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-3 sm:mb-4" />
                <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-white mb-2">
                  {selectedCategory ? t(`categories.${selectedCategory}`) : 'Premier League'}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-300">
                  {selectedCategory ? 'Latest updates and news' : 'The most competitive league in the world'}
                </p>
              </div>
            </div>

            {/* Live indicator */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">{t('common.live')}</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="p-3 sm:p-4 md:p-6">
            <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white mb-2 hover:text-yellow-400 transition-colors cursor-pointer">
              Forest v Chelsea: Caicedo and Wood benched, Enzo misses out
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Latest team news and lineups for today's Premier League clash
            </p>
          </div>
        </motion.div>

        {/* Mobile News Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-700/20 p-3 sm:p-4"
        >
          <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{t('home.latestNews')}</h3>
          
          <div className="space-y-3 sm:space-y-4">
            {newsItems.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-lg p-3 border border-purple-700/20 hover:border-purple-600/40 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      {item.isBreaking && (
                        <span className="text-xs bg-red-600/30 text-red-300 px-2 py-1 rounded-full">
                          {t('common.breaking')}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-medium text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">{item.publishedAt}</p>
                  </div>
                  
                  {/* News thumbnail placeholder */}
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mobile Matches Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-700/20 overflow-hidden"
        >
          {/* Header */}
          <div className="p-3 border-b border-purple-700/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-white">Premier League</h3>
              <button className="text-xs text-purple-300 hover:text-white transition-colors flex items-center gap-1">
                {t('navigation.viewAllMatches')} <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-gray-400">{t('common.today')}</p>
          </div>

          {/* Matches List */}
          <div className="p-3 space-y-3">
            {todayMatches.slice(0, 4).map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="border-b border-purple-700/10 pb-3 last:border-b-0"
              >
                <div className="space-y-2">
                  {/* Teams */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                        <Trophy className="w-2 h-2 text-gray-400" />
                      </div>
                      <span className="text-xs text-white font-medium">{match.homeTeam}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white font-medium">{match.awayTeam}</span>
                      <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                        <Trophy className="w-2 h-2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Time and Status */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">{match.time}</div>
                    <div className={`text-xs font-medium ${getStatusColor(match.status)}`}>
                      {getStatusText(match.status)}
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1 mt-2">
                  <Clock className="w-3 h-3" />
                  Multiple Broadcasters
                </button>
              </motion.div>
            ))}
          </div>

          {/* View All Matches Button */}
          <div className="p-3 border-t border-purple-700/20">
            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
              <TrendingUp className="w-3 h-3" />
              {t('navigation.viewAllMatches')}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Desktop Layout - Three Columns */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
        {/* Left Column - Biggest Info (Hero Section) */}
        <div className="lg:col-span-6 flex flex-col h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl overflow-hidden border border-purple-700/30 flex flex-col h-full max-h-96"
          >
            {/* Hero Image */}
            <div className="relative h-64 sm:h-80 bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Mock hero image placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedCategory ? t(`categories.${selectedCategory}`) : 'Premier League'}
                  </h2>
                  <p className="text-sm text-gray-300">
                    {selectedCategory ? 'Latest updates and news' : 'The most competitive league in the world'}
                  </p>
                </div>
              </div>

              {/* Live indicator */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">{t('common.live')}</span>
              </div>
            </div>

            {/* Hero Content */}
            <div className="p-6 flex-1 flex flex-col justify-end">
              <h3 className="text-xl font-bold text-white mb-2 hover:text-yellow-400 transition-colors cursor-pointer">
                Forest v Chelsea: Caicedo and Wood benched, Enzo misses out
              </h3>
              <p className="text-gray-400 text-sm">
                Latest team news and lineups for today's Premier League clash
              </p>
            </div>
          </motion.div>
        </div>

        {/* Center Column - Vertical List of News */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-700/20 p-4 flex flex-col h-full"
          >
            <h3 className="text-lg font-bold text-white mb-4">{t('home.latestNews')}</h3>
          
            <div className="space-y-4 flex-1">
              {newsItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-lg p-4 border border-purple-700/20 hover:border-purple-600/40 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                        {item.isBreaking && (
                          <span className="text-xs bg-red-600/30 text-red-300 px-2 py-1 rounded-full">
                            {t('common.breaking')}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">{item.publishedAt}</p>
                    </div>
                    
                    {/* News thumbnail placeholder */}
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Today's Matches */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-700/20 overflow-hidden flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-4 border-b border-purple-700/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">Premier League</h3>
                <button className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-1">
                  {t('navigation.viewAllMatches')} <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-400">{t('common.today')}</p>
            </div>

            {/* Matches List */}
            <div className="p-4 space-y-4 flex-1">
              {todayMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="border-b border-purple-700/10 pb-4 last:border-b-0"
                >
                  <div className="space-y-2">
                    {/* Teams */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                          <Trophy className="w-3 h-3 text-gray-400" />
                        </div>
                        <span className="text-sm text-white font-medium">{match.homeTeam}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-medium">{match.awayTeam}</span>
                        <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                          <Trophy className="w-3 h-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Time and Status */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">{match.time}</div>
                      <div className={`text-sm font-medium ${getStatusColor(match.status)}`}>
                        {getStatusText(match.status)}
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2">
                    <Clock className="w-4 h-4" />
                    Multiple Broadcasters
                  </button>
                </motion.div>
              ))}
            </div>

            {/* View All Matches Button */}
            <div className="p-4 border-t border-purple-700/20">
              <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {t('navigation.viewAllMatches')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
