'use client'

import { useState } from 'react'
import { getTouristRegions, TouristRegion } from '@/lib/content'

interface TouristRegionMapProps {
    selectedRegion: string
    onRegionSelect: (regionId: string) => void
}

export default function TouristRegionMap({ selectedRegion, onRegionSelect }: TouristRegionMapProps) {
    const regions = getTouristRegions()
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

    const handleClick = (regionId: string) => {
        if (selectedRegion === regionId) {
            onRegionSelect('') // Deselect
        } else {
            onRegionSelect(regionId)
        }
    }

    const getRegionFill = (regionId: string) => {
        if (selectedRegion === regionId) return '#059669' // emerald-600
        if (hoveredRegion === regionId) return '#34d399' // emerald-400
        return '#d1fae5' // emerald-100
    }

    const getRegionStroke = (regionId: string) => {
        if (selectedRegion === regionId) return '#064e3b' // emerald-900
        return '#10b981' // emerald-500
    }

    // Simplified SVG paths representing 5 tourist regions of Sri Lanka
    // These are approximate shapes for visual representation
    const regionPaths: { [key: string]: string } = {
        'north': 'M 80 10 L 120 10 L 130 50 L 140 90 L 120 120 L 80 120 L 60 90 L 50 50 Z',
        'east': 'M 140 90 L 160 130 L 150 180 L 140 220 L 120 200 L 120 120 Z',
        'hill-country': 'M 80 120 L 120 120 L 120 200 L 100 220 L 70 200 L 60 160 Z',
        'south': 'M 70 200 L 100 220 L 120 200 L 140 220 L 130 260 L 90 280 L 50 260 L 50 220 Z',
        'west': 'M 50 50 L 60 90 L 60 160 L 50 220 L 30 200 L 20 140 L 30 80 Z'
    }

    return (
        <div className="relative w-full max-w-xs mx-auto">
            {/* Legend */}
            <div className="mb-4 text-center">
                <h3 className="text-sm font-bold text-slate-700 mb-2">Select a Region</h3>
                <p className="text-xs text-slate-500">Click on the map to filter destinations</p>
            </div>

            {/* SVG Map */}
            <svg
                viewBox="0 0 180 300"
                className="w-full h-auto drop-shadow-lg"
                style={{ maxHeight: '350px' }}
            >
                {/* Background */}
                <rect x="0" y="0" width="180" height="300" fill="#f1f5f9" rx="8" />

                {/* Ocean */}
                <rect x="0" y="0" width="180" height="300" fill="#bfdbfe" rx="8" opacity="0.3" />

                {/* Region Paths */}
                {Object.entries(regionPaths).map(([regionId, path]) => (
                    <path
                        key={regionId}
                        d={path}
                        fill={getRegionFill(regionId)}
                        stroke={getRegionStroke(regionId)}
                        strokeWidth={selectedRegion === regionId ? 3 : 1.5}
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredRegion(regionId)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        onClick={() => handleClick(regionId)}
                    />
                ))}

                {/* Region Labels */}
                <text x="90" y="65" textAnchor="middle" className="text-[8px] font-bold fill-emerald-900 pointer-events-none">North</text>
                <text x="145" y="160" textAnchor="middle" className="text-[8px] font-bold fill-emerald-900 pointer-events-none">East</text>
                <text x="90" y="165" textAnchor="middle" className="text-[8px] font-bold fill-emerald-900 pointer-events-none">Hills</text>
                <text x="90" y="250" textAnchor="middle" className="text-[8px] font-bold fill-emerald-900 pointer-events-none">South</text>
                <text x="35" y="140" textAnchor="middle" className="text-[8px] font-bold fill-emerald-900 pointer-events-none">West</text>
            </svg>

            {/* Region Info Panel */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 min-h-[60px]">
                {selectedRegion ? (
                    <>
                        <p className="font-bold text-emerald-700 text-sm">
                            {regions.find(r => r.id === selectedRegion)?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                            {regions.find(r => r.id === selectedRegion)?.description}
                        </p>
                    </>
                ) : hoveredRegion ? (
                    <>
                        <p className="font-bold text-slate-700 text-sm">
                            {regions.find(r => r.id === hoveredRegion)?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                            {regions.find(r => r.id === hoveredRegion)?.description}
                        </p>
                    </>
                ) : (
                    <p className="text-xs text-slate-400 text-center">Hover or click a region to explore</p>
                )}
            </div>
        </div>
    )
}
