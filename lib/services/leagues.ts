export type LeagueSlug = 'premier-league' | 'la-liga' | 'serie-a' | 'bundesliga' | 'ligue-1' | 'champions-league' | 'saudi-pro-league';

export const LEAGUES: Record<LeagueSlug, { code: string; name: string; id: number } > = {
  'premier-league': { code: 'eng.1', name: 'Premier League', id: 39 },
  'la-liga': { code: 'esp.1', name: 'La Liga', id: 140 },
  'serie-a': { code: 'ita.1', name: 'Serie A', id: 135 },
  'bundesliga': { code: 'ger.1', name: 'Bundesliga', id: 78 },
  'ligue-1': { code: 'fra.1', name: 'Ligue 1', id: 61 },
  'champions-league': { code: 'uefa.champions', name: 'UEFA Champions League', id: 2 },
  'saudi-pro-league': { code: 'ksa.1', name: 'Saudi Pro League', id: 307 }
};


