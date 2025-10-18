'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import HeaderNoI18n from '@/components/HeaderNoI18n'
import { useTranslations } from '@/hooks/useTranslations'
import { NormalizedMatch } from '@/lib/types/api'
import { realFootballDataService, RealFootballData } from '@/lib/services/realFootballDataService'

// Mock data for demonstration
const MOCK_LIVE_MATCHES = [
  {
    id: 1,
    home_team: "Arsenal",
    away_team: "Chelsea",
    home_score: 2,
    away_score: 1,
    status: "LIVE",
    minute: 67,
    league: "Premier League",
    kickoff: "15:00",
    venue: "Emirates Stadium"
  },
  {
    id: 2,
    home_team: "Manchester United",
    away_team: "Liverpool",
    home_score: 0,
    away_score: 0,
    status: "HT",
    minute: 45,
    league: "Premier League",
    kickoff: "17:30",
    venue: "Old Trafford"
  },
  {
    id: 3,
    home_team: "Real Madrid",
    away_team: "Barcelona",
    home_score: 1,
    away_score: 1,
    status: "FT",
    minute: 90,
    league: "La Liga",
    kickoff: "20:00",
    venue: "Santiago Bernabéu"
  }
]

const MOCK_TODAYS_MATCHES = [
  {
    id: 4,
    home_team: "Brighton",
    away_team: "Newcastle",
    status: "Scheduled",
    kickoff: "17:00",
    league: "Premier League",
    broadcasters: ["Sky Sports", "BT Sport"]
  },
  {
    id: 5,
    home_team: "Burnley",
    away_team: "Leeds",
    status: "Scheduled",
    kickoff: "17:00",
    league: "Premier League",
    broadcasters: ["Sky Sports"]
  },
  {
    id: 6,
    home_team: "Crystal Palace",
    away_team: "Bournemouth",
    status: "Scheduled",
    kickoff: "17:00",
    league: "Premier League",
    broadcasters: ["BT Sport"]
  },
  {
    id: 7,
    home_team: "Man City",
    away_team: "Everton",
    status: "Scheduled",
    kickoff: "17:00",
    league: "Premier League",
    broadcasters: ["Sky Sports", "BT Sport"]
  }
]

const MOCK_NEWS = [
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
  },
  {
    id: 3,
    title: "Win a shirt signed by Spurs star Xavi Simons",
    category: "News",
    thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&h=200&fit=crop",
    summary: "Exclusive competition for Tottenham fans",
    publishedAt: "6 hours ago"
  },
  {
    id: 4,
    title: "Premier League and clubs highlight power of education",
    category: "News",
    thumbnail: "https://images.unsplash.com/photo-1522778114586-c4b2740f2b4b?w=300&h=200&fit=crop",
    summary: "No Room For Racism campaign continues to make impact",
    publishedAt: "8 hours ago"
  }
]

const MOCK_FEATURED_NEWS = {
  id: 1,
  title: "Forest v Chelsea: Caicedo and Wood benched, Enzo misses out",
  category: "Live",
  image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
  summary: "Team news and line-ups for today's Premier League clash",
  publishedAt: "Live"
}

