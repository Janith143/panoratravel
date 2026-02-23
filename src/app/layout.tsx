import type { Metadata } from 'next'
import { inter, playfair, outfit } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/features/WhatsAppButton'
import StickyCTA from '@/components/features/StickyCTA'

export const metadata: Metadata = {
  title: {
    default: 'Panora Travels | Premium Sri Lanka Travel Agency',
    template: '%s | Panora Travels',
  },
  description: 'Discover the real Sri Lanka with Panora Travels. Tailor-made tours, luxury vehicles, and authentic cultural experiences with expert local guides.',
  keywords: ['Sri Lanka Travel', 'Luxury Tours', 'Sri Lanka Tourism', 'Tailor-Made Holidays', 'Pearl of the Indian Ocean', 'Safari Sri Lanka'],
  authors: [{ name: 'Panora Travels' }],
  creator: 'Panora Travels',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://panoratravels.com',
    title: 'Panora Travels | Premium Sri Lanka Travel Agency',
    description: 'Discover the real Sri Lanka with Panora Travels. Authentic journeys, luxury comfort.',
    siteName: 'Panora Travels',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Panora Travels | Sri Lanka Travel',
    description: 'Your gateway to the island paradise. Expert guides, luxury fleet, unforgettable memories.',
  }
}

import { ServiceWorkerCleaner } from '@/components/utils/ServiceWorkerCleaner'
import AuthProvider from '@/components/auth/AuthProvider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn(inter.variable, playfair.variable, outfit.variable)}>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-background text-foreground selection:bg-primary selection:text-white">
        <AuthProvider>
          <ServiceWorkerCleaner />
          <Navbar />
          <main className="flex-grow pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <StickyCTA />
        </AuthProvider>
      </body>
    </html>
  )
}

