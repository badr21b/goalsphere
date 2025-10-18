import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/store/api/baseApi'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('job_id')
    const source = searchParams.get('source')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabase
      .from('content_ingestion_jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (jobId) {
      query = query.eq('id', jobId)
    }
    if (source) {
      query = query.eq('source', source)
    }
    if (status) {
      query = query.eq('status', status)
    }

    query = query.limit(limit)

    const { data: jobs, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch ingestion jobs' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: jobs,
      count: jobs?.length || 0
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.toString() },
      { status: 500 }
    )
  }
}
