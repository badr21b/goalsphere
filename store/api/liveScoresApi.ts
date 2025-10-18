import { baseApi } from './baseApi'
import { LiveScore } from '@/lib/types'

export interface LiveScoresResponse {
  data: LiveScore[]
  count: number
}

export interface LiveScoreResponse {
  data: LiveScore
}

export interface CreateLiveScoreRequest {
  home_team: string
  away_team: string
  home_score: number
  away_score: number
  status: 'live' | 'finished' | 'upcoming'
  league: string
  minute?: number
  start_time: string
}

export interface UpdateLiveScoreRequest extends Partial<CreateLiveScoreRequest> {
  id: string
}

export const liveScoresApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all live scores
    getLiveScores: builder.query<LiveScoresResponse, { 
      status?: 'live' | 'finished' | 'upcoming'
      league?: string
      limit?: number 
    }>({
      query: ({ status, league, limit = 20 }) => {
        const params = new URLSearchParams()
        if (status) params.append('status', `eq.${status}`)
        if (league) params.append('league', `eq.${league}`)
        if (limit) params.append('limit', limit.toString())
        params.append('order', 'start_time.desc')
        
        return `live_scores?${params.toString()}`
      },
      providesTags: ['LiveScore'],
    }),

    // Get single live score by ID
    getLiveScore: builder.query<LiveScoreResponse, string>({
      query: (id) => `live_scores?id=eq.${id}&select=*`,
      transformResponse: (response: LiveScore[]) => ({ data: response[0] }),
      providesTags: (result, error, id) => [{ type: 'LiveScore', id }],
    }),

    // Get live matches only
    getLiveMatches: builder.query<LiveScoresResponse, { limit?: number }>({
      query: ({ limit = 10 }) => 
        `live_scores?status=eq.live&limit=${limit}&order=start_time.asc`,
      providesTags: ['LiveScore'],
      // Mock data for UI development
      transformResponse: () => ({
        data: [
          {
            id: 'live1',
            homeTeam: 'مانشستر يونايتد',
            awayTeam: 'ليفربول',
            homeScore: 2,
            awayScore: 1,
            status: 'live' as const,
            league: 'الدوري الإنجليزي',
            minute: 67,
            startTime: new Date('2024-01-15T15:00:00Z')
          },
          {
            id: 'live2',
            homeTeam: 'ريال مدريد',
            awayTeam: 'برشلونة',
            homeScore: 1,
            awayScore: 0,
            status: 'live' as const,
            league: 'الدوري الإسباني',
            minute: 23,
            startTime: new Date('2024-01-15T17:30:00Z')
          },
          {
            id: 'live3',
            homeTeam: 'الهلال',
            awayTeam: 'النصر',
            homeScore: 3,
            awayScore: 1,
            status: 'finished' as const,
            league: 'الدوري السعودي',
            startTime: new Date('2024-01-15T13:00:00Z')
          }
        ],
        count: 3
      })
    }),

    // Get upcoming matches
    getUpcomingMatches: builder.query<LiveScoresResponse, { 
      league?: string
      limit?: number 
    }>({
      query: ({ league, limit = 10 }) => {
        const params = new URLSearchParams()
        params.append('status', 'eq.upcoming')
        if (league) params.append('league', `eq.${league}`)
        if (limit) params.append('limit', limit.toString())
        params.append('order', 'start_time.asc')
        
        return `live_scores?${params.toString()}`
      },
      providesTags: ['LiveScore'],
    }),

    // Get finished matches
    getFinishedMatches: builder.query<LiveScoresResponse, { 
      league?: string
      limit?: number 
    }>({
      query: ({ league, limit = 10 }) => {
        const params = new URLSearchParams()
        params.append('status', 'eq.finished')
        if (league) params.append('league', `eq.${league}`)
        if (limit) params.append('limit', limit.toString())
        params.append('order', 'start_time.desc')
        
        return `live_scores?${params.toString()}`
      },
      providesTags: ['LiveScore'],
    }),

    // Get matches by league
    getMatchesByLeague: builder.query<LiveScoresResponse, { 
      league: string
      status?: 'live' | 'finished' | 'upcoming'
      limit?: number 
    }>({
      query: ({ league, status, limit = 20 }) => {
        const params = new URLSearchParams()
        params.append('league', `eq.${league}`)
        if (status) params.append('status', `eq.${status}`)
        if (limit) params.append('limit', limit.toString())
        params.append('order', 'start_time.desc')
        
        return `live_scores?${params.toString()}`
      },
      providesTags: ['LiveScore'],
    }),

    // Create live score
    createLiveScore: builder.mutation<LiveScoreResponse, CreateLiveScoreRequest>({
      query: (liveScore) => ({
        url: 'live_scores',
        method: 'POST',
        body: liveScore,
      }),
      invalidatesTags: ['LiveScore'],
    }),

    // Update live score
    updateLiveScore: builder.mutation<LiveScoreResponse, UpdateLiveScoreRequest>({
      query: ({ id, ...updates }) => ({
        url: `live_scores?id=eq.${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'LiveScore', id }],
    }),

    // Delete live score
    deleteLiveScore: builder.mutation<void, string>({
      query: (id) => ({
        url: `live_scores?id=eq.${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LiveScore'],
    }),

    // Update match score
    updateMatchScore: builder.mutation<LiveScoreResponse, {
      id: string
      home_score: number
      away_score: number
      minute?: number
    }>({
      query: ({ id, home_score, away_score, minute }) => ({
        url: `live_scores?id=eq.${id}`,
        method: 'PATCH',
        body: { home_score, away_score, minute },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'LiveScore', id }],
    }),

    // Update match status
    updateMatchStatus: builder.mutation<LiveScoreResponse, {
      id: string
      status: 'live' | 'finished' | 'upcoming'
    }>({
      query: ({ id, status }) => ({
        url: `live_scores?id=eq.${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'LiveScore', id }],
    }),

    // Get today's matches
    getTodaysMatches: builder.query<LiveScoresResponse, { 
      league?: string
      limit?: number 
    }>({
      query: ({ league, limit = 20 }) => {
        const today = new Date().toISOString().split('T')[0]
        const params = new URLSearchParams()
        params.append('start_time', `gte.${today}T00:00:00`)
        params.append('start_time', `lte.${today}T23:59:59`)
        if (league) params.append('league', `eq.${league}`)
        if (limit) params.append('limit', limit.toString())
        params.append('order', 'start_time.asc')
        
        return `live_scores?${params.toString()}`
      },
      providesTags: ['LiveScore'],
    }),
  }),
})

export const {
  useGetLiveScoresQuery,
  useGetLiveScoreQuery,
  useGetLiveMatchesQuery,
  useGetUpcomingMatchesQuery,
  useGetFinishedMatchesQuery,
  useGetMatchesByLeagueQuery,
  useCreateLiveScoreMutation,
  useUpdateLiveScoreMutation,
  useDeleteLiveScoreMutation,
  useUpdateMatchScoreMutation,
  useUpdateMatchStatusMutation,
  useGetTodaysMatchesQuery,
} = liveScoresApi
