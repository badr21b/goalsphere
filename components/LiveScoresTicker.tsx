'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Trophy, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { LeagueSlug, LEAGUES } from '@/lib/services/leagues'

interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  homeLogo: string
  awayLogo: string
  homeScore: number | null
  awayScore: number | null
  status: 'live' | 'upcoming' | 'finished'
  league: string
  time: string
}

const mockMatches: Match[] = [
  {
    id: '1',
    homeTeam: 'Crystal Palace',
    awayTeam: 'Bournemouth',
    homeLogo: 'https://media.api-sports.io/football/teams/354.png',
    awayLogo: 'https://media.api-sports.io/football/teams/35.png',
    homeScore: 1,
    awayScore: 0,
    status: 'live',
    league: 'Premier League',
    time: '17:00'
  },
  {
    id: '2',
    homeTeam: 'Brighton',
    awayTeam: 'Newcastle',
    homeLogo: 'https://media.api-sports.io/football/teams/51.png',
    awayLogo: 'https://media.api-sports.io/football/teams/34.png',
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    league: 'Premier League',
    time: '17:00'
  },
  {
    id: '3',
    homeTeam: 'Burnley',
    awayTeam: 'Leeds',
    homeLogo: 'https://media.api-sports.io/football/teams/44.png',
    awayLogo: 'https://media.api-sports.io/football/teams/63.png',
    homeScore: 2,
    awayScore: 1,
    status: 'finished',
    league: 'Premier League',
    time: '17:00'
  },
  {
    id: '4',
    homeTeam: 'Man City',
    awayTeam: 'Everton',
    homeLogo: 'https://media.api-sports.io/football/teams/50.png',
    awayLogo: 'https://media.api-sports.io/football/teams/45.png',
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    league: 'Premier League',
    time: '17:00'
  },
  {
    id: '5',
    homeTeam: 'Sunderland',
    awayTeam: 'Wolves',
    homeLogo: 'https://media.api-sports.io/football/teams/71.png',
    awayLogo: 'https://media.api-sports.io/football/teams/39.png',
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    league: 'Premier League',
    time: '17:00'
  },
  {
    id: '6',
    homeTeam: 'Fulham',
    awayTeam: 'Arsenal',
    homeLogo: 'https://media.api-sports.io/football/teams/36.png',
    awayLogo: 'https://media.api-sports.io/football/teams/42.png',
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    league: 'Premier League',
    time: '19:30'
  },
]

interface LiveScoresTickerProps {
  leagueSlug?: LeagueSlug | 'all'
}

