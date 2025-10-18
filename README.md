# GoalSphere - Football News Platform

## Overview

GoalSphere is a modern web application specializing in football news and statistics with full internationalization support. Built with Next.js 14 and TypeScript, it provides a seamless experience across multiple languages including English, French, German, and Arabic with complete RTL (Right-to-Left) support.

## Technologies Used

### Frontend
- **Next.js 14** - React framework with SSR/SSG support for optimal SEO
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework with RTL support
- **Framer Motion** - Animation library for smooth interactions
- **Lucide React** - Beautiful icon library

### Internationalization (i18n)
- **Custom Translation System** - Built-in translation hook with fallback support
- **RTL Layout Support** - Complete right-to-left layout for Arabic
- **Font Switching** - Cairo font for Arabic, Inter for other languages
- **Language Detection** - Automatic browser language detection

### State Management
- **Redux Toolkit** - Predictable state container
- **React Query** - Server state management and caching

### Backend & Database
- **Next.js API Routes** - Serverless functions
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Prisma ORM** - Type-safe database access

## Key Features

### 🌍 Multi-Language Support
- **English** - Complete interface in English
- **French** - Full French translations
- **German** - Complete German translations
- **Arabic** - Full Arabic translations with RTL layout

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach
- **Dark Theme** - Professional dark interface
- **Smooth Animations** - Framer Motion powered
- **Interactive Components** - Hover effects and transitions

### 📱 Complete Interface
- **Header** - Navigation, search, language switcher, notifications
- **Hero Section** - Featured content display
- **Article Grid** - Responsive article cards with filtering
- **Category Filter** - Filter articles by category
- **Footer** - Links and additional information
- **Ad Integration** - Header, footer, and in-content ads

### ⚡ Performance
- **Fast Loading** - Optimized for speed
- **Image Optimization** - Next.js automatic image optimization
- **Code Splitting** - Automatic code splitting for better performance
- **Caching** - Smart caching strategies

## Project Structure

```
goalsphere/
├── app/                    # Next.js 14 app directory
│   ├── [locale]/          # Internationalized routes
│   │   ├── layout.tsx     # Locale-specific layout
│   │   └── page.tsx       # Main page component
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── HeaderNoI18n.tsx  # Main header component
│   ├── AdUnitNoI18n.tsx  # Advertisement component
│   └── LanguageSwitcherWorking.tsx # Language switcher
├── hooks/                 # Custom React hooks
│   └── useTranslations.ts # Translation hook
├── messages/              # Translation files
│   ├── en.json           # English translations
│   ├── fr.json           # French translations
│   ├── de.json           # German translations
│   └── ar.json           # Arabic translations
├── lib/                   # Utility functions and types
├── store/                 # Redux store configuration
└── middleware.ts          # Next.js middleware for i18n
```

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/badr21b/goalsphere.git
cd goalsphere
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

### 4. Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Language Support

### Available Languages
- **English** (`/en`) - Default language
- **French** (`/fr`) - Complete French interface
- **German** (`/de`) - Complete German interface
- **Arabic** (`/ar`) - Complete Arabic interface with RTL layout

### Language Switching
- Use the language switcher in the header
- Automatic URL routing (`/en`, `/fr`, `/de`, `/ar`)
- Browser language detection
- RTL layout automatically applied for Arabic

## Components Overview

### Header Component
- **Logo & Branding** - GoalSphere branding with trophy icon
- **Navigation Menu** - Home, Matches, Standings, News, Transfers
- **Language Switcher** - Dropdown with flags and language names
- **Search Bar** - Expandable search functionality
- **User Actions** - Notifications, profile, mobile menu

### Main Content
- **Hero Section** - Welcome message and description
- **Category Filter** - Filter articles by category (Transfers, Analysis, Breaking, etc.)
- **Article Grid** - Responsive grid of article cards
- **Ad Integration** - Header, footer, and in-content advertisements

### Footer
- **Brand Information** - GoalSphere branding
- **Quick Links** - Privacy Policy, Terms of Service, Contact Us
- **Footer Ad** - Advertisement space

## Translation System

### Custom Translation Hook
```typescript
import { useTranslations } from '@/hooks/useTranslations'

function MyComponent() {
  const t = useTranslations()
  
  return (
    <h1>{t('home.title')}</h1>
  )
}
```

### Translation Files Structure
```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "readMore": "Read more"
  },
  "navigation": {
    "home": "Home",
    "matches": "Matches",
    "standings": "Standings"
  },
  "home": {
    "title": "GoalSphere",
    "welcome": "Welcome to GoalSphere",
    "description": "Your premier source for football news"
  }
}
```

## RTL Support

### Arabic Layout
- **Text Direction** - Right-to-left text flow
- **Font** - Cairo font for better Arabic readability
- **Layout** - Mirrored layout for RTL languages
- **Navigation** - RTL-optimized navigation structure

## Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting (if configured)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations
- **Lucide** - For beautiful icons
- **Supabase** - For the backend infrastructure

## Contact

For questions or support, please open an issue on GitHub or contact the development team.

---

**GoalSphere** - Bringing football news to the world, one language at a time. ⚽🌍