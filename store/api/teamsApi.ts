import { baseApi } from './baseApi'
import { Team, League } from '@/lib/types'

export interface TeamsResponse {
  data: Team[]
  count: number
}

export interface TeamResponse {
  data: Team
}

export interface CreateTeamRequest {
  name: string
  name_ar: string
  logo_url?: string
  league: League
  country: string
  founded?: number
  stadium?: string
  website?: string
  social_media?: {
    twitter?: string
    instagram?: string
    facebook?: string
  }
}

export interface UpdateTeamRequest extends Partial<CreateTeamRequest> {
  id: string
}

export const teamsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all teams
    getTeams: builder.query<TeamsResponse, { league?: League; limit?: number }>({
      query: ({ league, limit = 50 }) => {
        const params = new URLSearchParams()
        if (league) params.append('league', `eq.${league}`)
        if (limit) params.append('limit', limit.toString())
        params.append('order', 'name_ar.asc')
        
        return `teams?${params.toString()}`
      },
      providesTags: ['Team'],
    }),

    // Get single team by ID
    getTeam: builder.query<TeamResponse, string>({
      query: (id) => `teams?id=eq.${id}&select=*`,
      transformResponse: (response: Team[]) => ({ data: response[0] }),
      providesTags: (result, error, id) => [{ type: 'Team', id }],
    }),

    // Get teams by league
    getTeamsByLeague: builder.query<TeamsResponse, League>({
      query: (league) => `teams?league=eq.${league}&order=name_ar.asc`,
      providesTags: ['Team'],
    }),

    // Search teams
    searchTeams: builder.query<TeamsResponse, { query: string; limit?: number }>({
      query: ({ query, limit = 10 }) => 
        `teams?or=(name.ilike.*${query}*,name_ar.ilike.*${query}*)&limit=${limit}&order=name_ar.asc`,
      providesTags: ['Team'],
    }),

    // Get popular teams (by article count)
    getPopularTeams: builder.query<TeamsResponse, { limit?: number }>({
      query: ({ limit = 10 }) => 
        `teams?limit=${limit}&order=created_at.desc`,
      providesTags: ['Team'],
    }),

    // Create team
    createTeam: builder.mutation<TeamResponse, CreateTeamRequest>({
      query: (team) => ({
        url: 'teams',
        method: 'POST',
        body: team,
      }),
      invalidatesTags: ['Team'],
    }),

    // Update team
    updateTeam: builder.mutation<TeamResponse, UpdateTeamRequest>({
      query: ({ id, ...updates }) => ({
        url: `teams?id=eq.${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Team', id }],
    }),

    // Delete team
    deleteTeam: builder.mutation<void, string>({
      query: (id) => ({
        url: `teams?id=eq.${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),

    // Get team statistics
    getTeamStats: builder.query<{
      data: {
        team: Team
        articleCount: number
        recentArticles: any[]
        socialMediaStats: any
      }
    }, string>({
      query: (teamId) => `teams?id=eq.${teamId}&select=*`,
      transformResponse: async (response: Team[], { dispatch }) => {
        const team = response[0]
        if (!team) return { data: null }

        // Get article count for this team
        const articlesResult = await dispatch(
          teamsApi.endpoints.getTeamArticles.initiate(teamId)
        )

        return {
          data: {
            team,
            articleCount: articlesResult.data?.count || 0,
            recentArticles: articlesResult.data?.data || [],
            socialMediaStats: team.social_media || {}
          }
        }
      },
      providesTags: (result, error, teamId) => [{ type: 'Team', id: teamId }],
    }),

    // Get team articles
    getTeamArticles: builder.query<{ data: any[]; count: number }, string>({
      query: (teamId) => `articles?related_team_ids=cs.{${teamId}}&order=published_at.desc`,
      providesTags: ['Team', 'Article'],
    }),
  }),
})

export const {
  useGetTeamsQuery,
  useGetTeamQuery,
  useGetTeamsByLeagueQuery,
  useSearchTeamsQuery,
  useGetPopularTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamStatsQuery,
  useGetTeamArticlesQuery,
} = teamsApi
