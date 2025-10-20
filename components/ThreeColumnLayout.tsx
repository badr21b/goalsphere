'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from '@/hooks/useTranslations'
import { Calendar, Clock, Trophy, TrendingUp, ExternalLink, ChevronUp, ChevronDown, MapPin } from 'lucide-react'
import { LeagueSlug, LEAGUES } from '@/lib/services/leagues'
import { FootballNews } from '@/lib/types'
import BestNews from '@/components/BestNews'
import { useBestNews } from '@/hooks/useBestNews'

interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  homeLogo: string
  awayLogo: string
  time: string
  league: string // store league slug
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
  selectedLeague?: LeagueSlug
  onLeagueChange?: (league: LeagueSlug) => void
}

export default function ThreeColumnLayout({ selectedCategory, selectedLeague: propSelectedLeague, onLeagueChange }: ThreeColumnLayoutProps) {
  const t = useTranslations()
  const { fetchBestNewsBulk } = useBestNews()
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const newsContainerRef = useRef<HTMLDivElement>(null)
  const [realMatches, setRealMatches] = useState<Match[]>([])
  const [realNews, setRealNews] = useState<FootballNews[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMatchScrollIndex, setCurrentMatchScrollIndex] = useState(0)

  // Independent right-column league selector
  const leagueSlugs = Object.keys(LEAGUES) as LeagueSlug[]
  const [rightLeagueIndex, setRightLeagueIndex] = useState(0)
  const activeLeagueSlug = leagueSlugs[rightLeagueIndex]
  const activeLeagueName = LEAGUES[activeLeagueSlug].name
  const nextLeague = () => setRightLeagueIndex((i) => (i + 1) % leagueSlugs.length)
  const prevLeague = () => setRightLeagueIndex((i) => (i - 1 + leagueSlugs.length) % leagueSlugs.length)

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


  // Fetch real league data for all leagues
  useEffect(() => {
    const fetchAllLeagueData = async () => {
      try {
        setLoading(true)
        let allConvertedMatches: Match[] = []
        let allNews: FootballNews[] = []

        for (const slug of Object.keys(LEAGUES) as LeagueSlug[]) {
          const response = await fetch(`/api/football/${slug}`)
          if (!response.ok) {
            console.error(`Failed to fetch ${slug} data`)
            continue // Skip to next league if one fails
          }
          const data = await response.json()

          // Add news from this league
          if (data.data.news && data.data.news.length > 0) {
            allNews = [...allNews, ...data.data.news]
          }

          const convertedMatchesForLeague: Match[] = [
            ...(data.data.liveMatches || []).map((match: any) => ({
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
              league: slug,
              status: 'live' as const,
              broadcasters: ['Sky Sports', 'BT Sport'],
              homeScore: match.goals.home,
              awayScore: match.goals.away,
              venue: match.fixture.venue.name,
              date: match.fixture.date
            })),
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
              league: slug,
              status: match.fixture.status.short === 'LIVE' ? 'live' : 
                     match.fixture.status.short === 'FT' ? 'finished' : 'upcoming',
              broadcasters: ['Sky Sports', 'BT Sport'],
              homeScore: match.goals.home,
              awayScore: match.goals.away,
              venue: match.fixture.venue.name,
              date: match.fixture.date
            })),
            ...(data.data.thisWeekMatches || []).map((match: any) => ({
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
              league: slug,
              status: match.fixture.status.short === 'LIVE' ? 'live' : 
                     match.fixture.status.short === 'FT' ? 'finished' : 'upcoming',
              broadcasters: ['Sky Sports', 'BT Sport'],
              homeScore: match.goals.home,
              awayScore: match.goals.away,
              venue: match.fixture.venue.name,
              date: match.fixture.date
            })),
            ...(data.data.nextWeekMatches || []).map((match: any) => ({
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
            ...(data.data.thisMonthMatches || []).map((match: any) => ({
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
              league: slug,
              status: match.fixture.status.short === 'LIVE' ? 'live' : 
                     match.fixture.status.short === 'FT' ? 'finished' : 'upcoming',
              broadcasters: ['Sky Sports', 'BT Sport'],
              homeScore: match.goals.home,
              awayScore: match.goals.away,
              venue: match.fixture.venue.name,
              date: match.fixture.date
            }))
          ]
          allConvertedMatches = [...allConvertedMatches, ...convertedMatchesForLeague]
        }
        
        // Sort all matches by date/time
        allConvertedMatches.sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime())

        // Sort news by published date (newest first)
        allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

        setRealMatches(allConvertedMatches)
        setRealNews(allNews)
      } catch (error) {
        console.error(`Error fetching all league data:`, error)
        // Fallback to empty array on error
        setRealMatches([])
        setRealNews([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllLeagueData()
  }, [])

  // Use real matches or fallback to empty array
  const todayMatches = realMatches.slice(0, 4)

  // Filter news by selected category
  const getFilteredNews = () => {
    if (!selectedCategory) {
      return realNews
    }
    
    // Map category to league names for filtering
    const categoryToLeagueMap: Record<string, string> = {
      'premier-league': 'premier-league',
      'la-liga': 'la-liga', 
      'serie-a': 'serie-a',
      'bundesliga': 'bundesliga',
      'champions-league': 'champions-league',
      'saudi-pro-league': 'saudi-pro-league',
      'europa-league': 'europa-league'
    }
    
    const targetLeague = categoryToLeagueMap[selectedCategory]
    if (targetLeague) {
      return realNews.filter(news => news.category === targetLeague)
    }
    
    // For other categories like 'transfers', 'analysis', 'breaking', return all news
    return realNews
  }

  const filteredNews = getFilteredNews()
  const displayNews = filteredNews.length > 0 ? filteredNews : realNews

  // Scope matches to right-column active league
  const scopedMatches = realMatches.filter(m => m.league === activeLeagueSlug)
  // Debug console: show aggregated and filtered news snapshot
  try {
    // eslint-disable-next-line no-console
    console.log('[ThreeColumnLayout] news snapshot', {
      selectedCategory,
      totalNews: realNews.length,
      filteredNews: filteredNews.length,
      sample: (filteredNews.length ? filteredNews : realNews).slice(0, 5).map(n => ({
        id: n.id,
        title: n.title,
        category: n.category,
        league: n.league?.name,
        publishedAt: n.publishedAt
      }))
    })
  } catch {}

  // Precompute featured items for main categories with one Gemini call
  useEffect(() => {
    if (realNews.length === 0) return
    const coreCategories = [
      'all',
      'transfers',
      'analysis',
      'breaking',
      'premier-league',
      'champions-league',
      'saudi-pro-league',
      'la-liga',
      'serie-a',
      'bundesliga'
    ]

    const newsByCategory: Record<string, any[]> = {
      all: realNews,
      transfers: realNews.filter(n => /transfer/i.test(n.title) || /transfer/i.test(n.description)),
      analysis: realNews.filter(n => /analysis|tactical|breakdown/i.test(n.title + ' ' + n.description)),
      breaking: realNews.filter(n => n.isBreaking),
      'premier-league': realNews.filter(n => /premier/i.test(n.league.name)),
      'champions-league': realNews.filter(n => /champions/i.test(n.league.name)),
      'saudi-pro-league': realNews.filter(n => /saudi/i.test(n.league.name)),
      'la-liga': realNews.filter(n => /la liga|laliga|spa/i.test(n.league.name + ' ' + n.league.country)),
      'serie-a': realNews.filter(n => /serie a|ita/i.test(n.league.name + ' ' + n.league.country)),
      'bundesliga': realNews.filter(n => /bundesliga|ger/i.test(n.league.name + ' ' + n.league.country))
    }

    fetchBestNewsBulk(coreCategories, newsByCategory)
  }, [realNews, fetchBestNewsBulk])


  // Match carousel functions
  const scrollMatchesUp = () => {
    if (groupedMatchesArray.length > 0) {
      const newIndex = currentMatchScrollIndex > 0 ? currentMatchScrollIndex - 1 : groupedMatchesArray.length - 1
      setCurrentMatchScrollIndex(newIndex)
    }
  }

  const scrollMatchesDown = () => {
    if (groupedMatchesArray.length > 0) {
      const newIndex = currentMatchScrollIndex < groupedMatchesArray.length - 1 ? currentMatchScrollIndex + 1 : 0
      setCurrentMatchScrollIndex(newIndex)
    }
  }

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
    if (displayNews.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % displayNews.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [displayNews.length])

  const scrollNewsUp = () => {
    if (displayNews.length === 0) return
    setCurrentNewsIndex((prevIndex) => 
      prevIndex === 0 ? displayNews.length - 1 : prevIndex - 1
    )
  }

  const scrollNewsDown = () => {
    if (displayNews.length === 0) return
    setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % displayNews.length)
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

  // Remove duplicate matches based on fixture ID within scoped list
  const uniqueMatches = scopedMatches.filter((match, index, self) => 
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

  // Convert grouped matches to array for carousel
  const groupedMatchesArray = Object.entries(groupedMatches)
  const currentGroup = groupedMatchesArray[currentMatchScrollIndex] || ['No matches', []]

  // Reset scroll position when league changes
  useEffect(() => {
    setCurrentMatchScrollIndex(0)
  }, [activeLeagueName])

  return (
    <div className="w-full">
      {/* Mobile Layout - Stacked */}
      <div className="flex flex-col space-y-4 lg:hidden">
        {/* Mobile Best News Section */}
        <BestNews selectedCategory={selectedCategory} newsItems={realNews} />

        {/* Mobile News Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-700/20 p-3 sm:p-4"
        >
          <h3 className="text-sm font-bold text-white mb-3 sm:mb-4">{t('home.latestNews')}</h3>
          
          <div className="space-y-3 sm:space-y-4">
            {displayNews.slice(0, 3).map((item, index) => (
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
                        {item.league.name}
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
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.publishedAt).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'short', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  
                  {/* News image */}
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    <Trophy className="w-4 h-4 text-gray-400 hidden" />
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
                  <h3 className="text-sm font-bold text-white">{activeLeagueName}</h3>
              </div>
              <div className="flex flex-col gap-1">
                  <button
                    onClick={prevLeague}
                  className="text-purple-300 hover:text-white transition-colors duration-200 p-1"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                  <button
                    onClick={nextLeague}
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
              ) : groupedMatchesArray.length === 0 ? (
                <div className="text-center py-4">
                  <Trophy className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">No matches available</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Time Period Header */}
                  <div className="px-2 py-1">
                    <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                      {currentGroup[0]}
                    </h4>
                  </div>
                  
                  {/* Matches for current period */}
                  <div className="space-y-0">
                    {currentGroup[1].map((match: Match, index: number) => (
              <motion.div
                        key={`${match.id}-${currentGroup[0]}`}
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
        {/* Left Column - Best News */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <BestNews selectedCategory={selectedCategory} newsItems={realNews} />
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
                {displayNews.slice(currentNewsIndex, currentNewsIndex + 3).map((item, index) => (
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
                            {item.league.name}
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
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(item.publishedAt).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'short', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      
                      {/* News image */}
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                        <Trophy className="w-5 h-5 text-gray-400 hidden" />
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
                  <h3 className="text-sm font-bold text-white">{activeLeagueName}</h3>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={prevLeague}
                    className="text-purple-300 hover:text-white transition-colors duration-200 p-1"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={nextLeague}
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
              ) : groupedMatchesArray.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-sm text-gray-400">No matches available</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Time Period Header */}
                  <div className="px-2 py-2">
                    <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wide">
                      {currentGroup[0]}
                    </h4>
                  </div>
                  
                  {/* Matches for current period */}
                  <div className="space-y-0">
                    {currentGroup[1].map((match: Match, index: number) => (
                <motion.div
                        key={`${match.id}-${currentGroup[0]}`}
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
