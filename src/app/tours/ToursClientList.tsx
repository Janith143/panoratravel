'use client'

import { useState } from 'react'
import TourCard from '@/components/features/TourCard'
import { Tour } from '@/lib/content'

interface ToursClientListProps {
    initialTours: Tour[]
    categories: string[]
}

export default function ToursClientList({ initialTours, categories }: ToursClientListProps) {
    const [selectedCategory, setSelectedCategory] = useState('All')

    const filteredTours = selectedCategory === 'All'
        ? initialTours
        : initialTours.filter(tour => tour.category === selectedCategory)

    return (
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
    )
}
