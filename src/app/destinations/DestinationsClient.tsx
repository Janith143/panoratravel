'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MapPin, Filter, Search, Landmark, Trees,
    PawPrint, Waves, Mountain, Footprints, X
} from 'lucide-react'

import {
    getCategories, getAttractions,
    getDistrictName, getTouristRegions, TouristRegion
} from '@/lib/content'
import LeafletMapWrapper from '@/components/features/LeafletMapWrapper'

const categoryIcons: { [key: string]: React.ReactNode } = {
    heritage: <Landmark className="w-4 h-4" />,
    nature: <Trees className="w-4 h-4" />,
    wildlife: <PawPrint className="w-4 h-4" />,
    beach: <Waves className="w-4 h-4" />,
    adventure: <Mountain className="w-4 h-4" />,
    hiking: <Footprints className="w-4 h-4" />
}

export default function DestinationsClient() {
    const touristRegions = getTouristRegions()
    const categories = getCategories()
    const allAttractions = getAttractions()

    const searchParams = useSearchParams()
    const categoryParam = searchParams.get('category') || ''

    // Resolve incoming category name (e.g. "Nature") to ID (e.g. "nature")
    // If not found, assume it might be an ID.
    const initialCategoryId = useMemo(() => {
        if (!categoryParam) return ''
        const found = categories.find(c =>
            c.name.toLowerCase() === categoryParam.toLowerCase() ||
            c.id.toLowerCase() === categoryParam.toLowerCase()
        )
        return found ? found.id : categoryParam.toLowerCase()
    }, [categoryParam, categories])

    const [selectedRegion, setSelectedRegion] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId)
    const [searchQuery, setSearchQuery] = useState('')
    const [showFilters, setShowFilters] = useState(false)

    // Update selectedCategory if URL param changes (e.g. navigating from Navbar)
    useEffect(() => {
        if (initialCategoryId) {
            setSelectedCategory(initialCategoryId)
        }
    }, [initialCategoryId])

    const filteredAttractions = useMemo(() => {
        let results = allAttractions

        // Filter by tourist region
        if (selectedRegion) {
            const region = touristRegions.find(r => r.id === selectedRegion)
            if (region) {
                results = results.filter(a => region.districts.includes(a.district))
            }
        }

        if (selectedCategory) {
            results = results.filter(a => a.categories.includes(selectedCategory))
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            results = results.filter(a =>
                a.name.toLowerCase().includes(query) ||
                a.description.toLowerCase().includes(query)
            )
        }

        return results
    }, [allAttractions, selectedRegion, selectedCategory, searchQuery, touristRegions])

    const clearFilters = () => {
        setSelectedRegion('')
        setSelectedCategory('')
        setSearchQuery('')
    }

    const hasActiveFilters = selectedRegion || selectedCategory || searchQuery

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Hero Header */}
            <div className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/40" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578564969245-8c7c938c8236?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                <div className="container max-w-7xl px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Explore Sri Lanka</h1>
                    <p className="text-slate-200 max-w-2xl mx-auto text-lg mb-8">
                        Discover 100+ destinations across all 25 districts. Filter by region, category, or search for your perfect adventure.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search destinations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="container max-w-7xl px-4 py-4">
                    <div className="flex flex-wrap items-center gap-4">


                        {/* Category Tabs - Desktop */}
                        <div className="hidden md:flex items-center gap-2 ml-auto">
                            <button
                                onClick={() => setSelectedCategory('')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedCategory
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.id
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {categoryIcons[cat.id]}
                                    <span className="hidden lg:inline">{cat.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm ml-auto"
                        >
                            <Filter className="w-4 h-4" />
                            Categories
                        </button>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
                            >
                                <X className="w-4 h-4" />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Mobile Category Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="md:hidden overflow-hidden"
                            >
                                <div className="flex flex-wrap gap-2 pt-4">
                                    <button
                                        onClick={() => setSelectedCategory('')}
                                        className={`px-3 py-1.5 rounded-full text-sm ${!selectedCategory
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${selectedCategory === cat.id
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-slate-100 text-slate-600'
                                                }`}
                                        >
                                            {categoryIcons[cat.id]}
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Results Count */}
            <div className="container max-w-7xl px-4 py-6">
                <p className="text-slate-600">
                    Showing <span className="font-semibold text-slate-900">{filteredAttractions.length}</span> destinations
                    {hasActiveFilters && ' (filtered)'}
                </p>
            </div>

            {/* Main Content: Map Sidebar + Grid */}
            <div className="container max-w-7xl px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Map Sidebar */}
                    <div className="lg:w-[400px] flex-shrink-0">
                        <div className="sticky top-24">
                            <LeafletMapWrapper
                                selectedRegion={selectedRegion}
                                onRegionSelect={setSelectedRegion}
                            />

                            <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-emerald-800 mb-1">
                                    {selectedRegion
                                        ? touristRegions.find(r => r.id === selectedRegion)?.name
                                        : "Explore Sri Lanka"}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {selectedRegion
                                        ? touristRegions.find(r => r.id === selectedRegion)?.description
                                        : "Click on a zone on the map to filter destinations by region."}
                                </p>
                                {selectedRegion && (
                                    <button
                                        onClick={() => setSelectedRegion('')}
                                        className="mt-3 text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                                    >
                                        <X className="w-3 h-3" />
                                        Clear Selection
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Destinations Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredAttractions.map((attraction, index) => (
                                    <motion.div
                                        key={attraction.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: Math.min(index * 0.05, 0.3) }}
                                    >
                                        <Link
                                            href={`/destinations/${attraction.id}`}
                                            className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                                        >
                                            <div className="relative h-56 overflow-hidden">
                                                <Image
                                                    src={attraction.image || `https://images.unsplash.com/photo-1578564969245-8c7c938c8236?w=600&h=400&fit=crop`}
                                                    alt={attraction.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <h3 className="text-xl font-bold text-white font-serif">{attraction.name}</h3>
                                                    <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {getDistrictName(attraction.district)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                                                    {attraction.description}
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {attraction.categories.map(catId => (
                                                        <span
                                                            key={catId}
                                                            className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
                                                        >
                                                            {categoryIcons[catId]}
                                                            {categories.find(c => c.id === catId)?.name || catId}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {filteredAttractions.length === 0 && (
                            <div className="text-center py-16">
                                <p className="text-slate-500 text-lg">No destinations found matching your filters.</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
