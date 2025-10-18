'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import HeaderNoI18n from '@/components/HeaderNoI18n'
import { useTranslations } from '@/hooks/useTranslations'
import { FootballApiConfig, ApiResponse, NormalizedMatch, ApiTestResult, FootballApi, DataSchema } from '@/lib/types/api'
import { testFootballApis } from '@/lib/services/apiTestService'

export default function ApiTestPage() {
  const t = useTranslations()
  const [apiConfig, setApiConfig] = useState<FootballApiConfig | null>(null)
  const [testResults, setTestResults] = useState<ApiTestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedApi, setSelectedApi] = useState<string | null>(null)
  const [normalizedData, setNormalizedData] = useState<NormalizedMatch[]>([])

  // Load API configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/football_apis_config.json')
        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.status} ${response.statusText}`)
        }
        const config = await response.json()
        setApiConfig(config)
      } catch (error) {
        console.error('Failed to load API configuration:', error)
        // Set a fallback config for demo purposes
        setApiConfig({
          meta: {
            project: "Global Football News & Live Data Aggregator",
            description: "Configuration of free and freemium football APIs",
            version: "1.0",
            target_storage: "Supabase",
            mock_mode: true
          },
          unified_schema: {
            matches: { description: "", required_fields: [], optional_fields: [], schema: {} },
            teams: { description: "", required_fields: [], optional_fields: [], schema: {} },
            leagues: { description: "", required_fields: [], optional_fields: [], schema: {} },
            videos: { description: "", required_fields: [], optional_fields: [], schema: {} },
            standings: { description: "", required_fields: [], optional_fields: [], schema: {} }
          },
          field_mappings: {},
          supabase_tables: {},
          implementation_guide: { description: "", steps: [], code_examples: {} },
          error_handling: { description: "", rate_limits: {}, common_errors: {} },
          apis: []
        })
      }
    }
    loadConfig()
  }, [])

  const runApiTests = async () => {
    if (!apiConfig) return

    setIsLoading(true)
    setTestResults([])
    setNormalizedData([])

    try {
      const results = await testFootballApis(apiConfig)
      setTestResults(results)
      
      // Collect all normalized data
      const allNormalizedData: NormalizedMatch[] = []
      results.forEach((result: ApiTestResult) => {
        if (result.normalizedData) {
          allNormalizedData.push(...result.normalizedData)
        }
      })
      setNormalizedData(allNormalizedData)
    } catch (error) {
      console.error('API testing failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const testSingleApi = async (apiName: string) => {
    if (!apiConfig) return

    setIsLoading(true)
    try {
      const api = apiConfig.apis.find((a: FootballApi) => a.name === apiName)
      if (!api) return

      const result = await testFootballApis(apiConfig, apiName)
      setTestResults(prev => {
        const filtered = prev.filter(r => r.apiName !== apiName)
        return [...filtered, ...result]
      })
    } catch (error) {
      console.error(`Failed to test ${apiName}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400'
      case 'error': return 'text-red-400'
      case 'rate_limited': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'rate_limited': return '⚠️'
      default: return '⏳'
    }
  }

  return (
    <div className="min-h-screen bg-sport-dark">
      {/* Header */}
      <HeaderNoI18n />

      {/* Main Content */}
      <main className="w-full px-4 sm:px-4 lg:max-w-7xl lg:mx-auto lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Football APIs Test Center</h1>
          <p className="text-gray-400 mb-6">
            Test and validate football APIs using our unified configuration system
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={runApiTests}
              disabled={isLoading || !apiConfig}
              className="px-6 py-3 bg-sport-red text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Testing APIs...' : 'Test All APIs'}
            </button>
            
            {apiConfig && (
              <div className="flex flex-wrap gap-2">
                {apiConfig.apis.map((api: FootballApi) => (
                  <button
                    key={api.name}
                    onClick={() => testSingleApi(api.name)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-sport-gray/50 text-gray-300 rounded-lg text-sm hover:bg-sport-gray/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Test {api.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* API Configuration Overview */}
        {apiConfig && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Available APIs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apiConfig.apis.map((api: FootballApi) => (
                <div key={api.name} className="bg-sport-gray/30 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-2">{api.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{api.free_tier}</p>
                  <div className="text-xs text-gray-500 mb-3">
                    <p>Coverage: {api.coverage.slice(0, 3).join(', ')}</p>
                    {api.coverage.length > 3 && (
                      <p>+{api.coverage.length - 3} more leagues</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedApi(selectedApi === api.name ? null : api.name)}
                    className="text-sport-red hover:text-red-400 text-sm font-medium"
                  >
                    {selectedApi === api.name ? 'Hide Details' : 'View Details'}
                  </button>
                  
                  {selectedApi === api.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-gray-700/50"
                    >
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-gray-400">Base URL:</span>
                          <p className="text-gray-300 font-mono">{api.base_url}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Endpoints:</span>
                          <ul className="list-disc list-inside text-gray-300 ml-2">
                            {Object.entries(api.endpoints).map(([key, value]) => (
                              <li key={key}>{key}: {value}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-gray-400">Integration Notes:</span>
                          <p className="text-gray-300">{api.integration_notes}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Test Results</h2>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="bg-sport-gray/30 rounded-lg p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{result.apiName}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getStatusIcon(result.status)}</span>
                      <span className={`font-medium ${getStatusColor(result.status)}`}>
                        {result.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Response Time:</span>
                      <span className="text-white ml-2">{result.responseTime}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Data Points:</span>
                      <span className="text-white ml-2">{result.dataCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Rate Limit:</span>
                      <span className="text-white ml-2">{result.rateLimit || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Updated:</span>
                      <span className="text-white ml-2">{new Date(result.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  {result.error && (
                    <div className="mt-3 p-3 bg-red-900/20 border border-red-700/50 rounded">
                      <p className="text-red-400 text-sm">{result.error}</p>
                    </div>
                  )}

                  {result.normalizedData && result.normalizedData.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Sample Normalized Data:</h4>
                      <div className="bg-sport-gray/50 rounded p-3 max-h-40 overflow-y-auto">
                        <pre className="text-xs text-gray-300">
                          {JSON.stringify(result.normalizedData.slice(0, 2), null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Normalized Data Summary */}
        {normalizedData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Unified Data Summary</h2>
            <div className="bg-sport-gray/30 rounded-lg p-4 border border-gray-700/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sport-red">{normalizedData.length}</div>
                  <div className="text-sm text-gray-400">Total Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sport-red">
                    {new Set(normalizedData.map(m => m.league)).size}
                  </div>
                  <div className="text-sm text-gray-400">Unique Leagues</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sport-red">
                    {new Set(normalizedData.map(m => m.api_source)).size}
                  </div>
                  <div className="text-sm text-gray-400">API Sources</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                <p>All data has been normalized using our unified schema and is ready for Supabase integration.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Unified Schema Information */}
        {apiConfig && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Unified Schema</h2>
            <div className="bg-sport-gray/30 rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-400 mb-4">
                Our unified schema ensures consistent data structure across all APIs:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {Object.entries(apiConfig.unified_schema).map(([key, schema]: [string, DataSchema]) => (
                  <div key={key} className="bg-sport-gray/50 rounded p-3">
                    <h4 className="font-semibold text-white mb-2 capitalize">{key}</h4>
                    <div className="space-y-1">
                      <div>
                        <span className="text-gray-400">Required:</span>
                        <span className="text-gray-300 ml-2">{schema.required_fields.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Optional:</span>
                        <span className="text-gray-300 ml-2">{schema.optional_fields.slice(0, 3).join(', ')}</span>
                        {schema.optional_fields.length > 3 && (
                          <span className="text-gray-500"> +{schema.optional_fields.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
