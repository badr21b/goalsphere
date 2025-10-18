import { baseApi } from './baseApi'
import { Article, ArticleCategory } from '@/lib/types'

export interface ContentIngestionJob {
  id: string
  source: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  started_at?: string
  completed_at?: string
  articles_processed: number
  articles_created: number
  articles_updated: number
  errors: string[]
  created_at: string
}

export interface ContentIngestionResponse {
  data: ContentIngestionJob[]
  count: number
}

export interface StartIngestionRequest {
  source: 'sportmonks' | 'api_football' | 'manual'
  categories?: ArticleCategory[]
  force_refresh?: boolean
}

export interface IngestionStatusResponse {
  data: ContentIngestionJob
}

export interface ExternalArticleData {
  title: string
  body: string
  image_url?: string
  published_at: string
  source: string
  category: ArticleCategory
  external_id: string
  raw_data: any
}

export const contentIngestionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get ingestion jobs history
    getIngestionJobs: builder.query<ContentIngestionResponse, {
      status?: 'pending' | 'running' | 'completed' | 'failed'
      source?: string
      limit?: number
      offset?: number
    }>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        
        if (params.status) searchParams.append('status', `eq.${params.status}`)
        if (params.source) searchParams.append('source', `eq.${params.source}`)
        if (params.limit) searchParams.append('limit', params.limit.toString())
        if (params.offset) searchParams.append('offset', params.offset.toString())
        
        searchParams.append('order', 'created_at.desc')
        
        return `content_ingestion_jobs?${searchParams.toString()}`
      },
      providesTags: ['ContentIngestion'],
    }),

    // Get single ingestion job
    getIngestionJob: builder.query<IngestionStatusResponse, string>({
      query: (id) => `content_ingestion_jobs?id=eq.${id}&select=*`,
      transformResponse: (response: ContentIngestionJob[]) => ({ data: response[0] }),
      providesTags: (result, error, id) => [{ type: 'ContentIngestion', id }],
    }),

    // Start content ingestion
    startIngestion: builder.mutation<IngestionStatusResponse, StartIngestionRequest>({
      query: (request) => ({
        url: 'content_ingestion_jobs',
        method: 'POST',
        body: {
          source: request.source,
          status: 'pending',
          articles_processed: 0,
          articles_created: 0,
          articles_updated: 0,
          errors: [],
          categories: request.categories || [],
          force_refresh: request.force_refresh || false,
        },
      }),
      invalidatesTags: ['ContentIngestion'],
    }),

    // Update ingestion job status
    updateIngestionStatus: builder.mutation<IngestionStatusResponse, {
      id: string
      status: 'pending' | 'running' | 'completed' | 'failed'
      articles_processed?: number
      articles_created?: number
      articles_updated?: number
      errors?: string[]
    }>({
      query: ({ id, ...updates }) => ({
        url: `content_ingestion_jobs?id=eq.${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ContentIngestion', id }],
    }),

    // Process external article data
    processExternalArticle: builder.mutation<{
      data: {
        article: Article
        created: boolean
        updated: boolean
      }
    }, ExternalArticleData>({
      query: (articleData) => ({
        url: 'process_external_article',
        method: 'POST',
        body: articleData,
      }),
      invalidatesTags: ['Article', 'ContentIngestion'],
    }),

    // Batch process external articles
    batchProcessArticles: builder.mutation<{
      data: {
        processed: number
        created: number
        updated: number
        errors: string[]
      }
    }, {
      articles: ExternalArticleData[]
      job_id: string
    }>({
      query: ({ articles, job_id }) => ({
        url: 'batch_process_articles',
        method: 'POST',
        body: { articles, job_id },
      }),
      invalidatesTags: ['Article', 'ContentIngestion'],
    }),

    // Get ingestion statistics
    getIngestionStats: builder.query<{
      data: {
        total_jobs: number
        successful_jobs: number
        failed_jobs: number
        total_articles_processed: number
        total_articles_created: number
        last_ingestion: string
        average_processing_time: number
      }
    }, void>({
      query: () => 'ingestion_statistics',
      providesTags: ['ContentIngestion'],
    }),

    // Get source configuration
    getSourceConfig: builder.query<{
      data: {
        source: string
        api_key: string
        base_url: string
        rate_limit: number
        last_sync: string
        is_active: boolean
      }[]
    }, void>({
      query: () => 'source_configurations',
      providesTags: ['ContentIngestion'],
    }),

    // Update source configuration
    updateSourceConfig: builder.mutation<void, {
      source: string
      api_key?: string
      base_url?: string
      rate_limit?: number
      is_active?: boolean
    }>({
      query: ({ source, ...updates }) => ({
        url: `source_configurations?source=eq.${source}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['ContentIngestion'],
    }),

    // Test source connection
    testSourceConnection: builder.mutation<{
      data: {
        success: boolean
        message: string
        response_time: number
        articles_found: number
      }
    }, {
      source: string
      api_key: string
    }>({
      query: ({ source, api_key }) => ({
        url: 'test_source_connection',
        method: 'POST',
        body: { source, api_key },
      }),
    }),

    // Get recent ingestion errors
    getRecentErrors: builder.query<{
      data: {
        job_id: string
        source: string
        error_message: string
        created_at: string
      }[]
    }, { limit?: number }>({
      query: ({ limit = 10 }) => 
        `ingestion_errors?limit=${limit}&order=created_at.desc`,
      providesTags: ['ContentIngestion'],
    }),

    // Retry failed ingestion
    retryIngestion: builder.mutation<IngestionStatusResponse, string>({
      query: (jobId) => ({
        url: `retry_ingestion/${jobId}`,
        method: 'POST',
      }),
      invalidatesTags: ['ContentIngestion'],
    }),
  }),
})

export const {
  useGetIngestionJobsQuery,
  useGetIngestionJobQuery,
  useStartIngestionMutation,
  useUpdateIngestionStatusMutation,
  useProcessExternalArticleMutation,
  useBatchProcessArticlesMutation,
  useGetIngestionStatsQuery,
  useGetSourceConfigQuery,
  useUpdateSourceConfigMutation,
  useTestSourceConnectionMutation,
  useGetRecentErrorsQuery,
  useRetryIngestionMutation,
} = contentIngestionApi
