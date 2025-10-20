# Gemini AI Integration for GoalSphere

## Overview

This document describes the integration of Google's Gemini AI with TheSportsDB API to provide intelligent, real-time football data processing and content generation for GoalSphere.

## Features

### 🤖 AI-Powered Data Processing
- **Real-time Data Fetching**: Fetches live data from TheSportsDB API
- **Intelligent Processing**: Uses Gemini AI to process and enhance raw data
- **Content Generation**: Creates engaging news articles and summaries
- **Data Normalization**: Converts various API formats into unified schema

### 📊 Data Types Supported
- **Live Scores**: Real-time match data with AI-enhanced details
- **Fixtures**: Today's and upcoming matches
- **Standings**: League tables with intelligent analysis
- **News**: AI-generated articles based on current events
- **Teams & Leagues**: Comprehensive team and league information

## Architecture

### Services

#### 1. GeminiService (`lib/services/geminiService.ts`)
Core service that handles:
- TheSportsDB API integration
- Gemini AI processing
- Data transformation and normalization
- Content generation

#### 2. GeminiFootballDataService (`lib/services/geminiFootballDataService.ts`)
High-level service that provides:
- Cached data access
- Fallback mechanisms
- Unified data interface
- Performance optimization

### API Routes

#### Live Scores
```
GET /api/gemini/live-scores?league=soccer
```

#### Fixtures
```
GET /api/gemini/fixtures?league=soccer&date=2024-01-15
```

#### Standings
```
GET /api/gemini/standings?league=Premier League
```

#### News
```
GET /api/gemini/news?topic=transfer&type=breaking
```

#### All Data
```
GET /api/gemini/all-data?league=soccer
```

## Configuration

### Environment Variables
```bash
# Add to your .env.local file
GEMINI_API_KEY=your_gemini_api_key_here
```

### API Key Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your environment variables
4. The service will automatically use the key

## Usage Examples

### Basic Data Fetching
```typescript
import { geminiFootballDataService } from '@/lib/services/geminiFootballDataService';

// Get all data
const data = await geminiFootballDataService.getAllData();

// Get specific data types
const liveMatches = await geminiFootballDataService.getLiveMatches();
const news = await geminiFootballDataService.getNews();
const standings = await geminiFootballDataService.getStandings('Premier League');
```

### Direct API Calls
```typescript
import { geminiService } from '@/lib/services/geminiService';

// Generate news content
const news = await geminiService.generateNewsContent('Premier League transfers');

// Get live scores
const liveScores = await geminiService.getLiveScores('soccer');
```

## Data Flow

1. **Request**: User requests data (live scores, news, etc.)
2. **TheSportsDB**: Service fetches raw data from TheSportsDB API
3. **Gemini Processing**: Raw data is sent to Gemini AI for enhancement
4. **Content Generation**: AI generates news articles and improves data quality
5. **Normalization**: Data is converted to unified schema
6. **Caching**: Results are cached for performance
7. **Response**: Enhanced data is returned to user

## Caching Strategy

- **Live Data**: 2-minute cache duration
- **News**: 5-minute cache duration
- **Standings**: 10-minute cache duration
- **Fixtures**: 1-hour cache duration

## Error Handling

### Fallback Mechanisms
1. **API Failure**: Falls back to mock data
2. **Gemini Error**: Uses basic data processing
3. **Network Issues**: Returns cached data if available
4. **Rate Limiting**: Implements exponential backoff

### Error Types
- `TheSportsDB API error`: When TheSportsDB is unavailable
- `Gemini processing error`: When AI processing fails
- `Network error`: When requests fail
- `Rate limit exceeded`: When API limits are reached

## Performance Optimization

### Caching
- In-memory caching for frequently accessed data
- Cache invalidation based on data type
- Cache statistics and monitoring

### Rate Limiting
- Respects TheSportsDB rate limits (30 requests/minute for free tier)
- Implements request queuing
- Automatic retry with backoff

### Data Processing
- Parallel processing for multiple data types
- Lazy loading for large datasets
- Compression for API responses

## Testing

### Test Pages
- **API Test Center**: `/apitest` - Test all APIs including Gemini
- **Gemini Test Page**: `/gemini-test` - Dedicated Gemini testing

### Test Commands
```bash
# Test Gemini service
npm run dev
# Navigate to http://localhost:3000/apitest
# Click "Test Gemini AI + TheSportsDB"
```

## Monitoring

### Cache Statistics
```typescript
const stats = geminiFootballDataService.getCacheStats();
console.log('Cache size:', stats.size);
console.log('Cache entries:', stats.entries);
```

### Performance Metrics
- Response times
- Cache hit rates
- API success rates
- Error frequencies

## Future Enhancements

### Planned Features
1. **Real-time Updates**: WebSocket integration for live data
2. **Advanced Analytics**: AI-powered match predictions
3. **Multi-language Support**: AI-generated content in multiple languages
4. **Custom Prompts**: User-defined content generation templates
5. **Data Visualization**: AI-generated charts and graphs

### Integration Opportunities
1. **Supabase**: Direct database integration
2. **Redis**: Distributed caching
3. **Webhooks**: Real-time data updates
4. **CDN**: Global content delivery

## Troubleshooting

### Common Issues

#### 1. API Key Not Working
```bash
# Check if API key is set
echo $GEMINI_API_KEY

# Verify key format
# Should start with "AIza"
```

#### 2. Rate Limiting
- Check TheSportsDB rate limits
- Implement request queuing
- Use caching to reduce API calls

#### 3. Data Not Updating
- Clear cache: `geminiFootballDataService.clearCache()`
- Check network connectivity
- Verify API endpoints are working

#### 4. Gemini Processing Errors
- Check API key permissions
- Verify request format
- Check Gemini API status

### Debug Mode
```typescript
// Enable debug logging
console.log('Gemini service debug:', {
  cacheStats: geminiFootballDataService.getCacheStats(),
  lastError: error
});
```

## Security Considerations

### API Key Protection
- Never expose API keys in client-side code
- Use environment variables
- Implement key rotation

### Data Privacy
- No personal data is sent to Gemini
- Only sports data is processed
- All data is anonymized

### Rate Limiting
- Implement proper rate limiting
- Monitor API usage
- Set up alerts for excessive usage

## Cost Management

### TheSportsDB
- Free tier: 30 requests/minute
- Premium tier: 100 requests/minute

### Gemini AI
- Pay-per-use pricing
- Monitor usage in Google Cloud Console
- Set up billing alerts

## Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Test with the provided test pages
4. Check API status pages

## License

This integration follows the same license as the main GoalSphere project.
