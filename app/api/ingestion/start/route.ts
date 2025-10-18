import { NextRequest, NextResponse } from 'next/server'
import { contentIngestionService } from '@/lib/services/contentIngestion'
import { supabase } from '@/store/api/baseApi'

export async function POST(request: NextRequest) {
  try {
    const { source, categories, force_refresh } = await request.json()

    // Create ingestion job
    const { data: job, error: jobError } = await supabase
      .from('content_ingestion_jobs')
      .insert({
        source,
        status: 'running',
        started_at: new Date().toISOString(),
        articles_processed: 0,
        articles_created: 0,
        articles_updated: 0,
        errors: [],
        categories: categories || [],
        force_refresh: force_refresh || false
      })
      .select()
      .single()

    if (jobError) {
      return NextResponse.json(
        { error: 'Failed to create ingestion job' },
        { status: 500 }
      )
    }

    // Start ingestion process
    try {
      let articles: any[] = []

      switch (source) {
        case 'sportmonks':
          articles = await contentIngestionService.fetchFromSportmonks(categories)
          break
        case 'api_football':
          articles = await contentIngestionService.fetchFromAPIFootball(categories)
          break
        case 'web_scraping':
          articles = await contentIngestionService.scrapeFromWebsites()
          break
        default:
          throw new Error(`Unknown source: ${source}`)
      }

      const results = await contentIngestionService.processArticles(articles)

      // Update job status
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
        .eq('id', job.id)

      return NextResponse.json({
        success: true,
        job_id: job.id,
        results
      })

    } catch (error) {
      // Update job status to failed
      await supabase
        .from('content_ingestion_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          errors: [error.toString()]
        })
        .eq('id', job.id)

      return NextResponse.json(
        { error: 'Ingestion failed', details: error.toString() },
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
