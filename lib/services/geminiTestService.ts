import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiTestResult {
  isValid: boolean;
  error?: string;
  model?: string;
}

export class GeminiTestService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async testApiKey(): Promise<GeminiTestResult> {
    try {
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      // Simple test request
      const result = await model.generateContent('Hello, respond with "API working"');
      const response = await result.response;
      const text = response.text();
      
      return {
        isValid: true,
        model: 'gemini-2.5-flash'
      };
    } catch (error) {
      console.error('Gemini API test failed:', error);
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'Invalid API key';
        } else if (error.message.includes('quota')) {
          errorMessage = 'API quota exceeded';
        } else if (error.message.includes('permission')) {
          errorMessage = 'API permission denied';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        isValid: false,
        error: errorMessage
      };
    }
  }
}

// Test function
export async function testGeminiApiKey(apiKey: string): Promise<GeminiTestResult> {
  const testService = new GeminiTestService(apiKey);
  return await testService.testApiKey();
}
