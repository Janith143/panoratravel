'use client'

import { useState, useMemo, useEffect } from 'react'
import { Leaf, Landmark, Compass, PawPrint, Palmtree, Footprints, Lightbulb, Bus, Sun } from 'lucide-react'
import DestinationsLeafletMap from './DestinationsMapWrapper'

// Map categories to icons
const CATEGORY_ICONS: Record<string, any> = {
    'Nature & Ecology': Leaf,
    'Culture & Heritage': Landmark,
    'Adventure & Sports': Compass,
    'Wildlife & Safari': PawPrint,
    'Relax & Wellness': Sun,
    'Beach & Coastal': Palmtree,
    'Heritage': Landmark,
    'Hiking & Trekking': Footprints,
    'Travel Tips': Lightbulb,
    'Transport': Bus
}

function CategoryButton({ category, isActive, onClick, align = 'left' }: { category: string, isActive: boolean, onClick: (cat: string) => void, align?: 'left' | 'right' }) {
    const Icon = CATEGORY_ICONS[category] || Leaf

    return (
        <button
            onClick={() => onClick(category)}
            className={`flex items-center gap-4 group cursor-pointer transition-all duration-300 w-full ${align === 'right' ? 'flex-row-reverse text-right' : 'text-left'}`}
        >
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 transition-all duration-300 relative shadow-lg flex items-center justify-center bg-white z-10
                ${isActive ? 'border-emerald-500 scale-110 text-emerald-600 ring-4 ring-emerald-100' : 'border-slate-200 text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-200 group-hover:scale-105'}
            `}>
                <Icon className={`w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-110'}`} />
            </div>
            <div className="flex-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <h3 className={`text-lg md:text-xl font-serif font-bold transition-colors ${isActive ? 'text-emerald-800' : 'text-slate-400 group-hover:text-slate-700'}`}>
                    {category}
                </h3>
            </div>
        </button>
    )
}

export default function InteractiveMap() {
    const [activeCategories, setActiveCategories] = useState<string[]>(['Culture & Heritage'])
    const [destinations, setDestinations] = useState<any[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Toggle a category on/off (at least one must always remain selected)
    const toggleCategory = (cat: string) => {
        setActiveCategories(prev => {
            if (prev.includes(cat)) {
                // Don't allow deselecting the last one
                if (prev.length === 1) return prev
                return prev.filter(c => c !== cat)
            }
            return [...prev, cat]
        })
    }

    // Fetch data from API to get live updates from Admin Panel
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/admin/content')
                const data = await res.json()
                if (data.destinations) setDestinations(data.destinations)
                if (data.categories) setCategories(data.categories)
            } catch (error) {
                console.error('Failed to load map data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    // Filter destinations based on ALL active categories
    const filteredDestinations = useMemo(() => {
        const activeLower = activeCategories.map(c => c.toLowerCase())
        return destinations.filter(d =>
            d.categories?.some((c: string) => activeLower.includes(c.toLowerCase()))
        )
    }, [destinations, activeCategories])

    // Split categories into left and right columns
    const midPoint = Math.ceil(categories.length / 2)
    const leftCategories = categories.slice(0, midPoint)
    const rightCategories = categories.slice(midPoint)

    if (isLoading) {
        return <div className="py-24 text-center text-slate-400">Loading Map...</div>
    }

    return (
        <section className="py-24 bg-slate-50 overflow-hidden relative">
            <style jsx global>{`
                .leaflet-popup-content-wrapper {
                    padding: 0;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .leaflet-popup-content {
                    margin: 0;
                    width: 280px !important;
                }
                .leaflet-container {
                    font-family: inherit;
                }
            `}</style>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
            </div>

            <div className="container max-w-7xl px-4 md:px-8 relative z-10">
                <div className="text-center mb-12">
                    <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm">Discover Sri Lanka</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mt-2 mb-6">
                        Explore by Category
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Select one or more categories to explore destinations on the map.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left Column Categories */}
                    <div className="lg:col-span-3 flex flex-col gap-4 order-2 lg:order-1">
                        {leftCategories.map((category) => (
                            <CategoryButton
                                key={category}
                                category={category}
                                isActive={activeCategories.includes(category)}
                                onClick={toggleCategory}
                                align="left"
                            />
                        ))}
                    </div>

                    {/* Center Map Display */}
                    <div className="lg:col-span-6 w-full order-1 lg:order-2">
                        <DestinationsLeafletMap
                            destinations={filteredDestinations}
                            activeCategory={activeCategories[0]}
                        />

                        {/* Selected count badge */}
                        {activeCategories.length > 1 && (
                            <div className="text-center mt-4">
                                <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                                    {filteredDestinations.length} destinations across {activeCategories.length} categories
                                </span>
                            </div>
                        )}

                        {/* Map instruction overlay/hint mostly for mobile */}
                        <div className="text-center mt-4 text-sm text-slate-400 lg:hidden">
                            Tap categories to filter map locations
                        </div>
                    </div>

                    {/* Right Column Categories */}
                    <div className="lg:col-span-3 flex flex-col gap-4 order-3 lg:order-3">
                        {rightCategories.map((category) => (
                            <CategoryButton
                                key={category}
                                category={category}
                                isActive={activeCategories.includes(category)}
                                onClick={toggleCategory}
                                align="right"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

