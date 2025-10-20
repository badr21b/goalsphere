import { NextRequest, NextResponse } from 'next/server';
import { apiFootballService } from '@/lib/services/apiFootballService';

export async function GET(request: NextRequest) {
  try {
    const liveMatches = await apiFootballService.getLiveMatches();

    return NextResponse.json({
      success: true,
      data: {
        liveMatches,
        count: liveMatches.length,
        lastUpdated: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching live matches:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch live matches',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
