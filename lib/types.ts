// Database Schema Types for GoalSphere MVP

export interface Article {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
  publishedAt: Date;
  source: string;
  category: ArticleCategory;
  relatedTeamIds: string[];
  relatedPlayerIds: string[];
  isBreaking: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  nameAr: string;
  logoUrl: string;
  league: League;
  country: string;
  founded: number;
  stadium: string;
  website: string;
  socialMedia: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Player {
  id: string;
  name: string;
  nameAr: string;
  position: string;
  teamId: string;
  nationality: string;
  age: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LiveScore {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'finished' | 'upcoming';
  league: string;
  minute?: number;
  startTime: Date;
}

export type ArticleCategory = 
  | 'transfers'
  | 'analysis'
  | 'breaking'
  | 'premier-league'
  | 'champions-league'
  | 'saudi-pro-league'
  | 'la-liga'
  | 'serie-a'
  | 'bundesliga';

export type League = 
  | 'premier-league'
  | 'champions-league'
  | 'saudi-pro-league'
  | 'la-liga'
  | 'serie-a'
  | 'bundesliga'
  | 'europa-league';

export interface AdUnit {
  id: string;
  type: 'banner' | 'in-article' | 'video';
  position: 'header' | 'footer' | 'sidebar' | 'in-content';
  content: string;
  isActive: boolean;
  targetCategory?: ArticleCategory;
}
