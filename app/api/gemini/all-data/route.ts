import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/services/geminiService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league') || undefined;

    // Fetch all data in parallel
    const [liveScores, fixtures, standings, news] = await Promise.all([
      geminiService.getLiveScores(league),
      geminiService.getTodaysFixtures(league),
      geminiService.getLeagueStandings(league || 'Premier League'),
      geminiService.generateBreakingNews()
    ]);

    const allData = {
      liveMatches: liveScores.liveMatches,
      todaysFixtures: fixtures.fixtures,
      standings: standings.standings,
      news: news,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: allData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching all data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch all data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
