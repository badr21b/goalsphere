import { NextRequest, NextResponse } from 'next/server';
import { apiFootballService } from '@/lib/services/apiFootballService';

export async function GET(request: NextRequest) {
  try {
    const todaysMatches = await apiFootballService.getTodaysMatches();

    return NextResponse.json({
      success: true,
      data: {
        todaysMatches,
        count: todaysMatches.length,
        lastUpdated: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching today\'s matches:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch today\'s matches',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
