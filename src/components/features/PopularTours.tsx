import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTours } from '@/lib/content'
import TourCard from './TourCard'

export default function PopularTours() {
    const tours = getTours()
    return (
        <section className="py-16 md:py-24 bg-muted/50">
            <div className="container max-w-7xl px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="space-y-2">
                        <span className="text-emerald-600 font-semibold tracking-wide uppercase text-sm">Curated Experiences</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">Popular Tour Packages</h2>
                    </div>
                    <Link href="/tours" className="group inline-flex items-center font-medium text-emerald-600 hover:text-emerald-700">
                        View all tours <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tours.map((tour) => (
                        <TourCard key={tour.id} tour={tour} />
                    ))}
                </div>
            </div>
        </section>
    )
}
