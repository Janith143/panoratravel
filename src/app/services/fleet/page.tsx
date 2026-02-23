'use client'

import Image from 'next/image'
import { Users, DollarSign, Car } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Fleet360Viewer from '@/components/features/Fleet360Viewer'

export default function FleetPage() {
    const [fleet, setFleet] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/fleet')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setFleet(data)
            })
            .catch(err => console.error(err))
    }, [])

    // Group vehicles by type for 360 viewer
    const vehicleTypes = [...new Set(fleet.map(v => v.type))]

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="bg-slate-900 text-white py-16 text-center">
                <div className="container max-w-4xl px-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Fleet</h1>
                    <p className="text-slate-300 text-lg">Travel in absolute comfort. Choose from our range of well-maintained vehicles.</p>
                </div>
            </div>

            <div className="container max-w-7xl px-4 py-12">
                {/* Fleet Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {fleet.map((vehicle) => (
                        <div key={vehicle.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow group">
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {vehicle.type}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">{vehicle.name}</h3>

                                <div className="flex flex-col mb-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Users className="h-5 w-5 text-emerald-600" />
                                            <span className="font-medium">{vehicle.passengers} Passengers</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1 text-emerald-600 font-bold text-lg">
                                                <DollarSign className="h-5 w-5" />
                                                <span>{vehicle.price}</span>
                                                <span className="text-xs text-slate-400 font-normal">/day</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">with driver</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mt-4 text-xs text-slate-600 space-y-2">
                                        <p className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                                            <span>Includes maximum 150 KM per day.</span>
                                        </p>
                                        <p className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                                            <span>Additional distance is charged at <strong>${vehicle.additionalKmRate || 0}/km</strong>.</span>
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href={`/planner?vehicle=${encodeURIComponent(vehicle.name)}`}
                                    className="block w-full text-center px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    Request This Vehicle
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 360° Virtual Tour Section - Hidden by Request 
                <div className="mt-16">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3">360° Virtual Tour</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Explore our vehicle interiors before you book. Click and drag to look around.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {fleet.slice(0, 4).map((vehicle) => (
                            <Fleet360Viewer
                                key={vehicle.id}
                                vehicleType={vehicle.name}
                                image={vehicle.image}
                            />
                        ))}
                    </div>
                </div>
                */}

                {/* CTA Section */}
                <div className="mt-16 bg-emerald-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-amber-500/20" />
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <Car className="h-12 w-12 mx-auto mb-6 text-emerald-400" />
                        <h2 className="text-3xl font-serif font-bold mb-6">Need a Custom Transport Solution?</h2>
                        <p className="text-emerald-100 mb-8 text-lg">Whether you need an airport transfer or a full-round tour vehicle, we offer competitive rates with no hidden charges.</p>
                        <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-emerald-900 font-bold hover:bg-emerald-50 transition-colors">
                            Request a Quote
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

