import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/services/geminiService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic') || undefined;
    const type = searchParams.get('type') || 'breaking';

    let newsData;

    if (type === 'breaking') {
      newsData = await geminiService.generateBreakingNews();
    } else if (topic) {
      newsData = await geminiService.generateNewsContent(topic);
    } else {
      // Generate general football news
      newsData = await geminiService.generateNewsContent('Latest football news and updates');
    }

    return NextResponse.json({
      success: true,
      data: {
        articles: Array.isArray(newsData) ? newsData : [newsData],
        lastUpdated: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating news:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate news',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
