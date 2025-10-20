import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/services/geminiService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league') || undefined;

    const liveScores = await geminiService.getLiveScores(league);

    return NextResponse.json({
      success: true,
      data: liveScores,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching live scores:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch live scores',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
