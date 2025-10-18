import { 
  FootballApiConfig, 
  FootballApi, 
  ApiResponse, 
  ApiTestResult, 
  NormalizedMatch, 
  FieldMapping,
  ApiClientConfig 
} from '@/lib/types/api'

// Default API client configuration
const DEFAULT_CONFIG: ApiClientConfig = {
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  rateLimitDelay: 2000
}

// Mock data for testing when APIs are not available
const MOCK_DATA = {
  'API-Football': {
    matches: [
      {
        fixture: {
          id: 12345,
          date: '2024-01-15T15:00:00Z',
          status: { short: 'LIVE' },
          venue: { name: 'Emirates Stadium' },
          referee: 'Michael Oliver'
        },
        league: {
          name: 'Premier League',
          season: 2024,
          round: 'Matchday 20'
        },
        teams: {
          home: { name: 'Arsenal' },
          away: { name: 'Chelsea' }
        },
        goals: {
          home: 2,
          away: 1
        }
      }
    ]
  },
  'Football-Data.org': {
    matches: [
      {
        id: 67890,
        utcDate: '2024-01-15T15:00:00Z',
        status: 'IN_PLAY',
        venue: 'Old Trafford',
        referees: [{ name: 'Anthony Taylor' }],
        competition: { name: 'Premier League' },
        season: { startDate: '2024-08-01' },
        matchday: 20,
        homeTeam: { name: 'Manchester United' },
        awayTeam: { name: 'Liverpool' },
        score: {
          fullTime: { home: 3, away: 2 }
        }
      }
    ]
  },
  'SportMonks Football API': {
    data: [
      {
        id: 999,
        league: { name: 'Champions League' },
        home_team: { name: 'Real Madrid' },
        away_team: { name: 'Bayern Munich' },
        time: '2024-01-15T20:00:00Z',
        status: 'FT',
        score: { home: 1, away: 1 }
      }
    ]
  },
  'SoccerDataAPI': {
    data: [
      {
        id: 111,
        league: { name: 'Saudi Pro League' },
        home: { name: 'Al Hilal' },
        away: { name: 'Al Nassr' },
        time: '2024-01-15T18:00:00Z',
        status: 'LIVE',
        score: { home: 2, away: 2 },
        minute: 88
      }
    ]
  },
  'ScoreBat Video API': {
    response: [
      {
        id: 222,
        title: 'Arsenal vs Chelsea Highlights',
        competition: 'Premier League',
        matchviewUrl: 'https://www.scorebat.com/arsenal-vs-chelsea-live-stream/',
        thumbnail: 'https://www.scorebat.com/og/arsenal-vs-chelsea.jpg',
        videos: [{ title: 'Highlights', embed: '<iframe src="..."></iframe>' }]
      }
    ]
  }
}

/**
 * Test all football APIs or a specific one
 */
