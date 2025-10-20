import { NextRequest, NextResponse } from 'next/server';
import { espnFootballService } from '@/lib/services/espnFootballService';
import { LEAGUES } from '@/lib/services/leagues';

export async function GET(_request: NextRequest, { params }: { params: { league: string }}) {
  const slug = params.league as keyof typeof LEAGUES;
  const league = LEAGUES[slug] || LEAGUES['premier-league'];
  const code = league.code;

  try {
    const [
      liveMatches,
      todaysMatches,
      thisWeekMatches,
      nextWeekMatches,
      thisMonthMatches,
      previousWeekMatches,
      standings,
      teams,
      news
    ] = await Promise.all([
      espnFootballService.getLiveMatches(code),
      espnFootballService.getTodaysMatches(code),
      espnFootballService.getThisWeekMatches(code),
      espnFootballService.getNextWeekMatches(code),
      espnFootballService.getThisMonthMatches(code),
      espnFootballService.getPreviousWeekMatches(code),
      espnFootballService.getLeagueStandings(code),
      espnFootballService.getTeams(code),
      espnFootballService.getNews(code)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        liveMatches,
        todaysMatches,
        thisWeekMatches,
        nextWeekMatches,
        thisMonthMatches,
        previousWeekMatches,
        standings,
        teams,
        news,
        league: { id: league.id, name: league.name },
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}


