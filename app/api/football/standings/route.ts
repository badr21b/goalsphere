import { NextRequest, NextResponse } from 'next/server';
import { apiFootballService } from '@/lib/services/apiFootballService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leagueId = parseInt(searchParams.get('league') || '39'); // Default to Premier League
    const season = parseInt(searchParams.get('season') || new Date().getFullYear().toString());

    const standings = await apiFootballService.getLeagueStandings(leagueId, season);

    return NextResponse.json({
      success: true,
      data: {
        standings,
        count: standings.length,
        leagueId,
        season,
        lastUpdated: new Date().toISOString()
      },
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