export async function testFootballApis(
  config: FootballApiConfig, 
  specificApi?: string
): Promise<ApiTestResult[]> {
  const apisToTest = specificApi 
    ? config.apis.filter(api => api.name === specificApi)
    : config.apis

  const results: ApiTestResult[] = []

  for (const api of apisToTest) {
    try {
      const result = await testSingleApi(api, config)
      results.push(result)
    } catch (error) {
      results.push({
        apiName: api.name,
        status: 'error',
        responseTime: 0,
        dataCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }
  }

  return results
}

/**
 * Test a single API
 */
async function testSingleApi(
  api: FootballApi, 
  config: FootballApiConfig
): Promise<ApiTestResult> {
  const startTime = Date.now()
  
  try {
    // For demo purposes, we'll use mock data
    // In production, this would make actual API calls
    const response = await makeApiCall(api, config)
    const responseTime = Date.now() - startTime

    // Normalize the response data
    const normalizedData = normalizeApiResponse(
      response.data, 
      api.name, 
      config.field_mappings[api.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')]
    )

    return {
      apiName: api.name,
      status: response.success ? 'success' : 'error',
      responseTime,
      dataCount: normalizedData.length,
      rateLimit: response.rateLimit,
      error: response.error,
      timestamp: new Date().toISOString(),
      normalizedData,
      rawResponse: response.data
    }
  } catch (error) {
    return {
      apiName: api.name,
      status: 'error',
      responseTime: Date.now() - startTime,
      dataCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Make an API call (with mock data for demo)
 */
async function makeApiCall(api: FootballApi, config: FootballApiConfig): Promise<ApiResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))

  // Check if we should use mock data
  if (config.meta.mock_mode) {
    const mockData = MOCK_DATA[api.name as keyof typeof MOCK_DATA]
    if (mockData) {
      return {
        success: true,
        data: mockData,
        responseTime: Math.random() * 500 + 200,
        rateLimit: '100/day'
      }
    }
  }

  // In production, this would make real API calls
  try {
    const endpoint = api.endpoints.live_matches || api.endpoints.fixtures || Object.values(api.endpoints)[0]
    const url = `${api.base_url}${endpoint}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...api.headers
      },
      signal: AbortSignal.timeout(DEFAULT_CONFIG.timeout)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    const rateLimit = response.headers.get('X-RateLimit-Remaining')

    return {
      success: true,
      data,
      responseTime: 0, // Will be calculated by caller
      rateLimit: rateLimit || undefined
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'API call failed',
      responseTime: 0
    }
  }
}

/**
 * Normalize API response data to unified schema
 */
export function normalizeApiResponse(
  data: any, 
  apiName: string, 
  fieldMapping: FieldMapping
): NormalizedMatch[] {
  if (!data || !fieldMapping) return []

  // Extract matches from different API response structures
  let matches: any[] = []
  
  if (Array.isArray(data)) {
    matches = data
  } else if (data.matches && Array.isArray(data.matches)) {
    matches = data.matches
  } else if (data.data && Array.isArray(data.data)) {
    matches = data.data
  } else if (data.response && Array.isArray(data.response)) {
    matches = data.response
  }

  return matches.map(match => normalizeMatchData(match, apiName, fieldMapping))
}

/**
 * Normalize a single match data object
 */
function normalizeMatchData(
  match: any, 
  apiName: string, 
  fieldMapping: FieldMapping
): NormalizedMatch {
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  const normalized: NormalizedMatch = {
    match_id: getNestedValue(match, fieldMapping.match_id as string) || 'unknown',
    league: getNestedValue(match, fieldMapping.league as string) || 'Unknown League',
    home_team: getNestedValue(match, fieldMapping.home_team as string) || 'Unknown Team',
    away_team: getNestedValue(match, fieldMapping.away_team as string) || 'Unknown Team',
    status: normalizeStatus(getNestedValue(match, fieldMapping.status as string)),
    timestamp: getNestedValue(match, fieldMapping.timestamp as string) || new Date().toISOString(),
    api_source: apiName,
    raw_data: match
  }

  // Add optional fields if they exist in the mapping
  if (fieldMapping.score) {
    const scoreMapping = fieldMapping.score as { home: string; away: string }
    const homeScore = getNestedValue(match, scoreMapping.home)
    const awayScore = getNestedValue(match, scoreMapping.away)
    
    if (homeScore !== undefined || awayScore !== undefined) {
      normalized.score = {
        home: homeScore ?? null,
        away: awayScore ?? null
      }
    }
  }

  if (fieldMapping.venue) {
    normalized.venue = getNestedValue(match, fieldMapping.venue as string) || null
  }

  if (fieldMapping.referee) {
    normalized.referee = getNestedValue(match, fieldMapping.referee as string) || null
  }

  if (fieldMapping.season) {
    normalized.season = getNestedValue(match, fieldMapping.season as string) || null
  }

  if (fieldMapping.matchday) {
    normalized.matchday = getNestedValue(match, fieldMapping.matchday as string) || null
  }

  if (fieldMapping.competition_id) {
    normalized.competition_id = getNestedValue(match, fieldMapping.competition_id as string) || null
  }

  return normalized
}

/**
 * Normalize status values to standard format
 */
function normalizeStatus(status: string): NormalizedMatch['status'] {
  if (!status) return 'Scheduled'
  
  const statusMap: { [key: string]: NormalizedMatch['status'] } = {
    'LIVE': 'Live',
    'IN_PLAY': 'Live',
    'FT': 'Finished',
    'FINISHED': 'Finished',
    'POSTPONED': 'Postponed',
    'CANCELLED': 'Cancelled',
    'SCHEDULED': 'Scheduled',
    'NS': 'Scheduled'
  }

  return statusMap[status.toUpperCase()] || 'Scheduled'
}

/**
 * Get API configuration by name
 */
export function getApiConfig(config: FootballApiConfig, apiName: string): FootballApi | undefined {
  return config.apis.find(api => api.name === apiName)
}

/**
 * Get field mapping for specific API and data type
 */
export function getFieldMapping(
  config: FootballApiConfig, 
  apiName: string, 
  dataType: string = 'matches'
): FieldMapping | undefined {
  const normalizedApiName = apiName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
  return config.field_mappings[normalizedApiName]?.[dataType]
}
