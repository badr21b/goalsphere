import { NextRequest, NextResponse } from 'next/server';
import { testGeminiApiKey } from '@/lib/services/geminiTestService';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyAYa0GQvGmLaljMHqZrvheiCApZnVnnO2l';
    
    const result = await testGeminiApiKey(apiKey);
    
    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error testing Gemini API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to test Gemini API',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
