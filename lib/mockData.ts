// Comprehensive Mock Data for GoalSphere Application
// This file contains all the mocked data for testing before Supabase integration

export interface League {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  logoUrl: string;
  country: string;
  isActive: boolean;
  priority: number;
}

export interface Team {
  id: string;
  nameAr: string;
  nameEn: string;
  logoUrl: string;
  leagueId: string;
  country: string;
  founded: number;
  stadium: string;
  website: string;
  socialMedia: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

export interface Match {
  id: string;
  leagueId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamNameAr: string;
  awayTeamNameAr: string;
  homeTeamNameEn: string;
  awayTeamNameEn: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';
  matchTime: string;
  matchDate: string;
  stadium: string;
  referee?: string;
  attendance?: number;
  minute?: number;
  isLive: boolean;
}

export interface Article {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  bodyAr: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
  category: string;
  subcategory?: string;
  isBreaking: boolean;
  isLive: boolean;
  views: number;
  likes: number;
  shares: number;
  tags: string[];
  author: string;
  relatedTeamIds: string[];
  relatedPlayerIds: string[];
  relatedLeagueIds: string[];
}

export interface Player {
  id: string;
  nameAr: string;
  nameEn: string;
  position: string;
  teamId: string;
  nationality: string;
  age: number;
  imageUrl: string;
  jerseyNumber: number;
  height: number;
  weight: number;
  marketValue: number;
  contractUntil: string;
  goals: number;
  assists: number;
  appearances: number;
}

export interface Manager {
  id: string;
  nameAr: string;
  nameEn: string;
  teamId: string;
  nationality: string;
  age: number;
  imageUrl: string;
  contractUntil: string;
  previousTeams: string[];
  achievements: string[];
}

// ==================== LEAGUES DATA ====================
export const MOCK_LEAGUES: League[] = [
  // Major European Leagues
  {
    id: 'premier-league',
    nameAr: 'الدوري الإنجليزي الممتاز',
    nameEn: 'Premier League',
    slug: 'premier-league',
    logoUrl: '/logos/premier-league.png',
    country: 'إنجلترا',
    isActive: true,
    priority: 1
  },
  {
    id: 'la-liga',
    nameAr: 'الدوري الإسباني',
    nameEn: 'La Liga',
    slug: 'la-liga',
    logoUrl: '/logos/la-liga.png',
    country: 'إسبانيا',
    isActive: true,
    priority: 2
  },
  {
    id: 'bundesliga',
    nameAr: 'البوندسليجا',
    nameEn: 'Bundesliga',
    slug: 'bundesliga',
    logoUrl: '/logos/bundesliga.png',
    country: 'ألمانيا',
    isActive: true,
    priority: 3
  },
  {
    id: 'serie-a',
    nameAr: 'الدوري الإيطالي',
    nameEn: 'Serie A',
    slug: 'serie-a',
    logoUrl: '/logos/serie-a.png',
    country: 'إيطاليا',
    isActive: true,
    priority: 4
  },
  {
    id: 'ligue-1',
    nameAr: 'الدوري الفرنسي',
    nameEn: 'Ligue 1',
    slug: 'ligue-1',
    logoUrl: '/logos/ligue-1.png',
    country: 'فرنسا',
    isActive: true,
    priority: 5
  },
  {
    id: 'eredivisie',
    nameAr: 'الدوري الهولندي',
    nameEn: 'Eredivisie',
    slug: 'eredivisie',
    logoUrl: '/logos/eredivisie.png',
    country: 'هولندا',
    isActive: true,
    priority: 6
  },
  {
    id: 'primeira-liga',
    nameAr: 'الدوري البرتغالي',
    nameEn: 'Primeira Liga',
    slug: 'primeira-liga',
    logoUrl: '/logos/primeira-liga.png',
    country: 'البرتغال',
    isActive: true,
    priority: 7
  },
  {
    id: 'belgian-pro-league',
    nameAr: 'الدوري البلجيكي',
    nameEn: 'Belgian Pro League',
    slug: 'belgian-pro-league',
    logoUrl: '/logos/belgian-pro-league.png',
    country: 'بلجيكا',
    isActive: true,
    priority: 8
  },
  {
    id: 'scottish-premiership',
    nameAr: 'الدوري الاسكتلندي',
    nameEn: 'Scottish Premiership',
    slug: 'scottish-premiership',
    logoUrl: '/logos/scottish-premiership.png',
    country: 'اسكتلندا',
    isActive: true,
    priority: 9
  },
  {
    id: 'turkish-super-lig',
    nameAr: 'الدوري التركي',
    nameEn: 'Turkish Süper Lig',
    slug: 'turkish-super-lig',
    logoUrl: '/logos/turkish-super-lig.png',
    country: 'تركيا',
    isActive: true,
    priority: 10
  },

  // Middle Eastern & African Leagues
  {
    id: 'saudi-pro-league',
    nameAr: 'الدوري السعودي للمحترفين',
    nameEn: 'Saudi Pro League',
    slug: 'saudi-pro-league',
    logoUrl: '/logos/saudi-pro-league.png',
    country: 'السعودية',
    isActive: true,
    priority: 11
  },
  {
    id: 'qatar-stars-league',
    nameAr: 'دوري نجوم قطر',
    nameEn: 'Qatar Stars League',
    slug: 'qatar-stars-league',
    logoUrl: '/logos/qatar-stars-league.png',
    country: 'قطر',
    isActive: true,
    priority: 12
  },
  {
    id: 'uae-pro-league',
    nameAr: 'دوري الخليج العربي',
    nameEn: 'UAE Pro League',
    slug: 'uae-pro-league',
    logoUrl: '/logos/uae-pro-league.png',
    country: 'الإمارات',
    isActive: true,
    priority: 13
  },
  {
    id: 'egyptian-premier-league',
    nameAr: 'الدوري المصري الممتاز',
    nameEn: 'Egyptian Premier League',
    slug: 'egyptian-premier-league',
    logoUrl: '/logos/egyptian-premier-league.png',
    country: 'مصر',
    isActive: true,
    priority: 14
  },
  {
    id: 'moroccan-botola',
    nameAr: 'البطولة المغربية',
    nameEn: 'Moroccan Botola',
    slug: 'moroccan-botola',
    logoUrl: '/logos/moroccan-botola.png',
    country: 'المغرب',
    isActive: true,
    priority: 15
  },
  {
    id: 'tunisian-ligue-1',
    nameAr: 'الرابطة التونسية المحترفة',
    nameEn: 'Tunisian Ligue 1',
    slug: 'tunisian-ligue-1',
    logoUrl: '/logos/tunisian-ligue-1.png',
    country: 'تونس',
    isActive: true,
    priority: 16
  },
  {
    id: 'algerian-ligue-1',
    nameAr: 'الرابطة الجزائرية المحترفة',
    nameEn: 'Algerian Ligue 1',
    slug: 'algerian-ligue-1',
    logoUrl: '/logos/algerian-ligue-1.png',
    country: 'الجزائر',
    isActive: true,
    priority: 17
  },

  // International Competitions
  {
    id: 'champions-league',
    nameAr: 'دوري أبطال أوروبا',
    nameEn: 'UEFA Champions League',
    slug: 'champions-league',
    logoUrl: '/logos/champions-league.png',
    country: 'أوروبا',
    isActive: true,
    priority: 18
  },
  {
    id: 'europa-league',
    nameAr: 'الدوري الأوروبي',
    nameEn: 'UEFA Europa League',
    slug: 'europa-league',
    logoUrl: '/logos/europa-league.png',
    country: 'أوروبا',
    isActive: true,
    priority: 19
  },
  {
    id: 'europa-conference-league',
    nameAr: 'دوري المؤتمر الأوروبي',
    nameEn: 'UEFA Europa Conference League',
    slug: 'europa-conference-league',
    logoUrl: '/logos/europa-conference-league.png',
    country: 'أوروبا',
    isActive: true,
    priority: 20
  },
  {
    id: 'world-cup',
    nameAr: 'كأس العالم',
    nameEn: 'FIFA World Cup',
    slug: 'world-cup',
    logoUrl: '/logos/world-cup.png',
    country: 'عالمي',
    isActive: true,
    priority: 21
  },
  {
    id: 'euro-championship',
    nameAr: 'بطولة أمم أوروبا',
    nameEn: 'UEFA European Championship',
    slug: 'euro-championship',
    logoUrl: '/logos/euro-championship.png',
    country: 'أوروبا',
    isActive: true,
    priority: 22
  },
  {
    id: 'afcon',
    nameAr: 'كأس الأمم الأفريقية',
    nameEn: 'Africa Cup of Nations',
    slug: 'afcon',
    logoUrl: '/logos/afcon.png',
    country: 'أفريقيا',
    isActive: true,
    priority: 23
  },
  {
    id: 'asian-cup',
    nameAr: 'كأس آسيا',
    nameEn: 'AFC Asian Cup',
    slug: 'asian-cup',
    logoUrl: '/logos/asian-cup.png',
    country: 'آسيا',
    isActive: true,
    priority: 24
  },
  {
    id: 'copa-america',
    nameAr: 'كوبا أمريكا',
    nameEn: 'Copa América',
    slug: 'copa-america',
    logoUrl: '/logos/copa-america.png',
    country: 'أمريكا الجنوبية',
    isActive: true,
    priority: 25
  }
];

// ==================== TEAMS DATA ====================
export const MOCK_TEAMS: Team[] = [
  // Premier League Teams
  {
    id: 'manchester-city',
    nameAr: 'مانشستر سيتي',
    nameEn: 'Manchester City',
    logoUrl: '/logos/teams/manchester-city.png',
    leagueId: 'premier-league',
    country: 'إنجلترا',
    founded: 1880,
    stadium: 'ملعب الاتحاد',
    website: 'https://www.mancity.com',
    socialMedia: {
      twitter: '@ManCity',
      instagram: '@mancity',
      facebook: 'ManchesterCity'
    }
  },
  {
    id: 'arsenal',
    nameAr: 'أرسنال',
    nameEn: 'Arsenal',
    logoUrl: '/logos/teams/arsenal.png',
    leagueId: 'premier-league',
    country: 'إنجلترا',
    founded: 1886,
    stadium: 'الإمارات',
    website: 'https://www.arsenal.com',
    socialMedia: {
      twitter: '@Arsenal',
      instagram: '@arsenal',
      facebook: 'Arsenal'
    }
  },
  {
    id: 'liverpool',
    nameAr: 'ليفربول',
    nameEn: 'Liverpool',
    logoUrl: '/logos/teams/liverpool.png',
    leagueId: 'premier-league',
    country: 'إنجلترا',
    founded: 1892,
    stadium: 'أنفيلد',
    website: 'https://www.liverpoolfc.com',
    socialMedia: {
      twitter: '@LFC',
      instagram: '@liverpoolfc',
      facebook: 'LiverpoolFC'
    }
  },
  {
    id: 'manchester-united',
    nameAr: 'مانشستر يونايتد',
    nameEn: 'Manchester United',
    logoUrl: '/logos/teams/manchester-united.png',
    leagueId: 'premier-league',
    country: 'إنجلترا',
    founded: 1878,
    stadium: 'أولد ترافورد',
    website: 'https://www.manutd.com',
    socialMedia: {
      twitter: '@ManUtd',
      instagram: '@manchesterunited',
      facebook: 'ManchesterUnited'
    }
  },
  {
    id: 'chelsea',
    nameAr: 'تشيلسي',
    nameEn: 'Chelsea',
    logoUrl: '/logos/teams/chelsea.png',
    leagueId: 'premier-league',
    country: 'إنجلترا',
    founded: 1905,
    stadium: 'ستامفورد بريدج',
    website: 'https://www.chelseafc.com',
    socialMedia: {
      twitter: '@ChelseaFC',
      instagram: '@chelseafc',
      facebook: 'ChelseaFC'
    }
  },
  {
    id: 'tottenham',
    nameAr: 'توتنهام',
    nameEn: 'Tottenham Hotspur',
    logoUrl: '/logos/teams/tottenham.png',
    leagueId: 'premier-league',
    country: 'إنجلترا',
    founded: 1882,
    stadium: 'توتنهام هوتسبر',
    website: 'https://www.tottenhamhotspur.com',
    socialMedia: {
      twitter: '@SpursOfficial',
      instagram: '@spursofficial',
      facebook: 'TottenhamHotspur'
    }
  },

  // La Liga Teams
  {
    id: 'real-madrid',
    nameAr: 'ريال مدريد',
    nameEn: 'Real Madrid',
    logoUrl: '/logos/teams/real-madrid.png',
    leagueId: 'la-liga',
    country: 'إسبانيا',
    founded: 1902,
    stadium: 'سانتياغو برنابيو',
    website: 'https://www.realmadrid.com',
    socialMedia: {
      twitter: '@realmadrid',
      instagram: '@realmadrid',
      facebook: 'RealMadrid'
    }
  },
  {
    id: 'barcelona',
    nameAr: 'برشلونة',
    nameEn: 'Barcelona',
    logoUrl: '/logos/teams/barcelona.png',
    leagueId: 'la-liga',
    country: 'إسبانيا',
    founded: 1899,
    stadium: 'كامب نو',
    website: 'https://www.fcbarcelona.com',
    socialMedia: {
      twitter: '@FCBarcelona',
      instagram: '@fcbarcelona',
      facebook: 'fcbarcelona'
    }
  },
  {
    id: 'atletico-madrid',
    nameAr: 'أتلتيكو مدريد',
    nameEn: 'Atletico Madrid',
    logoUrl: '/logos/teams/atletico-madrid.png',
    leagueId: 'la-liga',
    country: 'إسبانيا',
    founded: 1903,
    stadium: 'واندا ميتروبوليتانو',
    website: 'https://www.atleticodemadrid.com',
    socialMedia: {
      twitter: '@Atleti',
      instagram: '@atleticodemadrid',
      facebook: 'AtleticoMadrid'
    }
  },

  // Saudi Pro League Teams
  {
    id: 'al-hilal',
    nameAr: 'الهلال',
    nameEn: 'Al Hilal',
    logoUrl: '/logos/teams/al-hilal.png',
    leagueId: 'saudi-pro-league',
    country: 'السعودية',
    founded: 1957,
    stadium: 'استاد الملك فهد',
    website: 'https://www.alhilal.com',
    socialMedia: {
      twitter: '@Alhilal_FC',
      instagram: '@alhilal',
      facebook: 'AlHilal'
    }
  },
  {
    id: 'al-nassr',
    nameAr: 'النصر',
    nameEn: 'Al Nassr',
    logoUrl: '/logos/teams/al-nassr.png',
    leagueId: 'saudi-pro-league',
    country: 'السعودية',
    founded: 1955,
    stadium: 'استاد الملك فهد',
    website: 'https://www.alnassr.com',
    socialMedia: {
      twitter: '@AlNassrFC',
      instagram: '@alnassr',
      facebook: 'AlNassr'
    }
  },
  {
    id: 'al-ittihad',
    nameAr: 'الاتحاد',
    nameEn: 'Al Ittihad',
    logoUrl: '/logos/teams/al-ittihad.png',
    leagueId: 'saudi-pro-league',
    country: 'السعودية',
    founded: 1927,
    stadium: 'استاد الملك عبدالله',
    website: 'https://www.ittihad.com',
    socialMedia: {
      twitter: '@ittihad',
      instagram: '@ittihad',
      facebook: 'AlIttihad'
    }
  }
];

// ==================== MATCHES DATA ====================
export const MOCK_MATCHES: Match[] = [
  // Premier League Matches
  {
    id: 'match-pl-1',
    leagueId: 'premier-league',
    homeTeamId: 'nottingham-forest',
    awayTeamId: 'chelsea',
    homeTeamNameAr: 'نوتنغهام فورست',
    awayTeamNameAr: 'تشيلسي',
    homeTeamNameEn: 'Nottingham Forest',
    awayTeamNameEn: 'Chelsea',
    homeScore: 1,
    awayScore: 2,
    status: 'finished',
    matchTime: '14:30',
    matchDate: 'اليوم',
    stadium: 'سيتي غراوند',
    referee: 'أنتوني تايلور',
    attendance: 29400,
    isLive: false
  },
  {
    id: 'match-pl-2',
    leagueId: 'premier-league',
    homeTeamId: 'brighton',
    awayTeamId: 'newcastle',
    homeTeamNameAr: 'برايتون',
    awayTeamNameAr: 'نيوكاسل',
    homeTeamNameEn: 'Brighton',
    awayTeamNameEn: 'Newcastle',
    homeScore: 2,
    awayScore: 1,
    status: 'finished',
    matchTime: '17:00',
    matchDate: 'اليوم',
    stadium: 'أميكس',
    referee: 'مايكل أوليفر',
    attendance: 31800,
    isLive: false
  },
  {
    id: 'match-pl-3',
    leagueId: 'premier-league',
    homeTeamId: 'manchester-city',
    awayTeamId: 'everton',
    homeTeamNameAr: 'مانشستر سيتي',
    awayTeamNameAr: 'إيفرتون',
    homeTeamNameEn: 'Manchester City',
    awayTeamNameEn: 'Everton',
    homeScore: 3,
    awayScore: 1,
    status: 'live',
    matchTime: '17:00',
    matchDate: 'اليوم',
    stadium: 'ملعب الاتحاد',
    referee: 'بول تيرني',
    attendance: 53400,
    minute: 67,
    isLive: true
  },
  {
    id: 'match-pl-4',
    leagueId: 'premier-league',
    homeTeamId: 'fulham',
    awayTeamId: 'arsenal',
    homeTeamNameAr: 'فولهام',
    awayTeamNameAr: 'أرسنال',
    homeTeamNameEn: 'Fulham',
    awayTeamNameEn: 'Arsenal',
    status: 'scheduled',
    matchTime: '19:30',
    matchDate: 'اليوم',
    stadium: 'كرافن كوتيج',
    referee: 'كريس كافاناغ',
    isLive: false
  },
  {
    id: 'match-pl-5',
    leagueId: 'premier-league',
    homeTeamId: 'liverpool',
    awayTeamId: 'manchester-united',
    homeTeamNameAr: 'ليفربول',
    awayTeamNameAr: 'مانشستر يونايتد',
    homeTeamNameEn: 'Liverpool',
    awayTeamNameEn: 'Manchester United',
    status: 'scheduled',
    matchTime: '20:00',
    matchDate: 'غداً',
    stadium: 'أنفيلد',
    referee: 'مايكل دين',
    isLive: false
  },

  // La Liga Matches
  {
    id: 'match-laliga-1',
    leagueId: 'la-liga',
    homeTeamId: 'real-madrid',
    awayTeamId: 'barcelona',
    homeTeamNameAr: 'ريال مدريد',
    awayTeamNameAr: 'برشلونة',
    homeTeamNameEn: 'Real Madrid',
    awayTeamNameEn: 'Barcelona',
    homeScore: 2,
    awayScore: 1,
    status: 'finished',
    matchTime: '21:00',
    matchDate: 'اليوم',
    stadium: 'سانتياغو برنابيو',
    referee: 'أنتونيو ماتيو لاهوز',
    attendance: 81044,
    isLive: false
  },
  {
    id: 'match-laliga-2',
    leagueId: 'la-liga',
    homeTeamId: 'atletico-madrid',
    awayTeamId: 'sevilla',
    homeTeamNameAr: 'أتلتيكو مدريد',
    awayTeamNameAr: 'إشبيلية',
    homeTeamNameEn: 'Atletico Madrid',
    awayTeamNameEn: 'Sevilla',
    status: 'scheduled',
    matchTime: '19:00',
    matchDate: 'غداً',
    stadium: 'واندا ميتروبوليتانو',
    referee: 'خيسوس خيل مانزانو',
    isLive: false
  },

  // Saudi Pro League Matches
  {
    id: 'match-spl-1',
    leagueId: 'saudi-pro-league',
    homeTeamId: 'al-hilal',
    awayTeamId: 'al-nassr',
    homeTeamNameAr: 'الهلال',
    awayTeamNameAr: 'النصر',
    homeTeamNameEn: 'Al Hilal',
    awayTeamNameEn: 'Al Nassr',
    homeScore: 3,
    awayScore: 1,
    status: 'finished',
    matchTime: '20:00',
    matchDate: 'اليوم',
    stadium: 'استاد الملك فهد',
    referee: 'أحمد الحكيمي',
    attendance: 68752,
    isLive: false
  },
  {
    id: 'match-spl-2',
    leagueId: 'saudi-pro-league',
    homeTeamId: 'al-ittihad',
    awayTeamId: 'al-ahli',
    homeTeamNameAr: 'الاتحاد',
    awayTeamNameAr: 'الأهلي',
    homeTeamNameEn: 'Al Ittihad',
    awayTeamNameEn: 'Al Ahli',
    status: 'scheduled',
    matchTime: '22:00',
    matchDate: 'غداً',
    stadium: 'استاد الملك عبدالله',
    referee: 'خالد الطريس',
    isLive: false
  },

  // Champions League Matches
  {
    id: 'match-ucl-1',
    leagueId: 'champions-league',
    homeTeamId: 'real-madrid',
    awayTeamId: 'manchester-city',
    homeTeamNameAr: 'ريال مدريد',
    awayTeamNameAr: 'مانشستر سيتي',
    homeTeamNameEn: 'Real Madrid',
    awayTeamNameEn: 'Manchester City',
    homeScore: 1,
    awayScore: 1,
    status: 'live',
    matchTime: '22:00',
    matchDate: 'اليوم',
    stadium: 'سانتياغو برنابيو',
    referee: 'دانييلي أورساتو',
    attendance: 81044,
    minute: 34,
    isLive: true
  }
];

// ==================== ARTICLES DATA ====================
export const MOCK_ARTICLES: Article[] = [
  {
    id: 'article-1',
    titleAr: 'أنج: قصتي تنتهي دائماً بكأس',
    titleEn: 'Ange: My story always ends with a trophy',
    subtitleAr: 'مدرب توتنهام يتحدث عن فلسفته في التدريب وطموحاته للفوز بالألقاب',
    bodyAr: 'تحدث أنج بوستيكوغلو، مدرب توتنهام، عن فلسفته في التدريب وطموحاته للفوز بالألقاب مع النادي اللندني. وأكد المدرب الأسترالي أن قصته في التدريب تنتهي دائماً بالفوز بالكؤوس.',
    imageUrl: '/images/ange-postecoglou.jpg',
    publishedAt: '2024-01-15T10:30:00Z',
    source: 'GoalSphere',
    category: 'مقابلات',
    subcategory: 'مدربين',
    isBreaking: true,
    isLive: true,
    views: 125000,
    likes: 3400,
    shares: 890,
    tags: ['توتنهام', 'أنج بوستيكوغلو', 'الدوري الإنجليزي', 'مقابلات'],
    author: 'أحمد محمد',
    relatedTeamIds: ['tottenham'],
    relatedPlayerIds: [],
    relatedLeagueIds: ['premier-league']
  },
  {
    id: 'article-2',
    titleAr: 'عشرة أسئلة مهمة لمباريات نهاية الأسبوع',
    titleEn: 'Ten important questions for weekend matches',
    subtitleAr: 'تحليل شامل لأهم الأسئلة التي تنتظر إجاباتها في مباريات نهاية الأسبوع',
    bodyAr: 'نستعرض في هذا التحليل الشامل أهم الأسئلة التي تنتظر إجاباتها في مباريات نهاية الأسبوع في مختلف البطولات الأوروبية والعربية.',
    imageUrl: '/images/weekend-preview.jpg',
    publishedAt: '2024-01-15T09:15:00Z',
    source: 'GoalSphere',
    category: 'المميزات',
    subcategory: 'تحليل',
    isBreaking: false,
    isLive: false,
    views: 67000,
    likes: 2100,
    shares: 450,
    tags: ['تحليل', 'نهاية الأسبوع', 'مباريات', 'توقعات'],
    author: 'محمد علي',
    relatedTeamIds: [],
    relatedPlayerIds: [],
    relatedLeagueIds: ['premier-league', 'la-liga', 'bundesliga']
  },
  {
    id: 'article-3',
    titleAr: 'تحديث الإصابة: غرافنبرش، كوناتي وأليسون',
    titleEn: 'Injury update: Gravenberch, Konate and Alisson',
    subtitleAr: 'آخر التحديثات حول إصابات لاعبي ليفربول قبل مباراة مانشستر يونايتد',
    bodyAr: 'كشف يورغن كلوب، مدرب ليفربول، عن آخر التحديثات حول إصابات ريان غرافنبرش وإبراهيما كوناتي وأليسون بيكر قبل مباراة مانشستر يونايتد.',
    imageUrl: '/images/liverpool-injuries.jpg',
    publishedAt: '2024-01-15T08:45:00Z',
    source: 'GoalSphere',
    category: 'الإصابات',
    subcategory: 'ليفربول',
    isBreaking: false,
    isLive: false,
    views: 89000,
    likes: 1800,
    shares: 320,
    tags: ['ليفربول', 'إصابات', 'كلوب', 'مانشستر يونايتد'],
    author: 'سارة أحمد',
    relatedTeamIds: ['liverpool', 'manchester-united'],
    relatedPlayerIds: ['gravenberch', 'konate', 'alisson'],
    relatedLeagueIds: ['premier-league']
  },
  {
    id: 'article-4',
    titleAr: 'ماريسكا يتحدث عن نيتو، كايسيدو، فرنانديز والمزيد',
    titleEn: 'Maresca talks about Neto, Caicedo, Fernandez and more',
    subtitleAr: 'مدرب تشيلسي يوضح الوضع الصحي للاعبيه قبل مباراة نوتنغهام فورست',
    bodyAr: 'تحدث ماوريسيو بوتشيتينو، مدرب تشيلسي، عن الوضع الصحي لروبرت سانشيز ومويسيس كايسيدو وإينزو فرنانديز قبل مباراة نوتنغهام فورست.',
    imageUrl: '/images/chelsea-training.jpg',
    publishedAt: '2024-01-15T07:30:00Z',
    source: 'GoalSphere',
    category: 'المقابلات',
    subcategory: 'تشيلسي',
    isBreaking: false,
    isLive: false,
    views: 54000,
    likes: 1200,
    shares: 280,
    tags: ['تشيلسي', 'بوتشيتينو', 'إصابات', 'نوتنغهام فورست'],
    author: 'علي حسن',
    relatedTeamIds: ['chelsea', 'nottingham-forest'],
    relatedPlayerIds: ['neto', 'caicedo', 'fernandez'],
    relatedLeagueIds: ['premier-league']
  }
];

// ==================== PLAYERS DATA ====================
export const MOCK_PLAYERS: Player[] = [
  {
    id: 'mohamed-salah',
    nameAr: 'محمد صلاح',
    nameEn: 'Mohamed Salah',
    position: 'مهاجم',
    teamId: 'liverpool',
    nationality: 'مصر',
    age: 31,
    imageUrl: '/images/players/mohamed-salah.jpg',
    jerseyNumber: 11,
    height: 175,
    weight: 71,
    marketValue: 55000000,
    contractUntil: '2025-06-30',
    goals: 15,
    assists: 8,
    appearances: 20
  },
  {
    id: 'erling-haaland',
    nameAr: 'إيرلينغ هالاند',
    nameEn: 'Erling Haaland',
    position: 'مهاجم',
    teamId: 'manchester-city',
    nationality: 'النرويج',
    age: 23,
    imageUrl: '/images/players/erling-haaland.jpg',
    jerseyNumber: 9,
    height: 194,
    weight: 88,
    marketValue: 180000000,
    contractUntil: '2027-06-30',
    goals: 22,
    assists: 5,
    appearances: 18
  },
  {
    id: 'kylian-mbappe',
    nameAr: 'كيليان مبابي',
    nameEn: 'Kylian Mbappe',
    position: 'مهاجم',
    teamId: 'psg',
    nationality: 'فرنسا',
    age: 25,
    imageUrl: '/images/players/kylian-mbappe.jpg',
    jerseyNumber: 7,
    height: 178,
    weight: 73,
    marketValue: 180000000,
    contractUntil: '2024-06-30',
    goals: 18,
    assists: 3,
    appearances: 16
  },
  {
    id: 'cristiano-ronaldo',
    nameAr: 'كريستيانو رونالدو',
    nameEn: 'Cristiano Ronaldo',
    position: 'مهاجم',
    teamId: 'al-nassr',
    nationality: 'البرتغال',
    age: 39,
    imageUrl: '/images/players/cristiano-ronaldo.jpg',
    jerseyNumber: 7,
    height: 187,
    weight: 83,
    marketValue: 15000000,
    contractUntil: '2025-06-30',
    goals: 25,
    assists: 7,
    appearances: 22
  }
];

// ==================== MANAGERS DATA ====================
export const MOCK_MANAGERS: Manager[] = [
  {
    id: 'pep-guardiola',
    nameAr: 'بيب غوارديولا',
    nameEn: 'Pep Guardiola',
    teamId: 'manchester-city',
    nationality: 'إسبانيا',
    age: 53,
    imageUrl: '/images/managers/pep-guardiola.jpg',
    contractUntil: '2025-06-30',
    previousTeams: ['برشلونة', 'بايرن ميونخ'],
    achievements: ['دوري أبطال أوروبا', 'الدوري الإنجليزي', 'البوندسليجا', 'لا ليجا']
  },
  {
    id: 'jurgen-klopp',
    nameAr: 'يورغن كلوب',
    nameEn: 'Jurgen Klopp',
    teamId: 'liverpool',
    nationality: 'ألمانيا',
    age: 56,
    imageUrl: '/images/managers/jurgen-klopp.jpg',
    contractUntil: '2026-06-30',
    previousTeams: ['بوروسيا دورتموند', 'ماينز'],
    achievements: ['دوري أبطال أوروبا', 'الدوري الإنجليزي', 'البوندسليجا']
  },
  {
    id: 'ange-postecoglou',
    nameAr: 'أنج بوستيكوغلو',
    nameEn: 'Ange Postecoglou',
    teamId: 'tottenham',
    nationality: 'أستراليا',
    age: 58,
    imageUrl: '/images/managers/ange-postecoglou.jpg',
    contractUntil: '2027-06-30',
    previousTeams: ['سيلتيك', 'يوكوهاما إف مارينوس'],
    achievements: ['الدوري الاسكتلندي', 'كأس اسكتلندا']
  }
];

// ==================== NEWS TICKER DATA ====================
export const MOCK_NEWS_TICKER = [
  {
    id: 'ticker-1',
    headlineAr: 'أنج: قصتي تنتهي دائماً بكأس',
    link: '#'
  },
  {
    id: 'ticker-2',
    headlineAr: 'تحديث الإصابة: غرافنبرش، كوناتي وأليسون',
    link: '#'
  },
  {
    id: 'ticker-3',
    headlineAr: 'ماريسكا يتحدث عن نيتو، كايسيدو، فرنانديز والمزيد',
    link: '#'
  },
  {
    id: 'ticker-4',
    headlineAr: 'ليفربول يتصدر الدوري بفارق نقطتين',
    link: '#'
  },
  {
    id: 'ticker-5',
    headlineAr: 'مبابي يقترب من ريال مدريد',
    link: '#'
  },
  {
    id: 'ticker-6',
    headlineAr: 'الهلال يتوج بلقب الدوري السعودي',
    link: '#'
  }
];

// ==================== AD UNITS DATA ====================
export const MOCK_AD_UNITS = [
  {
    id: 'ad-header-1',
    type: 'banner',
    position: 'header',
    content: 'شاهد جميع مباريات الدوري الإنجليزي والدوري السعودي على قناتنا الرياضية',
    ctaText: 'انقر هنا',
    targetUrl: '#',
    isActive: true
  },
  {
    id: 'ad-footer-1',
    type: 'banner',
    position: 'footer',
    content: 'احصل على آخر أخبار كرة القدم والنتائج المباشرة',
    ctaText: 'انقر هنا',
    targetUrl: '#',
    isActive: true
  },
  {
    id: 'ad-incontent-1',
    type: 'banner',
    position: 'in-content',
    content: 'تابع جميع مباريات الدوري السعودي والبطولات الأوروبية',
    ctaText: 'انقر هنا',
    targetUrl: '#',
    isActive: true
  }
];

// ==================== FEATURES DATA ====================
export const MOCK_FEATURES = [
  {
    id: 'feature-1',
    categoryAr: 'المميزات',
    titleAr: 'سباق اللقب يتشكل ليكون كلاسيكياً مطلقاً',
    link: '#'
  },
  {
    id: 'feature-2',
    categoryAr: 'الألعاب المصغرة',
    titleAr: 'هل يمكنك توقع نتائج مباريات هذا الأسبوع؟',
    link: '#'
  },
  {
    id: 'feature-3',
    categoryAr: 'التكتيكات والتحليل',
    titleAr: 'التحليل: أين سيفوز أو يخسر ليفربول ضد مانشستر يونايتد',
    link: '#'
  }
];

// ==================== INTERVIEWS DATA ====================
export const MOCK_INTERVIEWS = [
  {
    id: 'interview-1',
    titleAr: 'ماريسكا يحدث عن...',
    categoryAr: 'المقابلات',
    image: '👨‍💼'
  },
  {
    id: 'interview-2',
    titleAr: 'بيب يحدث عن إصابات ربعية سيتي',
    categoryAr: 'المقابلات',
    image: '👨‍💼'
  },
  {
    id: 'interview-3',
    titleAr: 'سلوت: إيساك أصبح أكثر لياقة الآن...',
    categoryAr: 'المقابلات',
    image: '👨‍💼'
  },
  {
    id: 'interview-4',
    titleAr: 'أموريم: أشعر بدعم النادي',
    categoryAr: 'المقابلات',
    image: '👨‍💼'
  }
];

// ==================== CLUB NEWS DATA ====================
export const MOCK_CLUB_NEWS = [
  {
    id: 'club-news-1',
    titleAr: 'تحديث الإصابة: سولانكي وكولو مواني',
    clubAr: 'بورنموث'
  },
  {
    id: 'club-news-2',
    titleAr: 'إيمري: واتكينز يجب أن يكون جاهزاً لتوتنهام',
    clubAr: 'أستون فيلا'
  },
  {
    id: 'club-news-3',
    titleAr: 'أموريم عن اللحاق بليفربول...',
    clubAr: 'ساوثهامبتون'
  },
  {
    id: 'club-news-4',
    titleAr: 'سيلفا: ستة لاعبين في قائمة إصابات فولهام',
    clubAr: 'فولهام'
  },
  {
    id: 'club-news-5',
    titleAr: 'أنج: قصتي تنتهي دائماً بكأس',
    clubAr: 'توتنهام'
  },
  {
    id: 'club-news-6',
    titleAr: 'بيريرا: لا أشعر بالضغط...',
    clubAr: 'فولهام'
  }
];

// ==================== HELPER FUNCTIONS ====================
export const getMatchesByLeague = (leagueId: string): Match[] => {
  return MOCK_MATCHES.filter(match => match.leagueId === leagueId);
};

export const getMatchesByDate = (date: string): Match[] => {
  return MOCK_MATCHES.filter(match => match.matchDate === date);
};

export const getLiveMatches = (): Match[] => {
  return MOCK_MATCHES.filter(match => match.isLive);
};

export const getBreakingNews = (): Article[] => {
  return MOCK_ARTICLES.filter(article => article.isBreaking);
};

export const getArticlesByCategory = (category: string): Article[] => {
  return MOCK_ARTICLES.filter(article => article.category === category);
};

export const getPlayersByTeam = (teamId: string): Player[] => {
  return MOCK_PLAYERS.filter(player => player.teamId === teamId);
};

export const getManagerByTeam = (teamId: string): Manager | undefined => {
  return MOCK_MANAGERS.find(manager => manager.teamId === teamId);
};

export const getLeagueById = (leagueId: string): League | undefined => {
  return MOCK_LEAGUES.find(league => league.id === leagueId);
};

export const getTeamById = (teamId: string): Team | undefined => {
  return MOCK_TEAMS.find(team => team.id === teamId);
};

export const getArticleById = (articleId: string): Article | undefined => {
  return MOCK_ARTICLES.find(article => article.id === articleId);
};

export const getPlayerById = (playerId: string): Player | undefined => {
  return MOCK_PLAYERS.find(player => player.id === playerId);
};

export const getManagerById = (managerId: string): Manager | undefined => {
  return MOCK_MANAGERS.find(manager => manager.id === managerId);
};

// ==================== STATISTICS DATA ====================
export const MOCK_STATISTICS = {
  totalLeagues: MOCK_LEAGUES.length,
  totalTeams: MOCK_TEAMS.length,
  totalMatches: MOCK_MATCHES.length,
  totalArticles: MOCK_ARTICLES.length,
  totalPlayers: MOCK_PLAYERS.length,
  totalManagers: MOCK_MANAGERS.length,
  liveMatches: getLiveMatches().length,
  breakingNews: getBreakingNews().length,
  activeLeagues: MOCK_LEAGUES.filter(league => league.isActive).length
};

export default {
  MOCK_LEAGUES,
  MOCK_TEAMS,
  MOCK_MATCHES,
  MOCK_ARTICLES,
  MOCK_PLAYERS,
  MOCK_MANAGERS,
  MOCK_NEWS_TICKER,
  MOCK_AD_UNITS,
  MOCK_FEATURES,
  MOCK_INTERVIEWS,
  MOCK_CLUB_NEWS,
  MOCK_STATISTICS,
  getMatchesByLeague,
  getMatchesByDate,
  getLiveMatches,
  getBreakingNews,
  getArticlesByCategory,
  getPlayersByTeam,
  getManagerByTeam,
  getLeagueById,
  getTeamById,
  getArticleById,
  getPlayerById,
  getManagerById
};
