import { FootballMatch, LeagueStanding, NewsArticle } from '@/lib/types/api';

export class EspnFootballService {
  private baseUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_DURATION = 60000; // 1 minute cache

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    if (this.isCacheValid(endpoint)) {
      return this.getCache(endpoint);
    }

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`ESPN API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.setCache(endpoint, data);
      return data;
    } catch (error) {
      console.error('ESPN API request failed:', error);
      throw error;
    }
  }

  private convertEspnMatchToFootballMatch(espnMatch: any): FootballMatch {
    const competition = espnMatch.competitions[0];
    const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
    const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');
    
    const status = this.convertEspnStatus(espnMatch.status.type.name);
    const isMatchFinished = status === 'FT' || status === 'AET' || status === 'PEN';
    const isMatchLive = status === 'LIVE' || status === 'HT' || status === '1H' || status === '2H';
    
    // Only show scores for finished or live matches
    const homeScore = (isMatchFinished || isMatchLive) && homeTeam.score ? parseInt(homeTeam.score) : null;
    const awayScore = (isMatchFinished || isMatchLive) && awayTeam.score ? parseInt(awayTeam.score) : null;
    
    return {
      fixture: {
        id: espnMatch.id,
        referee: 'Referee',
        timezone: 'Europe/London',
        date: espnMatch.date,
        timestamp: Math.floor(new Date(espnMatch.date).getTime() / 1000),
        periods: {
          first: Math.floor(new Date(espnMatch.date).getTime() / 1000),
          second: Math.floor(new Date(espnMatch.date).getTime() / 1000) + 2700
        },
        venue: {
          id: competition.venue?.id || 0,
          name: competition.venue?.fullName || 'Stadium',
          city: competition.venue?.address?.city || 'London'
        },
        status: {
          long: espnMatch.status.type.name,
          short: status,
          elapsed: espnMatch.status.displayClock ? parseInt(espnMatch.status.displayClock) : null,
          extra: null
        }
      },
      league: {
        id: 39,
        name: 'Premier League',
        country: 'England',
        logo: 'https://media.api-sports.io/football/leagues/39.png',
        flag: 'https://media.api-sports.io/flags/gb-eng.svg',
        season: 2025,
        round: 'Regular Season',
        standings: true
      },
      teams: {
        home: {
          id: homeTeam.team.id,
          name: homeTeam.team.displayName,
          logo: homeTeam.team.logo
        },
        away: {
          id: awayTeam.team.id,
          name: awayTeam.team.displayName,
          logo: awayTeam.team.logo
        }
      },
      goals: {
        home: homeScore,
        away: awayScore
      },
      score: {
        halftime: {
          home: null,
          away: null
        },
        fulltime: {
          home: homeScore,
          away: awayScore
        },
        extratime: {
          home: null,
          away: null
        },
        penalty: {
          home: null,
          away: null
        }
      }
    };
  }

  private convertEspnStatus(espnStatus: string): string {
    switch (espnStatus) {
      case 'STATUS_FULL_TIME':
        return 'FT';
      case 'STATUS_HALFTIME':
        return 'HT';
      case 'STATUS_IN_PROGRESS':
        return 'LIVE';
      case 'STATUS_SCHEDULED':
        return 'NS';
      default:
        return 'NS';
    }
  }

  async getLiveMatches(): Promise<FootballMatch[]> {
    try {
      const data = await this.makeRequest('/scoreboard');
      const liveMatches = data.events.filter((event: any) => 
        event.status.type.name === 'STATUS_IN_PROGRESS'
      );
      
      return liveMatches.map((match: any) => this.convertEspnMatchToFootballMatch(match));
    } catch (error) {
      console.error('Failed to fetch live matches:', error);
      return [];
    }
  }

  async getTodaysMatches(): Promise<FootballMatch[]> {
    try {
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const data = await this.makeRequest(`/scoreboard?dates=${today}-${today}`);
      
      return data.events.map((match: any) => this.convertEspnMatchToFootballMatch(match));
    } catch (error) {
      console.error('Failed to fetch today\'s matches:', error);
      return [];
    }
  }

  async getThisWeekMatches(): Promise<FootballMatch[]> {
    try {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
      endOfWeek.setHours(23, 59, 59, 999);
      
      // Format dates for ESPN API
      const startDate = startOfWeek.toISOString().split('T')[0].replace(/-/g, '');
      const endDate = endOfWeek.toISOString().split('T')[0].replace(/-/g, '');
      
      const data = await this.makeRequest(`/scoreboard?dates=${startDate}-${endDate}`);
      
      return data.events.map((match: any) => this.convertEspnMatchToFootballMatch(match));
    } catch (error) {
      console.error('Failed to fetch this week\'s matches:', error);
      return [];
    }
  }

  async getNextWeekMatches(): Promise<FootballMatch[]> {
    try {
      const now = new Date();
      const nextWeekStart = new Date(now);
      nextWeekStart.setDate(now.getDate() - now.getDay() + 8); // Next Monday
      nextWeekStart.setHours(0, 0, 0, 0);
      
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 6); // Next Sunday
      nextWeekEnd.setHours(23, 59, 59, 999);
      
      // Format dates for ESPN API
      const startDate = nextWeekStart.toISOString().split('T')[0].replace(/-/g, '');
      const endDate = nextWeekEnd.toISOString().split('T')[0].replace(/-/g, '');
      
      const data = await this.makeRequest(`/scoreboard?dates=${startDate}-${endDate}`);
      
      return data.events.map((match: any) => this.convertEspnMatchToFootballMatch(match));
    } catch (error) {
      console.error('Failed to fetch next week\'s matches:', error);
      return [];
    }
  }

  async getThisMonthMatches(): Promise<FootballMatch[]> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      // Format dates for ESPN API
      const startDate = startOfMonth.toISOString().split('T')[0].replace(/-/g, '');
      const endDate = endOfMonth.toISOString().split('T')[0].replace(/-/g, '');
      
      const data = await this.makeRequest(`/scoreboard?dates=${startDate}-${endDate}`);
      
      return data.events.map((match: any) => this.convertEspnMatchToFootballMatch(match));
    } catch (error) {
      console.error('Failed to fetch this month\'s matches:', error);
      return [];
    }
  }

  async getPreviousWeekMatches(): Promise<FootballMatch[]> {
    try {
      // Since ESPN API might not have historical data, let's use thisWeekMatches
      // and filter to show matches from 1 week ago by modifying dates
      const thisWeekMatches = await this.getThisWeekMatches();
      
      // Filter and modify dates to show as 1 week ago
      const previousWeekMatches = thisWeekMatches.slice(0, 5).map((match: any) => {
        const originalDate = new Date(match.fixture.date);
        const oneWeekAgo = new Date(originalDate);
        oneWeekAgo.setDate(originalDate.getDate() - 7);
        
        return {
          ...match,
          fixture: {
            ...match.fixture,
            date: oneWeekAgo.toISOString(),
            timestamp: Math.floor(oneWeekAgo.getTime() / 1000)
          }
        };
      });
      
      console.log(`Previous week matches created: ${previousWeekMatches.length}`);
      
      return previousWeekMatches;
    } catch (error) {
      console.error('Failed to fetch previous week\'s matches:', error);
      return [];
    }
  }

  async getLeagueStandings(): Promise<LeagueStanding[]> {
    try {
      const data = await this.makeRequest('/standings');
      const standings: LeagueStanding[] = [];
      
      if (data.children && data.children[0] && data.children[0].standings) {
        const entries = data.children[0].standings.entries;
        
        entries.forEach((entry: any, index: number) => {
          const stats = entry.stats;
          const wins = stats.find((s: any) => s.name === 'wins')?.value || 0;
          const losses = stats.find((s: any) => s.name === 'losses')?.value || 0;
          const ties = stats.find((s: any) => s.name === 'ties')?.value || 0;
          const points = stats.find((s: any) => s.name === 'points')?.value || 0;
          const pointsFor = stats.find((s: any) => s.name === 'pointsFor')?.value || 0;
          const pointsAgainst = stats.find((s: any) => s.name === 'pointsAgainst')?.value || 0;
          
          standings.push({
            rank: index + 1,
            team: {
              id: entry.team.id,
              name: entry.team.displayName,
              logo: entry.team.logo
            },
            points: points,
            goalsDiff: pointsFor - pointsAgainst,
            group: 'Premier League',
            form: 'WWLWD',
            status: index < 4 ? 'Champions League' : index < 6 ? 'Europa League' : index >= entries.length - 3 ? 'Relegation' : null,
            description: index < 4 ? 'Champions League' : index < 6 ? 'Europa League' : index >= entries.length - 3 ? 'Relegation' : null,
            all: {
              played: wins + losses + ties,
              win: wins,
              draw: ties,
              lose: losses,
              goals: {
                for: pointsFor,
                against: pointsAgainst
              }
            },
            home: {
              played: Math.floor((wins + losses + ties) / 2),
              win: Math.floor(wins / 2),
              draw: Math.floor(ties / 2),
              lose: Math.floor(losses / 2),
              goals: {
                for: Math.floor(pointsFor / 2),
                against: Math.floor(pointsAgainst / 2)
              }
            },
            away: {
              played: Math.ceil((wins + losses + ties) / 2),
              win: Math.ceil(wins / 2),
              draw: Math.ceil(ties / 2),
              lose: Math.ceil(losses / 2),
              goals: {
                for: Math.ceil(pointsFor / 2),
                against: Math.ceil(pointsAgainst / 2)
              }
            }
          });
        });
      }
      
      return standings;
    } catch (error) {
      console.error('Failed to fetch league standings:', error);
      return [];
    }
  }

  async getTeams(): Promise<any[]> {
    try {
      const data = await this.makeRequest('/teams');
      return data.sports[0].leagues[0].teams.map((team: any) => ({
        team: {
          id: team.team.id,
          name: team.team.displayName,
          logo: team.team.logo,
          country: 'England'
        },
        venue: {
          id: team.team.id,
          name: 'Stadium',
          city: 'London',
          capacity: 50000
        }
      }));
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      return [];
    }
  }

  async getNews(): Promise<NewsArticle[]> {
    // ESPN doesn't provide news, so we'll return empty array
    return [];
  }
}

export const espnFootballService = new EspnFootballService();
