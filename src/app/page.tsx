import Hero from '@/components/features/Hero'
import StatsSection from '@/components/features/StatsSection'
import ScrollyTellingSection from '@/components/features/ScrollyTellingSection'
import PopularTours from '@/components/features/PopularTours'
import DestinationsGrid from '@/components/features/DestinationsGrid'
import InteractiveMap from '@/components/features/InteractiveMap'
import Testimonials from '@/components/features/Testimonials'
import TrustBadges from '@/components/features/TrustBadges'
import pool from '@/lib/db'
import { getSiteConfig } from '@/lib/content'

export const dynamic = 'force-dynamic' // Ensure page is not statically cached

export default async function Home() {
  let config = getSiteConfig();

  try {
    const [rows] = await pool.query('SELECT value FROM site_config WHERE section_key = ?', ['main_config']);
    if ((rows as any[]).length > 0) {
      // Handle varying mysql driver returns (string vs parsed JSON depending on DB setup)
      const val = (rows as any[])[0].value;
      config = typeof val === 'string' ? JSON.parse(val) : val;
    }
  } catch (e) {
    console.error("Failed to load dynamic site config", e)
  }

  return (
    <>
      <Hero config={config} />
      <StatsSection />
      <ScrollyTellingSection />
      <InteractiveMap />

      {/* Removed Vibe Check Section per user request */}      <PopularTours />
      <DestinationsGrid />

      {/* Testimonials */}
      <Testimonials />

      {/* Trust Badges & Stats */}
      <TrustBadges />

      {/* Services Teaser */}
      <section className="py-20 bg-emerald-900 text-white text-center">
        <div className="container max-w-7xl px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready for an Unforgettable Journey?</h2>
            <p className="text-emerald-100 mb-8 text-lg">Whether you need a luxury vehicle, a certified guide, or a completely custom itinerary, we are here to make it happen.</p>
            <div className="flex justify-center gap-4">
              <a href="/contact" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-emerald-900 font-bold hover:bg-emerald-50 transition-colors">
                Contact Us Today
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
