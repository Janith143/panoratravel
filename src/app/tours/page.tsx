import { getCategories } from '@/lib/content'
import { getToursDB } from '@/lib/db-content'
import ToursClientList from './ToursClientList'

export default async function ToursPage() {
    const tours = await getToursDB()
    const categories = getCategories().map(c => c.name)

    return (
        <div className="bg-muted/30 min-h-screen">
            {/* Header */}
            <div className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/20" />
                <div className="container max-w-7xl px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Tour Packages</h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg">Hand-picked itineraries designed to showcase the very best of Sri Lanka. All fully customizable to suit your travel style.</p>
                </div>
            </div>

            <ToursClientList initialTours={tours} categories={categories} />
        </div>
    )
}
