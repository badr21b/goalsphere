import { NextRequest, NextResponse } from 'next/server'
import { contentIngestionService } from '@/lib/services/contentIngestion'
import { supabase } from '@/store/api/baseApi'

export async function POST(request: NextRequest) {
  try {
    const { job_id } = await request.json()

    if (!job_id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Get the original job
    const { data: originalJob, error: jobError } = await supabase
      .from('content_ingestion_jobs')
      .select('*')
      .eq('id', job_id)
      .single()

    if (jobError || !originalJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Create new retry job
    const { data: retryJob, error: retryJobError } = await supabase
      .from('content_ingestion_jobs')
      .insert({
        source: originalJob.source,
        status: 'running',
        started_at: new Date().toISOString(),
        articles_processed: 0,
        articles_created: 0,
        articles_updated: 0,
        errors: [],
        categories: originalJob.categories,
        force_refresh: true
      })
      .select()
      .single()

    if (retryJobError) {
      return NextResponse.json(
        { error: 'Failed to create retry job' },
        { status: 500 }
      )
    }

    // Start retry process
    try {
      let articles: any[] = []

      switch (originalJob.source) {
        case 'sportmonks':
          articles = await contentIngestionService.fetchFromSportmonks(originalJob.categories)
          break
        case 'api_football':
          articles = await contentIngestionService.fetchFromAPIFootball(originalJob.categories)
          break
        case 'web_scraping':
          articles = await contentIngestionService.scrapeFromWebsites()
          break
        default:
          throw new Error(`Unknown source: ${originalJob.source}`)
      }

      const results = await contentIngestionService.processArticles(articles)

      // Update retry job status
      await supabase
        .from('content_ingestion_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          articles_processed: results.processed,
          articles_created: results.created,
          articles_updated: results.updated,
          errors: results.errors
        })
        .eq('id', retryJob.id)

      return NextResponse.json({
        success: true,
        job_id: retryJob.id,
        results
      })

    } catch (error) {
      // Update retry job status to failed
      await supabase
        .from('content_ingestion_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          errors: [error.toString()]
        })
        .eq('id', retryJob.id)

      return NextResponse.json(
        { error: 'Retry failed', details: error.toString() },
        { status: 500 }
      )
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.toString() },
      { status: 500 }
    )
  }
}
