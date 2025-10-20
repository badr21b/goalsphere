'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from '@/hooks/useTranslations'
import { Calendar, Clock, Trophy, TrendingUp, ExternalLink, ChevronUp, ChevronDown, MapPin } from 'lucide-react'

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
  homeScore?: number | null
  awayScore?: number | null
  venue?: string
  date?: string
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
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const newsContainerRef = useRef<HTMLDivElement>(null)
  const [realMatches, setRealMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

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

  // Fetch real Premier League data
  useEffect(() => {
    const fetchPremierLeagueData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/football/premier-league')
        if (!response.ok) {
          throw new Error('Failed to fetch Premier League data')
        }
        
        const data = await response.json()
        
        // Convert API data to our Match interface
        const convertedMatches: Match[] = [
          ...(data.data.todaysMatches || []).map((match: any) => ({
            id: match.fixture.id.toString(),
            homeTeam: match.teams.home.name,
            awayTeam: match.teams.away.name,
            homeLogo: match.teams.home.logo,
            awayLogo: match.teams.away.logo,
            time: new Date(match.fixture.date).toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            league: match.league.name,
            status: match.fixture.status.short === 'LIVE' ? 'live' : 
                   match.fixture.status.short === 'FT' ? 'finished' : 'upcoming',
            broadcasters: ['Sky Sports', 'BT Sport'],
            homeScore: match.goals.home,
            awayScore: match.goals.away,
            venue: match.fixture.venue.name,
            date: match.fixture.date
          })),
          ...(data.data.thisWeekMatches || []).slice(0, 3).map((match: any) => ({
            id: match.fixture.id.toString(),
            homeTeam: match.teams.home.name,
            awayTeam: match.teams.away.name,
            homeLogo: match.teams.home.logo,
            awayLogo: match.teams.away.logo,
            time: new Date(match.fixture.date).toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            league: match.league.name,
            status: match.fixture.status.short === 'LIVE' ? 'live' : 
                   match.fixture.status.short === 'FT' ? 'finished' : 'upcoming',
            broadcasters: ['Sky Sports', 'BT Sport'],
            homeScore: match.goals.home,
            awayScore: match.goals.away,
            venue: match.fixture.venue.name,
            date: match.fixture.date
          })),
          ...(data.data.previousWeekMatches || []).map((match: any) => ({
            id: match.fixture.id.toString(),
            homeTeam: match.teams.home.name,
            awayTeam: match.teams.away.name,
            homeLogo: match.teams.home.logo,
            awayLogo: match.teams.away.logo,
            time: new Date(match.fixture.date).toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            league: match.league.name,
            status: match.fixture.status.short === 'LIVE' ? 'live' : 
                   match.fixture.status.short === 'FT' ? 'finished' : 'upcoming',
            broadcasters: ['Sky Sports', 'BT Sport'],
            homeScore: match.goals.home,
            awayScore: match.goals.away,
            venue: match.fixture.venue.name,
            date: match.fixture.date
          }))
        ]
        
        setRealMatches(convertedMatches)
      } catch (error) {
        console.error('Error fetching Premier League data:', error)
        // Fallback to empty array on error
        setRealMatches([])
      } finally {
        setLoading(false)
      }
    }

    fetchPremierLeagueData()
  }, [])

  // Use real matches or fallback to empty array
  const todayMatches = realMatches.slice(0, 4)

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

  // Auto-rotate news items every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [newsItems.length])

  const scrollNewsUp = () => {
    setCurrentNewsIndex((prevIndex) => 
      prevIndex === 0 ? newsItems.length - 1 : prevIndex - 1
    )
  }

  const scrollNewsDown = () => {
    setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length)
  }

  // Group matches by time period and remove duplicates
  const getMatchTimePeriod = (date: string) => {
    const matchDate = new Date(date)
    const now = new Date()
    const diffTime = now.getTime() - matchDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays <= 7) return 'This Week'
    if (diffDays <= 14) return 'Last Week'
    if (diffDays <= 21) return '2 Weeks Ago'
    if (diffDays <= 30) return '3 Weeks Ago'
    return 'Last Month'
  }

  // Remove duplicate matches based on fixture ID
  const uniqueMatches = realMatches.filter((match, index, self) => 
    index === self.findIndex(m => m.id === match.id)
  )

  const groupedMatches = uniqueMatches.reduce((acc, match) => {
    const timePeriod = getMatchTimePeriod(match.date || '')
    if (!acc[timePeriod]) {
      acc[timePeriod] = []
    }
    acc[timePeriod].push(match)
    return acc
  }, {} as Record<string, Match[]>)

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
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2">
                  {selectedCategory ? t(`categories.${selectedCategory}`) : 'Premier League'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-300">
                  {selectedCategory ? 'Latest updates and news' : 'The most competitive league in the world'}
                </p>
              </div>
            </div>

            {/* Live indicator */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-xs font-medium">{t('common.live')}</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="p-3 sm:p-4 md:p-6">
            <h3 className="text-sm font-bold text-white mb-2 hover:text-yellow-400 transition-colors cursor-pointer">
              Forest v Chelsea: Caicedo and Wood benched, Enzo misses out
            </h3>
            <p className="text-gray-400 text-xs">
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
          <h3 className="text-sm font-bold text-white mb-3 sm:mb-4">{t('home.latestNews')}</h3>
          
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
          className="w-full bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-md rounded-xl border border-purple-700/30 overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-2 border-b border-purple-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Premier League</h3>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => {/* TODO: Implement scroll up */}}
                  className="text-purple-300 hover:text-white transition-colors duration-200 p-1"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {/* TODO: Implement scroll down */}}
                  className="text-purple-300 hover:text-white transition-colors duration-200 p-1"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

            {/* Matches List */}
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
                  <p className="text-xs text-gray-400">Loading matches...</p>
                </div>
              ) : Object.keys(groupedMatches).length === 0 ? (
                <div className="text-center py-4">
                  <Trophy className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">No matches available</p>
                </div>
              ) : (
                Object.entries(groupedMatches).map(([timePeriod, matches]) => (
                  <div key={timePeriod} className="space-y-1">
                    {/* Time Period Header */}
                    <div className="px-2 py-1">
                      <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                        {timePeriod}
                      </h4>
                    </div>
                    
                    {/* Matches for this period */}
                    <div className="space-y-0">
                      {matches.map((match, index) => (
                        <motion.div
                          key={`${match.id}-${timePeriod}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-4 py-4 hover:bg-purple-800/30 transition-colors duration-200 border-b border-purple-700/30 last:border-b-0 rounded-lg mx-2"
                        >
                          <div className="flex items-center justify-center">
                            {/* Home Team */}
                            <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-full shadow-lg  p-1 bg-white/10">
                                <img 
                                  src={match.homeLogo} 
                                  alt={match.homeTeam}
                                  className="w-full h-full rounded-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-team.png';
                                  }}
                                />
                              </div>
                              <span className="text-xs text-white font-medium truncate text-center">
                                {match.homeTeam}
                              </span>
                            </div>
                            
                            {/* Score - Centered */}
                            <div className="flex flex-col items-center mx-2 min-w-0">
                              <div className="text-sm font-bold text-white">
                                {match.homeScore !== null && match.awayScore !== null 
                                  ? `${match.homeScore} - ${match.awayScore}`
                                  : 'vs'
                                }
                              </div>
                              <div className={`text-xs px-1 py-0.5 rounded text-center ${
                                match.status === 'finished' 
                                  ? 'bg-green-600/30 text-green-300' 
                                  : match.status === 'live'
                                  ? 'bg-red-600/30 text-red-300'
                                  : 'bg-gray-600/30 text-gray-300'
                              }`}>
                                {match.status === 'finished' ? 'FT' : 
                                 match.status === 'live' ? 'LIVE' : 
                                 match.time}
                              </div>
                            </div>
                            
                            {/* Away Team */}
                            <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-full shadow-lg  p-1 bg-white/10">
                                <img 
                                  src={match.awayLogo} 
                                  alt={match.awayTeam}
                                  className="w-full h-full rounded-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-team.png';
                                  }}
                                />
                              </div>
                              <span className="text-xs text-white font-medium truncate text-center">
                                {match.awayTeam}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

          {/* View All Matches Button */}
          <div className="p-4 border-t border-purple-700/30">
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
        <div className="lg:col-span-5 flex flex-col h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl overflow-hidden border border-purple-700/30 flex flex-col h-full max-h-96 overflow-y-hidden"
          >
            {/* Hero Image */}
            <div className="relative h-64 sm:h-80 bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Mock hero image placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-lg font-bold text-white mb-2">
                    {selectedCategory ? t(`categories.${selectedCategory}`) : 'Premier League'}
                  </h2>
                  <p className="text-xs text-gray-300">
                    {selectedCategory ? 'Latest updates and news' : 'The most competitive league in the world'}
                  </p>
                </div>
              </div>

              {/* Live indicator */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-xs font-medium">{t('common.live')}</span>
              </div>
            </div>

            {/* Hero Content */}
            <div className="p-6 flex-1 flex flex-col justify-end">
              <h3 className="text-sm font-bold text-white mb-2 hover:text-yellow-400 transition-colors cursor-pointer">
                Forest v Chelsea: Caicedo and Wood benched, Enzo misses out
              </h3>
              <p className="text-gray-400 text-xs">
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
            className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-700/20 p-4 flex flex-col h-full max-h-96 overflow-y-hidden relative"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">{t('home.latestNews')}</h3>
              
              {/* Minimalistic arrows */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={scrollNewsUp}
                  className="text-white/60 hover:text-white transition-colors duration-200 p-1"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={scrollNewsDown}
                  className="text-white/60 hover:text-white transition-colors duration-200 p-1"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          
            <div className="flex-1 relative overflow-hidden">
              <motion.div
                ref={newsContainerRef}
                key={currentNewsIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {newsItems.slice(currentNewsIndex, currentNewsIndex + 3).map((item, index) => (
                  <motion.div
                    key={`${item.id}-${currentNewsIndex}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
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
                        <h4 className="text-xs font-medium text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
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
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Today's Matches */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-md rounded-xl border border-purple-700/30 overflow-hidden flex flex-col h-full max-h-96 overflow-y-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-3 border-b border-purple-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">Premier League</h3>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {/* TODO: Implement scroll up */}}
                    className="text-purple-300 hover:text-white transition-colors duration-200 p-1"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {/* TODO: Implement scroll down */}}
                    className="text-purple-300 hover:text-white transition-colors duration-200 p-1"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Matches List */}
            <div className="p-5 space-y-2 flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-sm text-gray-400">Loading matches...</p>
                </div>
              ) : Object.keys(groupedMatches).length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-sm text-gray-400">No matches available</p>
                </div>
              ) : (
                Object.entries(groupedMatches).map(([timePeriod, matches]) => (
                  <div key={timePeriod} className="space-y-1">
                    {/* Time Period Header */}
                    <div className="px-2 py-2">
                      <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wide">
                        {timePeriod}
                      </h4>
                    </div>
                    
                    {/* Matches for this period */}
                    <div className="space-y-0">
                      {matches.map((match, index) => (
                        <motion.div
                          key={`${match.id}-${timePeriod}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-4 py-5 hover:bg-purple-800/30 transition-colors duration-200 border-b border-purple-700/30 last:border-b-0 rounded-lg mx-2"
                        >
                          <div className="flex items-center justify-center">
                            {/* Home Team */}
                            <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-full shadow-lg  p-1 bg-white/10">
                                <img 
                                  src={match.homeLogo} 
                                  alt={match.homeTeam}
                                  className="w-full h-full rounded-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-team.png';
                                  }}
                                />
                              </div>
                              <span className="text-sm text-white font-medium truncate text-center">
                                {match.homeTeam}
                              </span>
                            </div>
                            
                            {/* Score - Centered */}
                            <div className="flex flex-col items-center mx-4 min-w-0">
                              <div className="text-lg font-bold text-white">
                                {match.homeScore !== null && match.awayScore !== null 
                                  ? `${match.homeScore} - ${match.awayScore}`
                                  : 'vs'
                                }
                              </div>
                              <div className={`text-xs px-2 py-1 rounded text-center ${
                                match.status === 'finished' 
                                  ? 'bg-green-600/30 text-green-300' 
                                  : match.status === 'live'
                                  ? 'bg-red-600/30 text-red-300'
                                  : 'bg-gray-600/30 text-gray-300'
                              }`}>
                                {match.status === 'finished' ? 'FT' : 
                                 match.status === 'live' ? 'LIVE' : 
                                 match.time}
                              </div>
                            </div>
                            
                            {/* Away Team */}
                            <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-full shadow-lg  p-1 bg-white/10">
                                <img 
                                  src={match.awayLogo} 
                                  alt={match.awayTeam}
                                  className="w-full h-full rounded-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-team.png';
                                  }}
                                />
                              </div>
                              <span className="text-sm text-white font-medium truncate text-center">
                                {match.awayTeam}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* View All Matches Button */}
            <div className="p-5 border-t border-purple-700/30">
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
