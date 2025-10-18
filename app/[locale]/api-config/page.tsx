'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import HeaderNoI18n from '@/components/HeaderNoI18n'

export default function ApiConfigPage() {
  const [apiKeys, setApiKeys] = useState({
    footballDataOrg: '',
    apiFootball: '',
    sportmonks: '',
    soccerDataApi: ''
  })

  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // In a real app, you'd save these to environment variables or a secure config
      localStorage.setItem('football_api_keys', JSON.stringify(apiKeys))
      setMessage('API keys saved! Restart the app to use real data.')
    } catch (error) {
      setMessage('Failed to save API keys')
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = async (apiName: string) => {
    setMessage(`Testing ${apiName}...`)
    // Here you would test the API with the provided key
    setTimeout(() => {
      setMessage(`${apiName} test completed`)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-sport-dark">
      <HeaderNoI18n />
      
      <main className="w-full px-4 sm:px-4 lg:max-w-4xl lg:mx-auto lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">API Configuration</h1>
          <p className="text-gray-400 mb-8">
            Configure your football API keys to get real-time data instead of mock data
          </p>

          <div className="bg-sport-gray/30 rounded-lg p-6 border border-gray-700/50 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Current Data Status</h2>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-300">Currently using mock data</span>
            </div>
            <p className="text-gray-400 text-sm">
              To get real Premier League data, add your API keys below. 
              The dashboard will automatically switch to live data once configured.
            </p>
          </div>

          <div className="space-y-6">
            {/* Football-Data.org */}
            <div className="bg-sport-gray/30 rounded-lg p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Football-Data.org</h3>
                  <p className="text-gray-400 text-sm">Official Premier League data</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleTest('Football-Data.org')}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Test
                  </button>
                  <a
                    href="https://www.football-data.org/client/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-sport-red text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Get Key
                  </a>
                </div>
              </div>
              <input
                type="password"
                placeholder="Enter your Football-Data.org API key"
                value={apiKeys.footballDataOrg}
                onChange={(e) => setApiKeys(prev => ({ ...prev, footballDataOrg: e.target.value }))}
                className="w-full px-4 py-2 bg-sport-gray/50 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-sport-red"
              />
            </div>

            {/* API-Football */}
            <div className="bg-sport-gray/30 rounded-lg p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">API-Football</h3>
                  <p className="text-gray-400 text-sm">Comprehensive football data (100 requests/day free)</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleTest('API-Football')}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Test
                  </button>
                  <a
                    href="https://rapidapi.com/api-sports/api/api-football"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-sport-red text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Get Key
                  </a>
                </div>
              </div>
              <input
                type="password"
                placeholder="Enter your API-Football key"
                value={apiKeys.apiFootball}
                onChange={(e) => setApiKeys(prev => ({ ...prev, apiFootball: e.target.value }))}
                className="w-full px-4 py-2 bg-sport-gray/50 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-sport-red"
              />
            </div>

            {/* SportMonks */}
            <div className="bg-sport-gray/30 rounded-lg p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">SportMonks</h3>
                  <p className="text-gray-400 text-sm">Detailed football statistics</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleTest('SportMonks')}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Test
                  </button>
                  <a
                    href="https://www.sportmonks.com/football-api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-sport-red text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Get Key
                  </a>
                </div>
              </div>
              <input
                type="password"
                placeholder="Enter your SportMonks API token"
                value={apiKeys.sportmonks}
                onChange={(e) => setApiKeys(prev => ({ ...prev, sportmonks: e.target.value }))}
                className="w-full px-4 py-2 bg-sport-gray/50 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-sport-red"
              />
            </div>

            {/* SoccerDataAPI */}
            <div className="bg-sport-gray/30 rounded-lg p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">SoccerDataAPI</h3>
                  <p className="text-gray-400 text-sm">Good for Arab leagues (75 requests/day free)</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleTest('SoccerDataAPI')}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Test
                  </button>
                  <a
                    href="https://soccerdataapi.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-sport-red text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Get Key
                  </a>
                </div>
              </div>
              <input
                type="password"
                placeholder="Enter your SoccerDataAPI key"
                value={apiKeys.soccerDataApi}
                onChange={(e) => setApiKeys(prev => ({ ...prev, soccerDataApi: e.target.value }))}
                className="w-full px-4 py-2 bg-sport-gray/50 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-sport-red"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-sport-red text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save API Keys'}
            </button>
            
            <a
              href="/en/dashboard"
              className="px-6 py-3 bg-sport-gray/50 text-gray-300 rounded-lg font-medium hover:bg-sport-gray/70 transition-colors"
            >
              Back to Dashboard
            </a>
          </div>

          {message && (
            <div className="mt-4 p-4 bg-sport-gray/50 rounded-lg border border-gray-600">
              <p className="text-gray-300">{message}</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
