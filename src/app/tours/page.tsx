'use client'

import { useState } from 'react'
import TourCard from '@/components/features/TourCard'
import { getTours, getCategories } from '@/lib/content'

export default function ToursPage() {
    const tours = getTours()
    const categories = getCategories().map(c => c.name)
    const [selectedCategory, setSelectedCategory] = useState('All')

    const filteredTours = selectedCategory === 'All'
        ? tours
        : tours.filter(tour => tour.category === selectedCategory) // Assuming tour has 'category' field matching string.

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

            <div className="container max-w-7xl px-4 py-12 md:py-16">
                {/* Filters - Dynamic from Admin */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {['All', ...categories].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setSelectedCategory(filter)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === filter ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-emerald-50'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {filteredTours.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTours.map((tour) => (
                            <TourCard key={tour.id} tour={tour} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <p>No tours found in {selectedCategory}.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
