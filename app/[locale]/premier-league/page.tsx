'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeaderNoI18n from '@/components/HeaderNoI18n';
import { 
  Calendar, 
  Trophy, 
  Clock, 
  MapPin, 
  Users, 
  TrendingUp,
  RefreshCw,
  Star,
  Target,
  Activity
} from 'lucide-react';

interface PremierLeagueData {
  liveMatches: any[];
  todaysMatches: any[];
  thisWeekMatches: any[];
  nextWeekMatches: any[];
  thisMonthMatches: any[];
  standings: any[];
  teams: any[];
  lastUpdated: string;
  league: {
    id: number;
    name: string;
    country: string;
    season: number;
  };
  dateRanges: {
    weekAgo: string;
    today: string;
    nextWeek: string;
    nextMonth: string;
  };
}

interface Match {
  id: number;
  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };
  score: {
    home: number | null;
    away: number | null;
  };
  status: string;
  date: string;
  venue: {
    name: string;
    city: string;
  };
  league: {
    id: number;
    name: string;
    logo: string;
  };
}

interface Standing {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goalsFor: number;
  goalsAgainst: number;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  imageUrl?: string;
  category: string;
}

export default function PremierLeaguePage() {
  const [data, setData] = useState<PremierLeagueData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('live');

  const fetchPremierLeagueData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/football/premier-league');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      console.error('Error fetching Premier League data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPremierLeagueData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
      case '1h':
      case '2h':
        return 'bg-red-500';
      case 'finished':
        return 'bg-green-500';
      case 'scheduled':
      case 'not started':
        return 'bg-blue-500';
      case 'postponed':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case '1h':
        return '1st Half';
      case '2h':
        return '2nd Half';
      case 'ht':
        return 'Half Time';
      case 'ft':
        return 'Full Time';
      default:
        return status;
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-sport-dark">
        <HeaderNoI18n />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-sport-gold" />
              <p className="text-lg text-gray-300">Loading Premier League data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sport-dark">
        <HeaderNoI18n />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-lg mb-4">
                <p className="font-bold">Error loading data</p>
                <p>{error}</p>
              </div>
              <button 
                onClick={fetchPremierLeagueData}
                className="bg-sport-gold hover:bg-sport-gold/80 text-sport-dark px-6 py-2 rounded-lg font-medium transition-colors flex items-center mx-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sport-dark">
      <HeaderNoI18n />
      
      {/* Header */}
      <div className="bg-sport-gray/20 border-b border-sport-gray/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-sport-gold p-3 rounded-lg">
                <Trophy className="h-8 w-8 text-sport-dark" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Premier League</h1>
                <p className="text-gray-300">Live scores, fixtures, standings & news</p>
              </div>
            </div>
            <button 
              onClick={fetchPremierLeagueData} 
              disabled={loading}
              className="bg-sport-gold hover:bg-sport-gold/80 text-sport-dark px-6 py-2 rounded-lg font-medium transition-colors flex items-center disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          {data && (
            <p className="text-sm text-gray-400 mt-2">
              Last updated: {formatDate(data.lastUpdated)}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-sport-gray/20 p-1 rounded-lg overflow-x-auto">
          {[
            { id: 'live', label: 'Live', icon: Activity, count: data?.liveMatches?.length || 0 },
            { id: 'today', label: 'Today', icon: Clock, count: data?.todaysMatches?.length || 0 },
            { id: 'thisWeek', label: 'This Week', icon: Calendar, count: data?.thisWeekMatches?.length || 0 },
            { id: 'nextWeek', label: 'Next Week', icon: Calendar, count: data?.nextWeekMatches?.length || 0 },
            { id: 'thisMonth', label: 'This Month', icon: Calendar, count: data?.thisMonthMatches?.length || 0 },
            { id: 'standings', label: 'Standings', icon: Trophy },
            { id: 'teams', label: 'Teams', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-sport-gold text-sport-dark font-medium'
                  : 'text-gray-300 hover:text-white hover:bg-sport-gray/30'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Live Matches Tab */}
        {activeTab === 'live' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sport-gray/20 rounded-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Activity className="h-5 w-5 text-red-400" />
              <h2 className="text-xl font-bold text-white">Live Matches</h2>
            </div>
            
            {data?.liveMatches && data.liveMatches.length > 0 ? (
              <div className="space-y-4">
                {data.liveMatches.map((match: any) => (
                  <div key={match.fixture.id} className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-center">
                          <img 
                            src={match.teams.home.logo} 
                            alt={match.teams.home.name}
                            className="h-8 w-8 mx-auto mb-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-team.png';
                            }}
                          />
                          <p className="text-sm font-medium text-white">{match.teams.home.name}</p>
                        </div>
                        
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">
                                {match.goals.home !== null && match.goals.away !== null 
                                  ? `${match.goals.home} - ${match.goals.away}`
                                  : ''
                                }
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(match.fixture.status.short)} text-white`}>
                                {getStatusText(match.fixture.status.short)}
                              </span>
                            </div>
                        
                        <div className="text-center">
                          <img 
                            src={match.teams.away.logo} 
                            alt={match.teams.away.name}
                            className="h-8 w-8 mx-auto mb-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-team.png';
                            }}
                          />
                          <p className="text-sm font-medium text-white">{match.teams.away.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-300">
                        <div className="flex items-center space-x-1 mb-1">
                          <MapPin className="h-4 w-4" />
                          <span>{match.fixture.venue.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(match.fixture.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No live matches at the moment</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Today's Matches Tab */}
        {activeTab === 'today' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sport-gray/20 rounded-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Today's Matches</h2>
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {data?.todaysMatches?.length || 0}
              </span>
            </div>
            
            {data?.todaysMatches && data.todaysMatches.length > 0 ? (
              <div className="space-y-3">
                {data.todaysMatches.map((match: any) => (
                  <div key={match.fixture.id} className="bg-sport-gray/30 border border-sport-gray/50 rounded-lg p-4 hover:bg-sport-gray/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-center">
                          <img 
                            src={match.teams.home.logo} 
                            alt={match.teams.home.name}
                            className="h-8 w-8 mx-auto mb-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-team.png';
                            }}
                          />
                          <p className="text-sm font-medium text-white">{match.teams.home.name}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">
                            {match.goals.home !== null && match.goals.away !== null 
                                  ? `${match.goals.home} - ${match.goals.away}`
                                  : ''
                                }
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(match.fixture.status.short)} text-white`}>
                            {getStatusText(match.fixture.status.short)}
                          </span>
                        </div>
                        
                        <div className="text-center">
                          <img 
                            src={match.teams.away.logo} 
                            alt={match.teams.away.name}
                            className="h-8 w-8 mx-auto mb-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-team.png';
                            }}
                          />
                          <p className="text-sm font-medium text-white">{match.teams.away.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-300">
                        <div className="flex items-center space-x-1 mb-1">
                          <MapPin className="h-4 w-4" />
                          <span>{match.fixture.venue.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(match.fixture.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No matches today</p>
              </div>
            )}
          </motion.div>
        )}

        {/* This Week Matches Tab */}
        {activeTab === 'thisWeek' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sport-gray/20 rounded-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="h-5 w-5 text-green-400" />
              <h2 className="text-xl font-bold text-white">This Week's Matches</h2>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                {data?.thisWeekMatches?.length || 0}
              </span>
            </div>
            
            {data?.thisWeekMatches && data.thisWeekMatches.length > 0 ? (
              <div className="space-y-3">
                {data.thisWeekMatches.map((match: any) => (
                  <div key={match.fixture.id} className="bg-sport-gray/30 border border-sport-gray/50 rounded-lg p-4 hover:bg-sport-gray/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-center">
                          <img 
                            src={match.teams.home.logo} 
                            alt={match.teams.home.name}
                            className="h-8 w-8 mx-auto mb-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-team.png';
                            }}
                          />
                          <p className="text-sm font-medium text-white">{match.teams.home.name}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">
                            {match.goals.home !== null && match.goals.away !== null 
                                  ? `${match.goals.home} - ${match.goals.away}`
                                  : ''
                                }
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(match.fixture.status.short)} text-white`}>
                            {getStatusText(match.fixture.status.short)}
                          </span>
                        </div>
                        
                        <div className="text-center">
                          <img 
                            src={match.teams.away.logo} 
                            alt={match.teams.away.name}
                            className="h-8 w-8 mx-auto mb-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-team.png';
                            }}
                          />
                          <p className="text-sm font-medium text-white">{match.teams.away.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-300">
                        <div className="flex items-center space-x-1 mb-1">
                          <MapPin className="h-4 w-4" />
                          <span>{match.fixture.venue.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(match.fixture.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No matches this week</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Next Week Matches Tab */}
        {activeTab === 'nextWeek' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sport-gray/20 rounded-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="h-5 w-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Next Week's Matches</h2>
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                {data?.nextWeekMatches?.length || 0}
              </span>
            </div>
            
            {data?.nextWeekMatches && data.nextWeekMatches.length > 0 ? (
              <div className="space-y-3">
                {data.nextWeekMatches.map((match: any) => (
                  <div key={match.fixture.id} className="bg-sport-gray/30 border border-sport-gray/50 rounded-lg p-4 hover:bg-sport-gray/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-center">
                          <img 
                            src={match.teams.home.logo} 
                            alt={match.teams.home.name}
                            className="h-8 w-8 mx-auto mb-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-team.png';
                            }}
                          />
                          <p className="text-sm font-medium text-white">{match.teams.home.name}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-400">vs</div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(match.fixture.status.short)} text-white`}>
                            {getStatusText(match.fixture.status.short)}
                          </span>
                        </div>
                        
                        <div className="text-center">
                          <img 
                            src={match.teams.away.logo} 
                            alt={match.teams.away.name}
                            className="h-8 w-8 mx-auto mb-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-team.png';
                            }}
                          />
                          <p className="text-sm font-medium text-white">{match.teams.away.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-300">
                        <div className="flex items-center space-x-1 mb-1">
                          <MapPin className="h-4 w-4" />
                          <span>{match.fixture.venue.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(match.fixture.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No matches next week</p>
              </div>
            )}
          </motion.div>
        )}

        {/* This Month Matches Tab */}
        {activeTab === 'thisMonth' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sport-gray/20 rounded-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="h-5 w-5 text-orange-400" />
              <h2 className="text-xl font-bold text-white">This Month's Matches</h2>
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {data?.thisMonthMatches?.length || 0}
              </span>
            </div>
            
            {data?.thisMonthMatches && data.thisMonthMatches.length > 0 ? (
              <div className="space-y-3">
                {data.thisMonthMatches.map((match: any) => (
                  <div key={match.fixture.id} className="bg-sport-gray/30 border border-sport-gray/50 rounded-lg p-4 hover:bg-sport-gray/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-center">
                          <img 
                            src={match.teams.home.logo} 
                            alt={match.teams.home.name}
                            className="h-8 w-8 mx-auto mb-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-team.png';
                            }}
                          />
                          <p className="text-sm font-medium text-white">{match.teams.home.name}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">
                            {match.goals.home !== null && match.goals.away !== null 
                                  ? `${match.goals.home} - ${match.goals.away}`
                                  : ''
                                }
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(match.fixture.status.short)} text-white`}>
                            {getStatusText(match.fixture.status.short)}
                          </span>
                        </div>
                        
                        <div className="text-center">
                          <img 
                            src={match.teams.away.logo} 
                            alt={match.teams.away.name}
                            className="h-8 w-8 mx-auto mb-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-team.png';
                            }}
                          />
                          <p className="text-sm font-medium text-white">{match.teams.away.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-300">
                        <div className="flex items-center space-x-1 mb-1">
                          <MapPin className="h-4 w-4" />
                          <span>{match.fixture.venue.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(match.fixture.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No matches this month</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Fixtures Tab */}
        {activeTab === 'fixtures' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sport-gray/20 rounded-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Upcoming Fixtures</h2>
            </div>
            
            {data?.fixtures && data.fixtures.length > 0 ? (
              <div className="space-y-3">
                {data.fixtures.map((match: Match) => (
                  <div key={match.id} className="bg-sport-gray/30 border border-sport-gray/50 rounded-lg p-4 hover:bg-sport-gray/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-center">
                          <img 
                            src={match.homeTeam.logo} 
                            alt={match.homeTeam.name}
                            className="h-8 w-8 mx-auto mb-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-team.png';
                            }}
                          />
                          <p className="text-sm font-medium text-white">{match.homeTeam.name}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-400">vs</div>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-sport-gray/50 text-gray-300">
                            {getStatusText(match.status)}
                          </span>
                        </div>
                        
                        <div className="text-center">
                          <img 
                            src={match.awayTeam.logo} 
                            alt={match.awayTeam.name}
                            className="h-8 w-8 mx-auto mb-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-team.png';
                            }}
                          />
                          <p className="text-sm font-medium text-white">{match.awayTeam.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-300">
                        <div className="flex items-center space-x-1 mb-1">
                          <MapPin className="h-4 w-4" />
                          <span>{match.venue.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(match.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No upcoming fixtures</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Standings Tab */}
        {activeTab === 'standings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sport-gray/20 rounded-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">League Table</h2>
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                {data?.standings?.length || 0}
              </span>
            </div>
            
            {data?.standings && data.standings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-sport-gray/50">
                      <th className="text-left py-3 px-2 text-gray-300">#</th>
                      <th className="text-left py-3 px-2 text-gray-300">Team</th>
                      <th className="text-center py-3 px-2 text-gray-300">P</th>
                      <th className="text-center py-3 px-2 text-gray-300">W</th>
                      <th className="text-center py-3 px-2 text-gray-300">D</th>
                      <th className="text-center py-3 px-2 text-gray-300">L</th>
                      <th className="text-center py-3 px-2 text-gray-300">GF</th>
                      <th className="text-center py-3 px-2 text-gray-300">GA</th>
                      <th className="text-center py-3 px-2 text-gray-300">GD</th>
                      <th className="text-center py-3 px-2 font-bold text-gray-300">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.standings.map((team: any, index: number) => (
                      <tr key={team.team.id} className={`border-b border-sport-gray/30 hover:bg-sport-gray/30 ${index < 4 ? 'bg-green-900/20' : index < 6 ? 'bg-blue-900/20' : index >= data.standings.length - 3 ? 'bg-red-900/20' : ''}`}>
                        <td className="py-3 px-2 font-bold text-white">{team.rank}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-2">
                            <img 
                              src={team.team.logo} 
                              alt={team.team.name}
                              className="h-6 w-6"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-team.png';
                              }}
                            />
                            <span className="font-medium text-white">{team.team.name}</span>
                          </div>
                        </td>
                        <td className="text-center py-3 px-2 text-gray-300">{team.all.played}</td>
                        <td className="text-center py-3 px-2 text-green-400 font-medium">{team.all.win}</td>
                        <td className="text-center py-3 px-2 text-yellow-400 font-medium">{team.all.draw}</td>
                        <td className="text-center py-3 px-2 text-red-400 font-medium">{team.all.lose}</td>
                        <td className="text-center py-3 px-2 text-gray-300">{team.all.goals.for}</td>
                        <td className="text-center py-3 px-2 text-gray-300">{team.all.goals.against}</td>
                        <td className={`text-center py-3 px-2 font-medium ${team.goalsDiff > 0 ? 'text-green-400' : team.goalsDiff < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                          {team.goalsDiff > 0 ? '+' : ''}{team.goalsDiff}
                        </td>
                        <td className="text-center py-3 px-2 font-bold text-lg text-sport-gold">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Champions League</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Europa League</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Relegation</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No standings data available</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sport-gray/20 rounded-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Users className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Premier League Teams</h2>
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {data?.teams?.length || 0}
              </span>
            </div>
            
            {data?.teams && data.teams.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.teams.map((team: any) => (
                  <div key={team.team.id} className="bg-sport-gray/30 border border-sport-gray/50 rounded-lg p-4 hover:bg-sport-gray/40 transition-colors">
                    <div className="text-center">
                      <img 
                        src={team.team.logo} 
                        alt={team.team.name}
                        className="h-16 w-16 mx-auto mb-3"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-team.png';
                        }}
                      />
                      <h3 className="font-bold text-white mb-1">{team.team.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{team.team.country}</p>
                      {team.team.founded && (
                        <p className="text-gray-500 text-xs">Founded: {team.team.founded}</p>
                      )}
                      {team.venue && (
                        <div className="mt-2 text-xs text-gray-400">
                          <div className="flex items-center justify-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{team.venue.name}</span>
                          </div>
                          {team.venue.capacity && (
                            <p className="mt-1">Capacity: {team.venue.capacity.toLocaleString()}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No teams data available</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
