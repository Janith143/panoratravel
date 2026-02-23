'use client'

import { Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { renderToString } from 'react-dom/server'
import { MapPin } from 'lucide-react'
import MapPopup from './MapPopup'
import { useEffect, useRef } from 'react'

interface MapMarkerProps {
    destination: any
    isActive: boolean
    onClick: () => void
}

export default function MapMarker({ destination, isActive, onClick }: MapMarkerProps) {
    const markerRef = useRef<L.Marker>(null)

    // Custom Icon
    const createIcon = (active: boolean) => {
        // We use a divIcon to render complex HTML/CSS
        const colorClass = active ? 'bg-emerald-600' : 'bg-slate-900'
        const scaleClass = active ? 'scale-125' : 'scale-100 hover:scale-110'
        const ringClass = active ? 'ring-4 ring-emerald-400/50' : ''

        const html = `
            <div class="relative transition-all duration-300 ${scaleClass} z-10 w-8 h-8 md:w-10 md:h-10">
                <div class="absolute inset-0 rounded-full border-2 border-white shadow-lg ${colorClass} ${ringClass} flex items-center justify-center text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                ${active ? '<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-600 rotate-45"></div>' : ''}
            </div>
        `

        return L.divIcon({
            html: html,
            className: 'custom-map-marker', // Needs global styles or Tailwind classes if safe
            iconSize: [40, 40],
            iconAnchor: [20, 40], // Point at bottom center
            popupAnchor: [0, -40]
        })
    }

    // Update icon when active state changes
    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.setIcon(createIcon(isActive))
            if (isActive) {
                markerRef.current.openPopup()
            }
        }
    }, [isActive])

    return (
        <Marker
            position={[destination.map.lat, destination.map.lng]}
            icon={createIcon(isActive)}
            ref={markerRef}
            eventHandlers={{
                click: () => onClick(),
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => {
                    // specific logic if we want to auto-close or keep open
                    // usually we keep it open if clicked, or close if just hovered? 
                    // users requested "modern popup", behavior like hover usually works best for exploration
                    if (!isActive) e.target.closePopup()
                }
            }}
        >
            <Popup closeButton={false} minWidth={280} maxWidth={280} className="custom-popup">
                <MapPopup destination={destination} />
            </Popup>
        </Marker>
    )
}
