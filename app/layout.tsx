import type { Metadata } from 'next'
import { Cairo, Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const cairo = Cairo({ 
  subsets: ['arabic'],
  variable: '--font-cairo',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'GoalSphere - Football News',
  description: 'The premier source for sports news and statistics',
  keywords: 'football, sports news, premier league, champions league, saudi pro league',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${cairo.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-sport-dark text-white antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
