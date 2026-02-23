'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getDestinations } from '@/lib/content'

export default function DestinationsGrid() {
    const destinations = getDestinations()
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container max-w-7xl px-4 md:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-emerald-600 font-semibold tracking-wide uppercase text-sm">Explore the Island</span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mt-2 mb-4">Top Destinations</h2>
                    <p className="text-slate-500">From the golden beaches of the south to the misty tea plantations of the central highlands, discover the diversity of Sri Lanka.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[600px] md:h-[500px]">
                    {destinations.slice(0, 5).map((dest, index) => (
                        <Link
                            key={dest.id}
                            href={`/destinations/${dest.slug}`}
                            className={`group relative overflow-hidden rounded-2xl block h-full ${index === 0 ? 'md:col-span-2 md:row-span-1' : ''}`}
                        >
                            {/* Background Image */}
                            <Image
                                src={dest.image}
                                alt={dest.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 font-serif">{dest.name}</h3>
                                <p className="text-white/80 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 md:max-w-[80%]">
                                    {dest.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
