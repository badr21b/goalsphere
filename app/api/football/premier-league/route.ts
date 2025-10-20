import { NextRequest, NextResponse } from 'next/server';
import { espnFootballService } from '@/lib/services/espnFootballService';

export async function GET(request: NextRequest) {
  try {
    console.log('🏆 Fetching comprehensive Premier League data...');
    
    // Fetch comprehensive Premier League data from ESPN API (real 2025 data)
    const [
      liveMatches,
      todaysMatches,
      thisWeekMatches,
      nextWeekMatches,
      thisMonthMatches,
      previousWeekMatches,
      standings,
      teams
    ] = await Promise.all([
      espnFootballService.getLiveMatches(),
      espnFootballService.getTodaysMatches(),
      espnFootballService.getThisWeekMatches(),
      espnFootballService.getNextWeekMatches(),
      espnFootballService.getThisMonthMatches(),
      espnFootballService.getPreviousWeekMatches(),
      espnFootballService.getLeagueStandings(),
      espnFootballService.getTeams()
    ]);

    const premierLeagueData = {
      liveMatches: liveMatches || [],
      todaysMatches: todaysMatches || [],
      thisWeekMatches: thisWeekMatches || [],
      nextWeekMatches: nextWeekMatches || [],
      thisMonthMatches: thisMonthMatches || [],
      previousWeekMatches: previousWeekMatches || [],
      standings: standings || [],
      teams: teams || [],
      lastUpdated: new Date().toISOString(),
      league: {
        id: 39,
        name: 'Premier League',
        country: 'England',
        season: 2025
      }
    };

    console.log('✅ Premier League data fetched successfully:', {
      liveMatches: premierLeagueData.liveMatches.length,
      todaysMatches: premierLeagueData.todaysMatches.length,
      thisWeekMatches: premierLeagueData.thisWeekMatches.length,
      nextWeekMatches: premierLeagueData.nextWeekMatches.length,
      thisMonthMatches: premierLeagueData.thisMonthMatches.length,
      previousWeekMatches: premierLeagueData.previousWeekMatches.length,
      standings: premierLeagueData.standings.length,
      teams: premierLeagueData.teams.length
    });

    return NextResponse.json({
      success: true,
      data: premierLeagueData,
      message: 'Premier League data fetched successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching Premier League data:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Premier League data',
        data: {
          liveMatches: [],
          todaysMatches: [],
          thisWeekMatches: [],
          nextWeekMatches: [],
          thisMonthMatches: [],
          previousWeekMatches: [],
          standings: [],
          teams: [],
          lastUpdated: new Date().toISOString(),
          league: {
            id: 39,
            name: 'Premier League',
            country: 'England',
            season: new Date().getFullYear()
          }
        }
    }, { status: 500 });
  }
}
