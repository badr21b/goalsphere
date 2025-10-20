import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/services/geminiService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league') || 'Premier League';

    const standings = await geminiService.getLeagueStandings(league);

    return NextResponse.json({
      success: true,
      data: standings,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching standings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch standings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
