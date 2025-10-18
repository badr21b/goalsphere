import { baseApi } from './baseApi'
import { Article, ArticleCategory } from '@/lib/types'

export interface ArticlesResponse {
  data: Article[]
  count: number
  page: number
  limit: number
}

export interface ArticlesQuery {
  page?: number
  limit?: number
  category?: ArticleCategory
  isBreaking?: boolean
  search?: string
  sortBy?: 'published_at' | 'views' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export interface ArticleResponse {
  data: Article
}

export interface CreateArticleRequest {
  title: string
  body: string
  image_url?: string
  published_at: string
  source: string
  category: ArticleCategory
  related_team_ids?: string[]
  related_player_ids?: string[]
  is_breaking?: boolean
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  id: string
}

export const articlesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get articles with pagination and filters
    getArticles: builder.query<ArticlesResponse, ArticlesQuery>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        
        if (params.page) searchParams.append('offset', ((params.page - 1) * (params.limit || 10)).toString())
        if (params.limit) searchParams.append('limit', params.limit.toString())
        if (params.category) searchParams.append('category', `eq.${params.category}`)
        if (params.isBreaking !== undefined) searchParams.append('is_breaking', `eq.${params.isBreaking}`)
        if (params.search) searchParams.append('title', `ilike.*${params.search}*`)
        if (params.sortBy) searchParams.append('order', `${params.sortBy}.${params.sortOrder || 'desc'}`)
        
