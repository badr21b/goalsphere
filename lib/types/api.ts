// API Configuration Types
export interface FootballApiConfig {
  meta: {
    project: string
    description: string
    version: string
    target_storage: string
    mock_mode: boolean
  }
  unified_schema: {
    matches: DataSchema
    teams: DataSchema
    leagues: DataSchema
    videos: DataSchema
    standings: DataSchema
  }
  field_mappings: {
    [apiName: string]: {
      [dataType: string]: FieldMapping
    }
  }
  supabase_tables: {
    [tableName: string]: {
      columns: { [columnName: string]: string }
      indexes: string[]
    }
  }
  implementation_guide: {
    description: string
    steps: string[]
    code_examples: { [key: string]: string }
  }
  error_handling: {
    description: string
    rate_limits: { [apiName: string]: string }
    common_errors: { [errorType: string]: string }
  }
  apis: FootballApi[]
}

export interface FootballApi {
  name: string
  base_url: string
  free_tier: string
  coverage: string[]
  endpoints: { [endpointName: string]: string }
  headers: { [headerName: string]: string }
  response_mock: any
  integration_notes: string
}

// Football Data Types
export interface FootballMatch {
  fixture: {
    id: number
    referee: string
    timezone: string
    date: string
    timestamp: number
    periods: {
      first: number
      second: number
    }
    venue: {
      id: number
      name: string
      city: string
    }
    status: {
      long: string
      short: string
      elapsed: number | null
      extra: number | null
    }
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string
    season: number
    round: string
    standings: boolean
  }
  teams: {
    home: {
      id: number
      name: string
      logo: string
    }
    away: {
      id: number
      name: string
      logo: string
    }
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: {
    halftime: {
      home: number | null
      away: number | null
    }
    fulltime: {
      home: number | null
      away: number | null
    }
    extratime: {
      home: number | null
      away: number | null
    }
    penalty: {
      home: number | null
      away: number | null
    }
  }
}

export interface LeagueStanding {
  rank: number
  team: {
    id: number
    name: string
    logo: string
  }
  points: number
  goalsDiff: number
  group: string
  form: string
  status: string
  description: string
  all: {
    played: number
    win: number
    draw: number
    lose: number
    goals: {
      for: number
      against: number
    }
  }
  home: {
    played: number
    win: number
    draw: number
    lose: number
    goals: {
      for: number
      against: number
    }
  }
  away: {
    played: number
    win: number
    draw: number
    lose: number
    goals: {
      for: number
      against: number
    }
  }
}

export interface NewsArticle {
  id: string
  title: string
  content: string
  summary: string
  category: string
  publishedAt: string
  thumbnail: string
  tags: string[]
  source: string
}

export interface DataSchema {
  description: string
  required_fields: string[]
  optional_fields: string[]
  schema: { [fieldName: string]: any }
}

export interface FieldMapping {
  [unifiedField: string]: string | { [subField: string]: string }
}

// API Response Types
export interface ApiResponse {
  success: boolean
  data?: any
  error?: string
  statusCode?: number
  rateLimit?: string
  responseTime: number
}

// Normalized Data Types
export interface NormalizedMatch {
  match_id: string | number
  league: string
  home_team: string
  away_team: string
  status: 'Scheduled' | 'Live' | 'Finished' | 'Postponed' | 'Cancelled'
  timestamp: string
  score?: {
    home: number | null
    away: number | null
    half_time?: {
      home: number | null
      away: number | null
    }
  }
  venue?: string | null
  referee?: string | null
  season?: string | number
  matchday?: number | null
  competition_id?: string | number | null
  api_source: string
  raw_data: any
}

export interface NormalizedTeam {
  team_id: string | number
  name: string
  league: string
  logo?: string | null
  country?: string | null
  founded?: number | null
  venue?: string | null
  website?: string | null
  api_source: string
  raw_data: any
}

export interface NormalizedLeague {
  league_id: string | number
  name: string
  country: string
  logo?: string | null
  type?: string | null
  season?: string | number | null
  current_matchday?: number | null
  api_source: string
  raw_data: any
}

export interface NormalizedVideo {
  video_id: string | number
  title: string
  competition: string
  embed_url: string
  thumbnail?: string | null
  duration?: number | null
  description?: string | null
  match_id?: string | number | null
  api_source: string
  raw_data: any
}

export interface NormalizedStanding {
  team_id: string | number
  position: number
  points: number
  league: string
  played?: number | null
  won?: number | null
  drawn?: number | null
  lost?: number | null
  goals_for?: number | null
  goals_against?: number | null
  goal_difference?: number | null
  api_source: string
  raw_data: any
}

// Test Result Types
export interface ApiTestResult {
  apiName: string
  status: 'success' | 'error' | 'rate_limited' | 'timeout'
  responseTime: number
  dataCount: number
  rateLimit?: string
  error?: string
  timestamp: string
  normalizedData?: NormalizedMatch[]
  rawResponse?: any
}

// API Client Configuration
export interface ApiClientConfig {
  timeout: number
  retryAttempts: number
  retryDelay: number
  rateLimitDelay: number
}

// Rate Limit Information
export interface RateLimitInfo {
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
}
