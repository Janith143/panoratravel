'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MapPopupProps {
    destination: {
        id: string
        slug: string
        name: string
        description: string
        image: string
        rating?: number
        category: string
    }
}

export default function MapPopup({ destination }: MapPopupProps) {
    // In a real app, we might have multiple images. Simulating slider if we had array.
    const [imgIndex, setImgIndex] = useState(0)
    
    // Fallback if no specific rating
    const rating = destination.rating || 4.8

    return (
        <div className="w-[280px] bg-white rounded-xl overflow-hidden shadow-xl border-0 font-sans">
            <div className="relative h-40 w-full group">
                <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                
                <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-xs font-bold bg-emerald-500 px-2 py-0.5 rounded-full mb-1 inline-block">
                        {destination.category}
                    </span>
                    <h3 className="text-lg font-bold font-serif leading-tight">{destination.name}</h3>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center gap-1 text-yellow-500 mb-2 text-xs">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-bold text-slate-700">{rating}</span>
                    <span className="text-slate-400"> (120+ reviews)</span>
                </div>

                <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {destination.description}
                </p>

                <Link 
                    href={`/destinations/${destination.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-emerald-600 transition-colors group"
                >
                    Explore More
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    )
}
