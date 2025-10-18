export interface HeroContent {
  id: string
  title: string
  subtitle: string
  description: string
  backgroundImage: string
  gradient: string
  isActive: boolean
  priority: number
}

export const heroContentData: HeroContent[] = [
  {
    id: 'premier-league',
    title: 'Premier League',
    subtitle: 'The most competitive league in the world',
    description: 'Follow every match, transfer, and breaking news from England\'s top flight',
    backgroundImage: '/images/heroes/premier-league.jpg',
    gradient: 'from-blue-600/20 to-red-600/20',
    isActive: true,
    priority: 1
  },
  {
    id: 'champions-league',
    title: 'Champions League',
    subtitle: 'Europe\'s elite competition',
    description: 'Experience the drama of the world\'s most prestigious club tournament',
    backgroundImage: '/images/heroes/champions-league.jpg',
    gradient: 'from-blue-800/20 to-yellow-500/20',
    isActive: true,
    priority: 2
  },
  {
    id: 'world-cup',
    title: 'World Cup',
    subtitle: 'The greatest show on earth',
    description: 'Celebrate the pinnacle of international football every four years',
    backgroundImage: '/images/heroes/world-cup.jpg',
    gradient: 'from-green-600/20 to-yellow-500/20',
    isActive: true,
    priority: 3
  },
  {
    id: 'la-liga',
    title: 'La Liga',
    subtitle: 'Spanish football excellence',
    description: 'Discover the magic of Spanish football with Real Madrid, Barcelona, and more',
    backgroundImage: '/images/heroes/la-liga.jpg',
    gradient: 'from-red-600/20 to-yellow-500/20',
    isActive: true,
    priority: 4
  },
  {
    id: 'serie-a',
    title: 'Serie A',
    subtitle: 'Italian football passion',
    description: 'Experience the tactical brilliance and passion of Italian football',
    backgroundImage: '/images/heroes/serie-a.jpg',
    gradient: 'from-green-600/20 to-blue-600/20',
    isActive: true,
    priority: 5
  },
  {
    id: 'bundesliga',
    title: 'Bundesliga',
    subtitle: 'German football precision',
    description: 'Witness the efficiency and excitement of German football',
    backgroundImage: '/images/heroes/bundesliga.jpg',
    gradient: 'from-red-600/20 to-yellow-500/20',
    isActive: true,
    priority: 6
  },
  {
    id: 'saudi-pro-league',
    title: 'Saudi Pro League',
    subtitle: 'Rising stars of Middle East',
    description: 'Follow the exciting developments in Saudi Arabian football',
    backgroundImage: '/images/heroes/saudi-pro-league.jpg',
    gradient: 'from-green-600/20 to-white/20',
    isActive: true,
    priority: 7
  },
  {
    id: 'default',
    title: 'GoalSphere',
    subtitle: 'Your premier source for sports news',
    description: 'Stay updated with the latest football news, transfers, and statistics from around the world',
    backgroundImage: '/images/heroes/default.jpg',
    gradient: 'from-purple-600/20 to-gold-500/20',
    isActive: true,
    priority: 10
  }
]

export function getHeroContent(leagueId?: string): HeroContent {
  if (leagueId) {
    const content = heroContentData.find(item => item.id === leagueId && item.isActive)
    if (content) return content
  }
  
  // Return random active content or default
  const activeContent = heroContentData.filter(item => item.isActive && item.id !== 'default')
  if (activeContent.length > 0) {
    const randomIndex = Math.floor(Math.random() * activeContent.length)
    return activeContent[randomIndex]
  }
  
  return heroContentData.find(item => item.id === 'default')!
}

export function getHeroContentByCategory(category: string): HeroContent {
  const categoryMap: Record<string, string> = {
    'premier-league': 'premier-league',
    'champions-league': 'champions-league',
    'la-liga': 'la-liga',
    'serie-a': 'serie-a',
    'bundesliga': 'bundesliga',
    'saudi-pro-league': 'saudi-pro-league',
    'world-cup': 'world-cup'
  }
  
  const leagueId = categoryMap[category]
  if (leagueId) {
    return getHeroContent(leagueId)
  }
  
  return getHeroContent()
}
