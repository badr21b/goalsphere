import { baseApi } from './baseApi'
import { AdUnit } from '@/lib/types'

export interface AdUnitsResponse {
  data: AdUnit[]
  count: number
}

export interface AdUnitResponse {
  data: AdUnit
}

export interface CreateAdUnitRequest {
  type: 'banner' | 'in-article' | 'video'
  position: 'header' | 'footer' | 'sidebar' | 'in-content'
  content: string
  is_active?: boolean
  target_category?: string
}

export interface UpdateAdUnitRequest extends Partial<CreateAdUnitRequest> {
  id: string
}

export interface AdClickRequest {
  ad_unit_id: string
  user_id?: string
  page_url: string
  timestamp: string
}

export const adUnitsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all ad units
    getAdUnits: builder.query<AdUnitsResponse, { 
      is_active?: boolean
      type?: 'banner' | 'in-article' | 'video'
      position?: 'header' | 'footer' | 'sidebar' | 'in-content'
      target_category?: string
    }>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        
        if (params.is_active !== undefined) searchParams.append('is_active', `eq.${params.is_active}`)
        if (params.type) searchParams.append('type', `eq.${params.type}`)
        if (params.position) searchParams.append('position', `eq.${params.position}`)
        if (params.target_category) searchParams.append('target_category', `eq.${params.target_category}`)
        
        searchParams.append('order', 'created_at.desc')
        
        return `ad_units?${searchParams.toString()}`
      },
      providesTags: ['AdUnit'],
    }),

    // Get single ad unit by ID
    getAdUnit: builder.query<AdUnitResponse, string>({
      query: (id) => `ad_units?id=eq.${id}&select=*`,
      transformResponse: (response: AdUnit[]) => ({ data: response[0] }),
      providesTags: (result, error, id) => [{ type: 'AdUnit', id }],
    }),

    // Get active ad units by position
    getActiveAdUnitsByPosition: builder.query<AdUnitsResponse, {
      position: 'header' | 'footer' | 'sidebar' | 'in-content'
      target_category?: string
    }>({
      query: ({ position, target_category }) => {
        const params = new URLSearchParams()
        params.append('is_active', 'eq.true')
        params.append('position', `eq.${position}`)
        if (target_category) params.append('target_category', `eq.${target_category}`)
        params.append('order', 'created_at.desc')
        
        return `ad_units?${params.toString()}`
      },
      providesTags: ['AdUnit'],
      // Mock data for UI development
      transformResponse: () => ({
        data: [
          {
            id: 'ad1',
            type: 'banner' as const,
            position: 'header' as const,
            content: 'شاهد جميع مباريات الدوري الإنجليزي والدوري السعودي على قناتنا الرياضية',
            isActive: true,
            targetCategory: undefined
          },
          {
            id: 'ad2',
            type: 'banner' as const,
            position: 'footer' as const,
            content: 'احصل على آخر أخبار كرة القدم والنتائج المباشرة',
            isActive: true,
            targetCategory: undefined
          },
          {
            id: 'ad3',
            type: 'banner' as const,
            position: 'in-content' as const,
            content: 'تابع جميع مباريات الدوري السعودي والبطولات الأوروبية',
            isActive: true,
            targetCategory: undefined
          }
        ],
        count: 3
      })
    }),

    // Get in-article ads for content injection
    getInArticleAds: builder.query<AdUnitsResponse, { 
      target_category?: string
      limit?: number 
    }>({
      query: ({ target_category, limit = 5 }) => {
        const params = new URLSearchParams()
        params.append('is_active', 'eq.true')
        params.append('type', 'eq.in-article')
        if (target_category) params.append('target_category', `eq.${target_category}`)
        if (limit) params.append('limit', limit.toString())
        params.append('order', 'created_at.desc')
        
        return `ad_units?${params.toString()}`
      },
      providesTags: ['AdUnit'],
    }),

    // Get banner ads
    getBannerAds: builder.query<AdUnitsResponse, { 
      position?: 'header' | 'footer' | 'in-content'
      target_category?: string
    }>({
      query: ({ position, target_category }) => {
        const params = new URLSearchParams()
        params.append('is_active', 'eq.true')
        params.append('type', 'eq.banner')
        if (position) params.append('position', `eq.${position}`)
        if (target_category) params.append('target_category', `eq.${target_category}`)
        params.append('order', 'created_at.desc')
        
        return `ad_units?${params.toString()}`
      },
      providesTags: ['AdUnit'],
      // Mock data for UI development
      transformResponse: (response, meta, arg) => {
        const allAds = [
          {
            id: 'ad1',
            type: 'banner' as const,
            position: 'header' as const,
            content: 'شاهد جميع مباريات الدوري الإنجليزي والدوري السعودي على قناتنا الرياضية',
            isActive: true,
            targetCategory: undefined
          },
          {
            id: 'ad2',
            type: 'banner' as const,
            position: 'footer' as const,
            content: 'احصل على آخر أخبار كرة القدم والنتائج المباشرة',
            isActive: true,
            targetCategory: undefined
          },
          {
            id: 'ad3',
            type: 'banner' as const,
            position: 'in-content' as const,
            content: 'تابع جميع مباريات الدوري السعودي والبطولات الأوروبية',
            isActive: true,
            targetCategory: undefined
          }
        ]
        
        // Filter by position if specified
        const filteredAds = arg.position 
          ? allAds.filter(ad => ad.position === arg.position)
          : allAds
          
        return {
          data: filteredAds,
          count: filteredAds.length
        }
      }
    }),

    // Create ad unit
    createAdUnit: builder.mutation<AdUnitResponse, CreateAdUnitRequest>({
      query: (adUnit) => ({
        url: 'ad_units',
        method: 'POST',
        body: adUnit,
      }),
      invalidatesTags: ['AdUnit'],
    }),

    // Update ad unit
    updateAdUnit: builder.mutation<AdUnitResponse, UpdateAdUnitRequest>({
      query: ({ id, ...updates }) => ({
        url: `ad_units?id=eq.${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AdUnit', id }],
    }),

    // Delete ad unit
    deleteAdUnit: builder.mutation<void, string>({
      query: (id) => ({
        url: `ad_units?id=eq.${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdUnit'],
    }),

    // Toggle ad unit active status
    toggleAdUnitStatus: builder.mutation<AdUnitResponse, string>({
      query: (id) => ({
        url: `ad_units?id=eq.${id}`,
        method: 'PATCH',
        body: { is_active: 'not.is_active' },
      }),
      invalidatesTags: (result, error, id) => [{ type: 'AdUnit', id }],
    }),

    // Track ad click
    trackAdClick: builder.mutation<void, AdClickRequest>({
      query: (clickData) => ({
        url: 'ad_clicks',
        method: 'POST',
        body: clickData,
      }),
      // Don't invalidate tags for analytics data
    }),

    // Get ad performance stats
    getAdPerformance: builder.query<{
      data: {
        ad_unit: AdUnit
        click_count: number
        impression_count: number
        ctr: number
        revenue: number
      }[]
    }, { 
      ad_unit_id?: string
      date_from?: string
      date_to?: string
    }>({
      query: ({ ad_unit_id, date_from, date_to }) => {
        const params = new URLSearchParams()
        if (ad_unit_id) params.append('ad_unit_id', `eq.${ad_unit_id}`)
        if (date_from) params.append('timestamp', `gte.${date_from}`)
        if (date_to) params.append('timestamp', `lte.${date_to}`)
        
        return `ad_performance?${params.toString()}`
      },
      providesTags: ['AdUnit'],
    }),
  }),
})

export const {
  useGetAdUnitsQuery,
  useGetAdUnitQuery,
  useGetActiveAdUnitsByPositionQuery,
  useGetInArticleAdsQuery,
  useGetBannerAdsQuery,
  useCreateAdUnitMutation,
  useUpdateAdUnitMutation,
  useDeleteAdUnitMutation,
  useToggleAdUnitStatusMutation,
  useTrackAdClickMutation,
  useGetAdPerformanceQuery,
} = adUnitsApi
