import Hero from '@/components/features/Hero'
import StatsSection from '@/components/features/StatsSection'
import ScrollyTellingSection from '@/components/features/ScrollyTellingSection'
import PopularTours from '@/components/features/PopularTours'
import DestinationsGrid from '@/components/features/DestinationsGrid'
import InteractiveMap from '@/components/features/InteractiveMap'
import Testimonials from '@/components/features/Testimonials'
import TrustBadges from '@/components/features/TrustBadges'

export default function Home() {
  return (
    <>
      <Hero />
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
