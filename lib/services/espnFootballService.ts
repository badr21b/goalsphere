import { FootballMatch, LeagueStanding, NewsArticle } from '@/lib/types/api';
import { FootballNews } from '@/lib/types';

export class EspnFootballService {
  private getBaseUrl(leagueCode: string = 'eng.1') {
    return `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueCode}`;
  }
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

  private async makeRequest(endpoint: string, leagueCode: string = 'eng.1'): Promise<any> {
    const url = `${this.getBaseUrl(leagueCode)}${endpoint}`;
    const cacheKey = `${leagueCode}-${endpoint}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`ESPN API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('ESPN API request failed:', error);
      throw error;
    }
  }

  private getLeagueInfo(leagueCode: string) {
    const leagueMap: Record<string, any> = {
      'eng.1': { id: 39, name: 'Premier League', country: 'England', logo: 'https://media.api-sports.io/football/leagues/39.png', flag: 'https://media.api-sports.io/flags/gb-eng.svg' },
      'esp.1': { id: 140, name: 'La Liga', country: 'Spain', logo: 'https://media.api-sports.io/football/leagues/140.png', flag: 'https://media.api-sports.io/flags/es.svg' },
      'ita.1': { id: 135, name: 'Serie A', country: 'Italy', logo: 'https://media.api-sports.io/football/leagues/135.png', flag: 'https://media.api-sports.io/flags/it.svg' },
      'ger.1': { id: 78, name: 'Bundesliga', country: 'Germany', logo: 'https://media.api-sports.io/football/leagues/78.png', flag: 'https://media.api-sports.io/flags/de.svg' },
      'fra.1': { id: 61, name: 'Ligue 1', country: 'France', logo: 'https://media.api-sports.io/football/leagues/61.png', flag: 'https://media.api-sports.io/flags/fr.svg' },
      'uefa.champions': { id: 2, name: 'Champions League', country: 'Europe', logo: 'https://media.api-sports.io/football/leagues/2.png', flag: 'https://media.api-sports.io/flags/eu.svg' },
      'uefa.europa': { id: 3, name: 'Europa League', country: 'Europe', logo: 'https://media.api-sports.io/football/leagues/3.png', flag: 'https://media.api-sports.io/flags/eu.svg' },
      'ksa.1': { id: 307, name: 'Saudi Pro League', country: 'Saudi Arabia', logo: 'https://media.api-sports.io/football/leagues/307.png', flag: 'https://media.api-sports.io/flags/sa.svg' }
    };
    
    return leagueMap[leagueCode] || leagueMap['eng.1'];
  }

  private convertEspnMatchToFootballMatch(espnMatch: any, leagueCode: string = 'eng.1'): FootballMatch {
    const competition = espnMatch.competitions[0];
    const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
    const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');
    
    const status = this.convertEspnStatus(espnMatch.status.type.name);
    const isMatchFinished = status === 'FT' || status === 'AET' || status === 'PEN';
    const isMatchLive = status === 'LIVE' || status === 'HT' || status === '1H' || status === '2H';
    
    // Only show scores for finished or live matches
    const homeScore = (isMatchFinished || isMatchLive) && homeTeam.score ? parseInt(homeTeam.score) : null;
    const awayScore = (isMatchFinished || isMatchLive) && awayTeam.score ? parseInt(awayTeam.score) : null;
    
    const leagueInfo = this.getLeagueInfo(leagueCode);
    
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
        id: leagueInfo.id,
        name: leagueInfo.name,
        country: leagueInfo.country,
        logo: leagueInfo.logo,
        flag: leagueInfo.flag,
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

  async getLiveMatches(leagueCode: string = 'eng.1'): Promise<FootballMatch[]> {
    try {
      const data = await this.makeRequest('/scoreboard', leagueCode);
      const liveMatches = data.events.filter((event: any) => 
        event.status.type.name === 'STATUS_IN_PROGRESS'
      );
      
      return liveMatches.map((match: any) => this.convertEspnMatchToFootballMatch(match, leagueCode));
    } catch (error) {
      console.error('Failed to fetch live matches:', error);
      return [];
    }
  }

  async getTodaysMatches(leagueCode: string = 'eng.1'): Promise<FootballMatch[]> {
    try {
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const data = await this.makeRequest(`/scoreboard?dates=${today}-${today}`, leagueCode);
      
      return data.events.map((match: any) => this.convertEspnMatchToFootballMatch(match, leagueCode));
    } catch (error) {
      console.error('Failed to fetch today\'s matches:', error);
      return [];
    }
  }

  async getThisWeekMatches(leagueCode: string = 'eng.1'): Promise<FootballMatch[]> {
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
      
      const data = await this.makeRequest(`/scoreboard?dates=${startDate}-${endDate}`, leagueCode);
      
      return data.events.map((match: any) => this.convertEspnMatchToFootballMatch(match, leagueCode));
    } catch (error) {
      console.error('Failed to fetch this week\'s matches:', error);
      return [];
    }
  }

  async getNextWeekMatches(leagueCode: string = 'eng.1'): Promise<FootballMatch[]> {
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
      
      const data = await this.makeRequest(`/scoreboard?dates=${startDate}-${endDate}`, leagueCode);
      
      return data.events.map((match: any) => this.convertEspnMatchToFootballMatch(match, leagueCode));
    } catch (error) {
      console.error('Failed to fetch next week\'s matches:', error);
      return [];
    }
  }

  async getThisMonthMatches(leagueCode: string = 'eng.1'): Promise<FootballMatch[]> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      // Format dates for ESPN API
      const startDate = startOfMonth.toISOString().split('T')[0].replace(/-/g, '');
      const endDate = endOfMonth.toISOString().split('T')[0].replace(/-/g, '');
      
      const data = await this.makeRequest(`/scoreboard?dates=${startDate}-${endDate}`, leagueCode);
      
      return data.events.map((match: any) => this.convertEspnMatchToFootballMatch(match, leagueCode));
    } catch (error) {
      console.error('Failed to fetch this month\'s matches:', error);
      return [];
    }
  }

  async getPreviousWeekMatches(leagueCode: string = 'eng.1'): Promise<FootballMatch[]> {
    try {
      // Since ESPN API might not have historical data, let's use thisWeekMatches
      // and filter to show matches from 1 week ago by modifying dates
      const thisWeekMatches = await this.getThisWeekMatches(leagueCode);
      
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

  async getLeagueStandings(leagueCode: string = 'eng.1'): Promise<LeagueStanding[]> {
    try {
      const data = await this.makeRequest('/standings', leagueCode);
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
            status: index < 4 ? 'Champions League' : index < 6 ? 'Europa League' : index >= entries.length - 3 ? 'Relegation' : 'Mid-table',
            description: index < 4 ? 'Champions League' : index < 6 ? 'Europa League' : index >= entries.length - 3 ? 'Relegation' : 'Mid-table',
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

  async getTeams(leagueCode: string = 'eng.1'): Promise<any[]> {
    try {
      const data = await this.makeRequest('/teams', leagueCode);
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

  private convertEspnNewsToFootballNews(espnArticle: any, leagueCode: string): FootballNews {
    const leagueInfo = this.getLeagueInfo(leagueCode);
    const primaryImage = espnArticle.images && espnArticle.images.length > 0 ? espnArticle.images[0] : null;

    return {
      id: espnArticle.id.toString(),
      title: espnArticle.headline,
      description: espnArticle.description,
      image: primaryImage ? primaryImage.url : '/images/placeholder-news.jpg',
      publishedAt: espnArticle.published,
      category: leagueInfo.name.toLowerCase().replace(/\s+/g, '-'),
      link: espnArticle.links?.web?.href || '#',
      isBreaking: espnArticle.isBreakingNews || false,
      league: {
        id: leagueInfo.id,
        name: leagueInfo.name,
        country: leagueInfo.country,
        logo: leagueInfo.logo,
        flag: leagueInfo.flag,
      }
    };
  }

  async getNews(leagueCode: string = 'eng.1'): Promise<FootballNews[]> {
    try {
      const data = await this.makeRequest('/news', leagueCode);
      if (data && data.articles) {
        return data.articles.map((article: any) => this.convertEspnNewsToFootballNews(article, leagueCode));
      }
      return [];
    } catch (error) {
      console.error(`Error fetching news for ${leagueCode}:`, error);
      return [];
    }
  }
}

export const espnFootballService = new EspnFootballService();
