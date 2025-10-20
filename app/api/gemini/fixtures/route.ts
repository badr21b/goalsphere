import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/services/geminiService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league') || undefined;
    const date = searchParams.get('date') || undefined;

    const fixtures = await geminiService.getTodaysFixtures(league);

    return NextResponse.json({
      success: true,
      data: fixtures,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch fixtures',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