export default function FootballDashboard() {
  const t = useTranslations()
  const [footballData, setFootballData] = useState<RealFootballData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [dataAccuracy, setDataAccuracy] = useState<{ isValid: boolean; issues: string[] }>({ isValid: true, issues: [] })

  // Load football data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await realFootballDataService.getAllData()
        setFootballData(data)
        setLastUpdated(data.lastUpdated)
        
        // Validate data accuracy
        const accuracy = realFootballDataService.validateDataAccuracy()
        setDataAccuracy(accuracy)
      } catch (error) {
        console.error('Failed to load football data:', error)
        setDataAccuracy({ isValid: false, issues: ['Failed to load data from APIs'] })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
    
    // Refresh data every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return 'text-red-500'
      case 'HT': return 'text-yellow-500'
      case 'FT': return 'text-green-500'
      case 'Scheduled': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'LIVE': return 'bg-red-500'
      case 'HT': return 'bg-yellow-500'
      case 'FT': return 'bg-green-500'
      case 'Scheduled': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-sport-dark">
      {/* Header */}
      <HeaderNoI18n />

      {/* Data Accuracy Indicator */}
      <div className="bg-sport-gray/20 border-b border-gray-700/30 py-2">
        <div className="w-full px-4 sm:px-4 lg:max-w-7xl lg:mx-auto lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">GoalSphere | The premier source for sports news and statistics</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${dataAccuracy.isValid ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-gray-400">
                  {dataAccuracy.isValid ? 'Live Data' : 'Mock Data'}
                </span>
              </div>
            </div>
            <div className="text-gray-400">
              Last update: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Loading...'}
            </div>
          </div>
          {!dataAccuracy.isValid && dataAccuracy.issues.length > 0 && (
            <div className="mt-2 text-xs text-yellow-400">
              ⚠️ {dataAccuracy.issues.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Live Scores Ticker */}
      {footballData && footballData.liveMatches.length > 0 && (
        <div className="bg-sport-gray/20 border-b border-gray-700/30 py-2">
          <div className="w-full px-4 sm:px-4 lg:max-w-7xl lg:mx-auto lg:px-8">
            <div className="flex items-center space-x-6 text-sm text-gray-300 overflow-x-auto">
              <span className="text-sport-red font-semibold">LIVE</span>
              {footballData.liveMatches.map((match) => (
                <div key={match.match_id} className="flex items-center space-x-2 whitespace-nowrap">
                  <span className="text-white font-medium">{match.home_team}</span>
                  <span className="text-sport-red font-bold">
                    {match.score ? `${match.score.home}-${match.score.away}` : '0-0'}
                  </span>
                  <span className="text-white font-medium">{match.away_team}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusBg(match.status)} text-white`}>
                    {match.status === 'Live' ? 'LIVE' : match.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full px-4 sm:px-4 lg:max-w-7xl lg:mx-auto lg:px-8 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sport-red mx-auto mb-4"></div>
              <p className="text-gray-400">Loading football data...</p>
            </div>
          </div>
        ) : footballData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Featured Content */}
            <div className="lg:col-span-2">
              {/* Featured News */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="relative">
                  <img
                    src={footballData.featuredNews.image}
                    alt={footballData.featuredNews.title}
                    className="w-full h-64 sm:h-80 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        {footballData.featuredNews.category}
                      </span>
                      <span className="text-gray-300 text-sm">{footballData.featuredNews.publishedAt}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {footballData.featuredNews.title}
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base">
                      {footballData.featuredNews.summary}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* News Feed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Latest News</h2>
                <div className="space-y-4">
                  {footballData.news.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-sport-gray/30 rounded-lg p-4 border border-gray-700/50 hover:bg-sport-gray/40 transition-colors cursor-pointer"
                    >
                      <div className="flex space-x-4">
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sport-red text-xs font-semibold uppercase">
                              {article.category}
                            </span>
                            <span className="text-gray-400 text-xs">{article.publishedAt}</span>
                          </div>
                          <h3 className="text-white font-semibold mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {article.summary}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
          </div>

          {/* Right Column - Today's Matches */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-sport-gray/30 rounded-lg p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Premier League Today</h2>
                <a href="#" className="text-sport-red hover:text-red-400 text-sm font-medium">
                  View all matches →
                </a>
              </div>

              <div className="space-y-4">
                {footballData.todaysMatches.map((match, index) => (
                  <motion.div
                    key={match.match_id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-sport-gray/50 rounded-lg p-4 hover:bg-sport-gray/60 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                        <span className="text-white font-medium text-sm">{match.home_team}</span>
                      </div>
                      <div className="text-center">
                        <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${getStatusBg(match.status)} text-white`}>
                          {match.status}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {new Date(match.timestamp).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false 
                          })}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium text-sm">{match.away_team}</span>
                        <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">{match.league}</span>
                      <button className="bg-sport-red hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                        Watch Live
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Live Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-sport-gray/30 rounded-lg p-6 border border-gray-700/50"
            >
              <h2 className="text-xl font-bold text-white mb-6">Live Matches</h2>
              <div className="space-y-4">
                {footballData.liveMatches.filter(match => match.status === 'Live').map((match, index) => (
                  <motion.div
                    key={match.match_id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-sport-gray/50 rounded-lg p-4 hover:bg-sport-gray/60 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                        <span className="text-white font-medium text-sm">{match.home_team}</span>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-bold text-lg">
                          {match.score ? `${match.score.home} - ${match.score.away}` : '0 - 0'}
                        </div>
                        <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${getStatusBg(match.status)} text-white`}>
                          {match.status === 'Live' ? 'LIVE' : match.status}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium text-sm">{match.away_team}</span>
                        <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">{match.league}</span>
                      <span className="text-gray-400 text-xs">{match.venue}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Failed to load football data. Please try again later.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-sport-gray/30 border-t border-gray-700/50 py-8 mt-12">
        <div className="w-full px-4 sm:px-4 lg:max-w-7xl lg:mx-auto lg:px-8">
          <div className="text-center text-gray-400">
            <h3 className="text-xl font-bold text-white mb-4">GoalSphere</h3>
            <p className="mb-4">Your premier source for football news, live scores, and statistics</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
