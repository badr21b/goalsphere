'use client';

import { useState, useEffect } from 'react';
import { geminiFootballDataService, GeminiFootballData } from '@/lib/services/geminiFootballDataService';

export default function GeminiTestPage() {
  const [data, setData] = useState<GeminiFootballData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await geminiFootballDataService.getAllData();
      setData(result);
      setLastUpdated(result.lastUpdated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Gemini AI Football Data Test</h1>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-lg">Loading AI-powered data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Gemini AI Football Data Test</h1>
          <div className="bg-red-900 border border-red-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-red-200">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gemini AI Football Data Test</h1>
          <div className="flex gap-4">
            <button
              onClick={fetchData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Refresh Data
            </button>
            <button
              onClick={() => geminiFootballDataService.clearCache()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Clear Cache
            </button>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-300">
            Last updated: {formatTime(lastUpdated)} | 
            Cache entries: {geminiFootballDataService.getCacheStats().size}
          </p>
        </div>

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Live Matches */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Live Matches</h2>
              {data.liveMatches.length > 0 ? (
                <div className="space-y-4">
                  {data.liveMatches.map((match) => (
                    <div key={match.match_id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">
                            {match.home_team} vs {match.away_team}
                          </div>
                          <div className="text-sm text-gray-300">{match.league}</div>
                          <div className="text-sm text-gray-400">{match.venue}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">
                            {match.score ? `${match.score.home} - ${match.score.away}` : 'TBD'}
                          </div>
                          <div className="text-sm text-green-300">{match.status}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No live matches currently</p>
              )}
            </div>

            {/* Today's Matches */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">Today's Fixtures</h2>
              {data.todaysMatches.length > 0 ? (
                <div className="space-y-4">
                  {data.todaysMatches.map((match) => (
                    <div key={match.match_id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">
                            {match.home_team} vs {match.away_team}
                          </div>
                          <div className="text-sm text-gray-300">{match.league}</div>
                          <div className="text-sm text-gray-400">{match.venue}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-300">
                            {formatTime(match.timestamp)}
                          </div>
                          <div className="text-sm text-blue-300">{match.status}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No matches scheduled for today</p>
              )}
            </div>

            {/* News */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">AI-Generated News</h2>
              <div className="space-y-4">
                {data.news.map((article, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-300 mb-2">{article.summary}</p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{article.category}</span>
                      <span>{formatTime(article.publishedAt)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {article.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-purple-600 text-purple-100 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured News */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">Featured News</h2>
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">{data.featuredNews.title}</h3>
                <p className="text-sm text-gray-300 mb-2">{data.featuredNews.summary}</p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{data.featuredNews.category}</span>
                  <span>{formatTime(data.featuredNews.publishedAt)}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {data.featuredNews.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Standings */}
            <div className="bg-gray-800 rounded-lg p-6 lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4 text-orange-400">League Standings</h2>
              {data.standings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-2">Pos</th>
                        <th className="text-left py-2">Team</th>
                        <th className="text-center py-2">P</th>
                        <th className="text-center py-2">W</th>
                        <th className="text-center py-2">D</th>
                        <th className="text-center py-2">L</th>
                        <th className="text-center py-2">GF</th>
                        <th className="text-center py-2">GA</th>
                        <th className="text-center py-2">GD</th>
                        <th className="text-center py-2">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.standings.slice(0, 10).map((team, index) => (
                        <tr key={team.team_id || index} className="border-b border-gray-700">
                          <td className="py-2">{team.position}</td>
                          <td className="py-2 font-medium">{team.team_name}</td>
                          <td className="py-2 text-center">{team.played}</td>
                          <td className="py-2 text-center">{team.won}</td>
                          <td className="py-2 text-center">{team.drawn}</td>
                          <td className="py-2 text-center">{team.lost}</td>
                          <td className="py-2 text-center">{team.goals_for}</td>
                          <td className="py-2 text-center">{team.goals_against}</td>
                          <td className="py-2 text-center">{team.goal_difference}</td>
                          <td className="py-2 text-center font-bold">{team.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No standings data available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