export default function LiveScoresTicker({ leagueSlug = 'premier-league' }: LiveScoresTickerProps) {
  const t = useTranslations()
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [liveMatches, setLiveMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Fetch real league data
  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        setLoading(true)
        let convertedMatches: Match[] = []

        if (leagueSlug === 'all') {
          const slugs = Object.keys(LEAGUES) as LeagueSlug[]
          for (const slug of slugs) {
            const resp = await fetch(`/api/football/${slug}`)
            if (!resp.ok) continue
            const data = await resp.json()
            const toMatches = (arr: any[], statusOverride?: 'live' | 'upcoming' | 'finished') => (arr || []).map((match: any) => ({
              id: match.fixture.id.toString(),
              homeTeam: match.teams.home.name,
              awayTeam: match.teams.away.name,
              homeLogo: match.teams.home.logo,
              awayLogo: match.teams.away.logo,
              homeScore: match.goals.home,
              awayScore: match.goals.away,
              status: statusOverride ?? (match.fixture.status.short === 'LIVE' ? 'live' as const : match.fixture.status.short === 'FT' ? 'finished' as const : 'upcoming' as const),
              league: match.league.name,
              time: new Date(match.fixture.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
            }))
            convertedMatches = convertedMatches.concat(
              toMatches(data.data.liveMatches, 'live'),
              toMatches(data.data.todaysMatches),
              toMatches((data.data.thisWeekMatches || []).slice(0, 3))
            )
          }
        } else {
          const response = await fetch(`/api/football/${leagueSlug}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch ${leagueSlug} data`)
          }
          const data = await response.json()
          convertedMatches = [
            ...(data.data.liveMatches || []).map((match: any) => ({
              id: match.fixture.id.toString(),
              homeTeam: match.teams.home.name,
              awayTeam: match.teams.away.name,
              homeLogo: match.teams.home.logo,
              awayLogo: match.teams.away.logo,
              homeScore: match.goals.home,
              awayScore: match.goals.away,
              status: 'live' as const,
              league: match.league.name,
              time: new Date(match.fixture.date).toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })
            })),
            ...(data.data.todaysMatches || []).map((match: any) => ({
              id: match.fixture.id.toString(),
              homeTeam: match.teams.home.name,
              awayTeam: match.teams.away.name,
              homeLogo: match.teams.home.logo,
              awayLogo: match.teams.away.logo,
              homeScore: match.goals.home,
              awayScore: match.goals.away,
              status: match.fixture.status.short === 'LIVE' ? 'live' as const : 
                     match.fixture.status.short === 'FT' ? 'finished' as const : 'upcoming' as const,
              league: match.league.name,
              time: new Date(match.fixture.date).toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })
            })),
            ...(data.data.thisWeekMatches || []).slice(0, 3).map((match: any) => ({
              id: match.fixture.id.toString(),
              homeTeam: match.teams.home.name,
              awayTeam: match.teams.away.name,
              homeLogo: match.teams.home.logo,
              awayLogo: match.teams.away.logo,
              homeScore: match.goals.home,
              awayScore: match.goals.away,
              status: match.fixture.status.short === 'LIVE' ? 'live' as const : 
                     match.fixture.status.short === 'FT' ? 'finished' as const : 'upcoming' as const,
              league: match.league.name,
              time: new Date(match.fixture.date).toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })
            }))
          ]
        }

        // Deduplicate by id and sort soonest first
        const unique = convertedMatches.filter((m, i, arr) => i === arr.findIndex(x => x.id === m.id))
        unique.sort((a, b) => a.time.localeCompare(b.time))
        setLiveMatches(unique)
      } catch (error) {
        console.error(`Error fetching ${leagueSlug} data:`, error)
        setLiveMatches(mockMatches)
      } finally {
        setLoading(false)
      }
    }

    fetchLeagueData()
  }, [leagueSlug])

  useEffect(() => {
    // Auto-rotate matches every 5 seconds
    const interval = setInterval(() => {
      if (liveMatches.length > 0) {
        setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % liveMatches.length)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [liveMatches.length])

  useEffect(() => {
    // Update scroll position when current match changes
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const itemWidth = container.scrollWidth / liveMatches.length
      const newPosition = currentMatchIndex * itemWidth
      setScrollPosition(newPosition)
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
    }
  }, [currentMatchIndex, liveMatches.length])

  useEffect(() => {
    // Track scroll position
    const container = scrollContainerRef.current
    if (container) {
      const handleScroll = () => {
        setScrollPosition(container.scrollLeft)
      }
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const prevMatch = () => {
    setCurrentMatchIndex((prevIndex) => 
      prevIndex === 0 ? liveMatches.length - 1 : prevIndex - 1
    )
  }

  const nextMatch = () => {
    setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % liveMatches.length)
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const itemWidth = container.scrollWidth / liveMatches.length
      const newPosition = Math.max(0, scrollPosition - itemWidth)
      const newIndex = Math.floor(newPosition / itemWidth)
      setScrollPosition(newPosition)
      setCurrentMatchIndex(newIndex)
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const itemWidth = container.scrollWidth / liveMatches.length
      const maxScroll = container.scrollWidth - container.clientWidth
      const newPosition = Math.min(maxScroll, scrollPosition + itemWidth)
      const newIndex = Math.floor(newPosition / itemWidth)
      setScrollPosition(newPosition)
      setCurrentMatchIndex(newIndex)
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'text-red-400'
      case 'finished':
        return 'text-green-400'
      case 'upcoming':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusText = (match: Match) => {
    switch (match.status) {
      case 'live':
        return 'LIVE'
      case 'finished':
        return 'FT'
      case 'upcoming':
        return match.time
      default:
        return match.status
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 py-2"
      >
        <div className="w-full px-6 sm:px-6 lg:max-w-7xl lg:mx-auto lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-xs">
                Loading live scores...
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (liveMatches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 py-2"
      >
        <div className="w-full px-6 sm:px-6 lg:max-w-7xl lg:mx-auto lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-xs">
                {t('liveTicker.noMatches')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 py-2"
    >
      <div className="w-full px-6 sm:px-6 lg:max-w-7xl lg:mx-auto lg:px-8">
        {/* Mobile Layout - Single Match */}
        <div className="flex md:hidden items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-xs whitespace-nowrap">
              {t('sections.liveScores')}
            </span>
          </div>
          
          {liveMatches.length > 0 && (
            <motion.div
              key={liveMatches[currentMatchIndex]?.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 flex-1 justify-between mx-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full shadow-lg p-0.5 bg-white/10">
                    <img 
                      src={liveMatches[currentMatchIndex].homeLogo} 
                      alt={liveMatches[currentMatchIndex].homeTeam}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-team.png';
                      }}
                    />
                  </div>
                  <span className="text-white text-xs font-medium whitespace-nowrap">
                    {liveMatches[currentMatchIndex].homeTeam}
                  </span>
                </div>
                <span className="text-white font-bold text-xs whitespace-nowrap">
                  {liveMatches[currentMatchIndex].homeScore !== null && liveMatches[currentMatchIndex].awayScore !== null
                    ? `${liveMatches[currentMatchIndex].homeScore}-${liveMatches[currentMatchIndex].awayScore}` 
                    : 'vs'
                  }
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-white text-xs font-medium whitespace-nowrap">
                    {liveMatches[currentMatchIndex].awayTeam}
                  </span>
                  <div className="w-4 h-4 rounded-full shadow-lg p-0.5 bg-white/10">
                    <img 
                      src={liveMatches[currentMatchIndex].awayLogo} 
                      alt={liveMatches[currentMatchIndex].awayTeam}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-team.png';
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className={`text-xs font-medium ${getStatusColor(liveMatches[currentMatchIndex].status)}`}>
                {getStatusText(liveMatches[currentMatchIndex])}
              </div>
            </motion.div>
          )}
        </div>

        {/* Tablet Layout - Multiple Matches */}
        <div className="hidden md:flex lg:hidden items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-xs whitespace-nowrap">
              {t('sections.liveScores')}
            </span>
          </div>
          
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={scrollLeft}
              className="flex-shrink-0 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={scrollPosition <= 0}
            >
              <ChevronLeft className="w-3 h-3 text-white" />
            </button>
            
            <div 
              ref={scrollContainerRef}
              className="flex items-center gap-3 px-2 scrollbar-hide flex-1 overflow-x-auto"
            >
              {liveMatches.slice(0, 3).map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ 
                    opacity: index === currentMatchIndex ? 1 : 0.7,
                    scale: index === currentMatchIndex ? 1 : 0.95
                  }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all duration-300 flex-shrink-0 ${
                    index === currentMatchIndex ? 'bg-white/20' : 'bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full shadow-lg p-0.5 bg-white/10">
                        <img 
                          src={match.homeLogo} 
                          alt={match.homeTeam}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-team.png';
                          }}
                        />
                      </div>
                      <span className="text-white text-xs font-medium whitespace-nowrap">{match.homeTeam}</span>
                    </div>
                    <span className="text-white font-bold text-xs whitespace-nowrap">
                      {match.homeScore !== null && match.awayScore !== null
                        ? `${match.homeScore}-${match.awayScore}` 
                        : 'vs'
                      }
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-white text-xs font-medium whitespace-nowrap">{match.awayTeam}</span>
                      <div className="w-3 h-3 rounded-full shadow-lg p-0.5 bg-white/10">
                        <img 
                          src={match.awayLogo} 
                          alt={match.awayTeam}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-team.png';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      match.status === 'live' 
                        ? 'bg-red-500 text-white' 
                        : match.status === 'finished'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}>
                      {getStatusText(match)}
                    </span>
                    <span className="text-white text-xs">{match.league}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button
              onClick={scrollRight}
              className="flex-shrink-0 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={scrollPosition >= (scrollContainerRef.current?.scrollWidth || 0) - (scrollContainerRef.current?.clientWidth || 0)}
            >
              <ChevronRight className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        {/* Desktop Layout - All Matches */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Trophy className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-xs whitespace-nowrap">
              {t('sections.liveScores')}
            </span>
          </div>
          
          <button
            onClick={scrollLeft}
            className="flex-shrink-0 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          
          <div 
            ref={scrollContainerRef}
            className="flex items-center gap-4 px-3 scrollbar-hide overflow-x-auto min-w-0 flex-1"
            style={{ maxWidth: 'calc(100vw - 400px)' }}
          >
            {liveMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: index === currentMatchIndex ? 1 : 0.7,
                  scale: index === currentMatchIndex ? 1 : 0.95
                }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-3 px-3 py-1 rounded-lg transition-all duration-300 flex-shrink-0 ${
                  index === currentMatchIndex ? 'bg-white/20' : 'bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full shadow-lg p-0.5 bg-white/10">
                        <img 
                          src={match.homeLogo} 
                          alt={match.homeTeam}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-team.png';
                          }}
                        />
                      </div>
                      <span className="text-white text-xs font-medium whitespace-nowrap">{match.homeTeam}</span>
                    </div>
                    <span className="text-white font-bold text-xs whitespace-nowrap">
                      {match.homeScore !== null && match.awayScore !== null
                        ? `${match.homeScore}-${match.awayScore}` 
                        : 'vs'
                      }
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-white text-xs font-medium whitespace-nowrap">{match.awayTeam}</span>
                      <div className="w-4 h-4 rounded-full shadow-lg p-0.5 bg-white/10">
                        <img 
                          src={match.awayLogo} 
                          alt={match.awayTeam}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-team.png';
                          }}
                        />
                      </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    match.status === 'live' 
                      ? 'bg-red-500 text-white' 
                      : match.status === 'finished'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {getStatusText(match)}
                  </span>
                  <span className="text-white text-xs">{match.league}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button
            onClick={scrollRight}
            className="flex-shrink-0 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={scrollPosition >= (scrollContainerRef.current?.scrollWidth || 0) - (scrollContainerRef.current?.clientWidth || 0)}
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
          
          <button className="flex-shrink-0 text-white hover:text-purple-200 transition-colors flex items-center gap-1 text-xs px-2 py-1">
            {t('common.viewAll')} <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}