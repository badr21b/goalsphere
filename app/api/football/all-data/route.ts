import { NextRequest, NextResponse } from 'next/server';
import { apiFootballService } from '@/lib/services/apiFootballService';

export async function GET(request: NextRequest) {
  try {
    const allData = await apiFootballService.getAllData();

    return NextResponse.json({
      success: true,
      data: allData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching all football data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch all football data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
