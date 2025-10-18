# Internationalization (i18n) Implementation

This document describes the internationalization implementation for GoalSphere, supporting English, French, German, and Arabic languages.

## Overview

The application uses `next-intl` for internationalization, providing:
- Automatic language detection based on browser/system language
- Language switching with URL-based routing
- RTL support for Arabic
- Comprehensive translation coverage

## Supported Languages

- **English (en)** - Default language
- **French (fr)** - Français
- **German (de)** - Deutsch  
- **Arabic (ar)** - العربية

## File Structure

```
├── app/
│   ├── [locale]/                 # Locale-specific pages
│   │   ├── layout.tsx           # Locale layout with RTL/LTR support
│   │   ├── page.tsx             # Main page with translations
│   │   ├── test/                # Test pages
│   │   └── test-i18n/           # i18n testing page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Root redirect to /en
├── components/                   # All components updated with translations
├── messages/                     # Translation files
│   ├── en.json                  # English translations
│   ├── fr.json                  # French translations
│   ├── de.json                  # German translations
│   └── ar.json                  # Arabic translations
├── middleware.ts                # Language detection and routing
├── i18n.ts                      # next-intl configuration
└── next.config.js               # Updated with next-intl plugin
```

## Translation Keys Structure

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "readMore": "Read more",
    "advertisement": "Advertisement",
    "clickHere": "Click here",
    "views": "views",
    "hoursAgo": "hours ago",
    "minutesAgo": "minutes ago",
    "lastUpdate": "Last update",
    "noMatches": "No matches currently",
    "home": "Home",
    "away": "Away",
    "live": "Live",
    "finished": "Finished",
    "upcoming": "Upcoming",
    "breaking": "Breaking",
    "allCategories": "All Categories"
  },
  "navigation": {
    "home": "Home",
    "matches": "Matches",
    "standings": "Standings",
    "news": "News",
    "transfers": "Transfers",
    "search": "Search in news and matches...",
    "notifications": "Notifications",
    "profile": "Profile",
    "previousArticle": "Previous article",
    "nextArticle": "Next article",
    "goToSlide": "Go to slide"
  },
  "categories": {
    "transfers": "Transfers",
    "analysis": "Analysis",
    "breaking": "Breaking News",
    "premier-league": "Premier League",
    "champions-league": "Champions League",
    "saudi-pro-league": "Saudi Pro League",
    "la-liga": "La Liga",
    "serie-a": "Serie A",
    "bundesliga": "Bundesliga"
  },
  "home": {
    "title": "GoalSphere",
    "subtitle": "Football news in English",
    "description": "The premier source for sports news and statistics",
    "welcome": "Welcome to GoalSphere",
    "heroDescription": "The premier source for sports news and statistics",
    "latestNews": "Latest News",
    "articleTitle": "Article {number} - Important sports news",
    "articleContent": "This is sample article content. You can read more details here...",
    "imagePlaceholder": "Article image {number}",
    "adContent": {
      "header": "Watch all Premier League and Saudi Pro League matches on our sports channel",
      "footer": "Get the latest football news and live results",
      "inContent": "Follow all Saudi Pro League and European competitions"
    }
  },
  "footer": {
    "title": "GoalSphere",
    "description": "The premier source for sports news and statistics in the Arab world",
    "privacyPolicy": "Privacy Policy",
    "termsOfService": "Terms of Service",
    "contactUs": "Contact Us"
  },
  "liveTicker": {
    "title": "Live News",
    "noMatches": "No matches currently"
  },
  "adUnit": {
    "closeAd": "Close ad",
    "adSpace": "Ad space - click to interact"
  }
}
```

## Usage in Components

### Basic Translation
```tsx
import { useTranslations } from 'next-intl'

export default function MyComponent() {
  const t = useTranslations()
  
  return <h1>{t('home.title')}</h1>
}
```

### Translation with Parameters
```tsx
// For dynamic content
<p>{t('home.articleTitle', { number: 1 })}</p>
<p>{t('common.hoursAgo', { count: 2 })}</p>
```

### Namespace-specific Translations
```tsx
const t = useTranslations('navigation')
// Now you can use: t('home'), t('matches'), etc.
```

## Language Detection and Switching

### Automatic Detection
- The middleware automatically detects the user's preferred language from browser settings
- Falls back to English if the detected language is not supported
- Redirects root path (/) to the default locale (/en)

### Manual Language Switching
- Language switcher component in the header
- Shows current language with flag and name
- Dropdown with all available languages
- Updates URL and re-renders content immediately

### URL Structure
- `/en/` - English
- `/fr/` - French  
- `/de/` - German
- `/ar/` - Arabic

## RTL Support

### Arabic Language Support
- Automatic RTL layout when Arabic is selected
- Proper text alignment and direction
- Font switching (Cairo for Arabic, Inter for other languages)
- CSS classes for RTL-specific styling

### CSS Classes
```css
[dir="rtl"] body {
  direction: rtl;
  text-align: right;
}
```

## Testing

### Test Page
Visit `/en/test-i18n/` (or any locale) to see all translations in action.

### Manual Testing
1. Visit the application
2. Use the language switcher in the header
3. Verify all text changes to the selected language
4. Check RTL behavior for Arabic
5. Test URL routing with different locales

## Adding New Translations

1. Add the new key to all language files in `/messages/`
2. Use the key in your component with `t('key')`
3. Test with all supported languages

## Adding New Languages

1. Add the locale to `i18n.ts` and `middleware.ts`
2. Create a new translation file in `/messages/`
3. Update the `LanguageSwitcher` component
4. Test the new language thoroughly

## Performance Considerations

- Translations are loaded on-demand per locale
- No unnecessary re-renders when switching languages
- Optimized bundle splitting by locale
- Efficient middleware for language detection

## Browser Support

- Modern browsers with JavaScript enabled
- Proper RTL support in all major browsers
- Fallback to English for unsupported browsers
- Responsive design works across all languages
