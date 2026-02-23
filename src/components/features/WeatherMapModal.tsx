'use client'

import { Cloud, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

interface WeatherMapModalProps {
    onClose: () => void
}

export default function WeatherMapModal({ onClose }: WeatherMapModalProps) {
    const [mounted, setMounted] = useState(false)
    const [activeFilter, setActiveFilter] = useState('temp')

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!mounted) return null

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-slate-900 rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl border border-white/10 relative" onClick={e => e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b border-white/10 bg-white/5">
                    <h3 className="text-white font-serif text-xl flex items-center gap-2">
                        <Cloud className="h-5 w-5 text-emerald-400" /> Live Weather Radar
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <span className="sr-only">Close</span>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="aspect-[16/9] w-full bg-slate-800 relative">
                    {/* Native CSS Filters Overlay */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                        {[
                            { id: 'temp', label: 'Temperature', icon: '🌡️' },
                            { id: 'rain', label: 'Rain', icon: '🌧️' },
                            { id: 'wind', label: 'Wind', icon: '💨' },
                            { id: 'clouds', label: 'Clouds', icon: '☁️' }
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg backdrop-blur-md ${activeFilter === filter.id
                                    ? 'bg-emerald-600 text-white ring-1 ring-white/20'
                                    : 'bg-black/60 text-slate-200 hover:bg-black/80 hover:text-white'
                                    }`}
                            >
                                <span>{filter.icon}</span> {filter.label}
                            </button>
                        ))}
                    </div>

                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://embed.windy.com/embed2.html?lat=7.873&lon=80.772&detailLat=7.873&detailLon=80.772&width=650&height=450&zoom=7&level=surface&overlay=${activeFilter}&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`}
                        frameBorder="0"
                        className="absolute inset-0 w-full h-full"
                    ></iframe>
                </div>
            </div>
        </div>,
        document.body
    )
}