        return `articles?${searchParams.toString()}`
      },
      providesTags: ['Article'],
      // Mock data for UI development
      transformResponse: () => ({
        data: [
          {
            id: '3',
            title: 'مانشستر سيتي يهزم أرسنال 2-1 في الديربي',
            body: 'تغلب مانشستر سيتي على أرسنال بنتيجة 2-1 في مباراة مثيرة جمعت بين الفريقين على ملعب الإمارات في الجولة الـ15 من الدوري الإنجليزي.',
            imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
            publishedAt: new Date('2024-01-13T16:30:00Z'),
            source: 'GoalSphere',
            category: 'premier-league' as ArticleCategory,
            relatedTeamIds: [],
            relatedPlayerIds: [],
            isBreaking: false,
            views: 67000,
            createdAt: new Date('2024-01-13T16:30:00Z'),
            updatedAt: new Date('2024-01-13T16:30:00Z')
          },
          {
            id: '4',
            title: 'ريال مدريد يتأهل لدور الـ16 من دوري الأبطال',
            body: 'تأهل ريال مدريد رسمياً إلى دور الـ16 من دوري أبطال أوروبا بعد فوزه على نابولي 3-1 في المباراة الأخيرة من مرحلة المجموعات.',
            imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
            publishedAt: new Date('2024-01-12T20:15:00Z'),
            source: 'GoalSphere',
            category: 'champions-league' as ArticleCategory,
            relatedTeamIds: [],
            relatedPlayerIds: [],
            isBreaking: false,
            views: 54000,
            createdAt: new Date('2024-01-12T20:15:00Z'),
            updatedAt: new Date('2024-01-12T20:15:00Z')
          },
          {
            id: '5',
            title: 'تحليل: لماذا فشل برشلونة هذا الموسم؟',
            body: 'تحليل شامل لأسباب تراجع أداء نادي برشلونة هذا الموسم في الدوري الإسباني ودوري أبطال أوروبا، مع التركيز على المشاكل الإدارية والمالية.',
            imageUrl: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop',
            publishedAt: new Date('2024-01-11T14:20:00Z'),
            source: 'GoalSphere',
            category: 'analysis' as ArticleCategory,
            relatedTeamIds: [],
            relatedPlayerIds: [],
            isBreaking: false,
            views: 32000,
            createdAt: new Date('2024-01-11T14:20:00Z'),
            updatedAt: new Date('2024-01-11T14:20:00Z')
          }
        ],
        count: 3,
        page: 1,
        limit: 12
      })
    }),

    // Get single article by ID
    getArticle: builder.query<ArticleResponse, string>({
      query: (id) => `articles?id=eq.${id}&select=*`,
      transformResponse: (response: Article[]) => ({ data: response[0] }),
      providesTags: (result, error, id) => [{ type: 'Article', id }],
    }),

    // Get breaking news
    getBreakingNews: builder.query<ArticlesResponse, { limit?: number }>({
      query: ({ limit = 5 }) => `articles?is_breaking=eq.true&limit=${limit}&order=published_at.desc`,
      providesTags: ['Article'],
      // Mock data for UI development
      transformResponse: () => ({
        data: [
          {
            id: '1',
            title: 'انتقال ميسي إلى إنتر ميامي رسمياً',
            body: 'أعلن نادي إنتر ميامي الأمريكي رسمياً عن التعاقد مع النجم الأرجنتيني ليونيل ميسي لمدة عامين مع إمكانية التمديد لسنة ثالثة.',
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
            publishedAt: new Date('2024-01-15T10:30:00Z'),
            source: 'GoalSphere',
            category: 'breaking' as ArticleCategory,
            relatedTeamIds: [],
            relatedPlayerIds: [],
            isBreaking: true,
            views: 125000,
            createdAt: new Date('2024-01-15T10:30:00Z'),
            updatedAt: new Date('2024-01-15T10:30:00Z')
          },
          {
            id: '2',
            title: 'الهلال يتوج بلقب الدوري السعودي',
            body: 'توج نادي الهلال بلقب الدوري السعودي للمحترفين للمرة الـ19 في تاريخه بعد فوزه على النصر 3-1 في المباراة النهائية.',
            imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop',
            publishedAt: new Date('2024-01-14T18:45:00Z'),
            source: 'GoalSphere',
            category: 'saudi-pro-league' as ArticleCategory,
            relatedTeamIds: [],
            relatedPlayerIds: [],
            isBreaking: true,
            views: 89000,
            createdAt: new Date('2024-01-14T18:45:00Z'),
            updatedAt: new Date('2024-01-14T18:45:00Z')
          }
        ],
        count: 2,
        page: 1,
        limit: 5
      })
    }),

    // Get articles by category
    getArticlesByCategory: builder.query<ArticlesResponse, { category: ArticleCategory; limit?: number }>({
      query: ({ category, limit = 10 }) => `articles?category=eq.${category}&limit=${limit}&order=published_at.desc`,
      providesTags: ['Article'],
    }),

    // Get related articles
    getRelatedArticles: builder.query<ArticlesResponse, { teamIds?: string[]; playerIds?: string[]; limit?: number }>({
      query: ({ teamIds = [], playerIds = [], limit = 5 }) => {
        const conditions = []
        if (teamIds.length > 0) conditions.push(`related_team_ids=cs.{${teamIds.join(',')}}`)
        if (playerIds.length > 0) conditions.push(`related_player_ids=cs.{${playerIds.join(',')}}`)
        
        const query = conditions.length > 0 
          ? `articles?${conditions.join('&')}&limit=${limit}&order=published_at.desc`
          : `articles?limit=${limit}&order=published_at.desc`
        
        return query
      },
      providesTags: ['Article'],
    }),

    // Create article
    createArticle: builder.mutation<ArticleResponse, CreateArticleRequest>({
      query: (article) => ({
        url: 'articles',
        method: 'POST',
        body: article,
      }),
      invalidatesTags: ['Article'],
    }),

    // Update article
    updateArticle: builder.mutation<ArticleResponse, UpdateArticleRequest>({
      query: ({ id, ...updates }) => ({
        url: `articles?id=eq.${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Article', id }],
    }),

    // Delete article
    deleteArticle: builder.mutation<void, string>({
      query: (id) => ({
        url: `articles?id=eq.${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Article'],
    }),

    // Increment article views
    incrementViews: builder.mutation<void, string>({
      query: (id) => ({
        url: `articles?id=eq.${id}`,
        method: 'PATCH',
        body: { views: 'increment' },
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Article', id }],
    }),

    // Search articles
    searchArticles: builder.query<ArticlesResponse, { query: string; limit?: number }>({
      query: ({ query, limit = 10 }) => `articles?title=ilike.*${query}*&limit=${limit}&order=published_at.desc`,
      providesTags: ['Article'],
    }),

  }),
})

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useGetBreakingNewsQuery,
  useGetArticlesByCategoryQuery,
  useGetRelatedArticlesQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useIncrementViewsMutation,
  useSearchArticlesQuery,
} = articlesApi
