'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, ZoomControl, useMap, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MapPopup from '../features/MapPopup'

// Fix for default Leaflet marker icons if needed
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
})

interface PlannerInteractiveMapProps {
    destinations: any[]
}

// Controller to handle smooth flyTo animations and bounds fitting
function MapBoundsController({ destinations }: { destinations: any[] }) {
    const map = useMap()

    useEffect(() => {
        if (!map) return

        try {
            if (destinations.length > 0) {
                // Create bounds from all visible destinations
                const validCoords = destinations.filter(d =>
                    d.map &&
                    typeof d.map.lat === 'number' && !isNaN(d.map.lat) &&
                    typeof d.map.lng === 'number' && !isNaN(d.map.lng)
                )

                if (validCoords.length > 0) {
                    const bounds = L.latLngBounds(validCoords.map(d => [d.map.lat, d.map.lng]))
                    if (bounds.isValid()) {
                        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10, animate: true, duration: 1.5 })
                    }
                } else {
                    // Fallback to Sri Lanka center if destinations exist but have no valid coords
                    map.flyTo([7.8731, 80.7718], 7, { duration: 1.5 })
                }
            } else {
                // Default to Sri Lanka center if no destinations
                map.flyTo([7.8731, 80.7718], 7, { duration: 1.5 })
            }
        } catch (error) {
            console.error('Map Controller Error:', error)
        }
    }, [destinations, map])

    return null
}

const createNumberedIcon = (index: number) => {
    const html = `
        <div class="relative w-8 h-8 flex items-center justify-center z-10 transition-transform duration-300 hover:scale-110">
            <div class="absolute inset-0 bg-emerald-600 rounded-full border-2 border-white shadow-md"></div>
            <div class="absolute inset-0 flex items-center justify-center text-white font-bold text-sm z-20">
                ${index + 1}
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-600 rotate-45"></div>
        </div>
    `
    return L.divIcon({
        html: html,
        className: 'planner-map-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 36], // Point at bottom center
        popupAnchor: [0, -36]
    })
}


export default function PlannerInteractiveMap({ destinations }: PlannerInteractiveMapProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null)

    // Filter out destinations without valid coordinates to prevent crashes
    const validDestinations = destinations.filter(d =>
        d.map &&
        typeof d.map.lat === 'number' && !isNaN(d.map.lat) &&
        typeof d.map.lng === 'number' && !isNaN(d.map.lng)
    )

    // Extract coordinates for the polyline connecting destinations in order
    const routeCoordinates = useMemo(() => {
        return validDestinations.map(d => [d.map.lat, d.map.lng] as [number, number])
    }, [validDestinations])

    // Esri World Topo Map - Richer graphics with terrain and shading
    const tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"

    return (
        <div className="h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 relative z-10 group">
            <MapContainer
                center={[7.8731, 80.7718]}
                zoom={7}
                style={{ height: '100%', width: '100%', background: '#dcecf5' }} // Match ocean color of Esri Topo
                zoomControl={false}
                scrollWheelZoom={false}
                dragging={true}
            >
                {/* Custom Styled Tiles */}
                <TileLayer
                    url={tileUrl}
                    attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
                />

                <ZoomControl position="bottomright" />

                {/* Map Controller for Bounds */}
                <MapBoundsController destinations={validDestinations} />

                {/* Connecting Line (Route) */}
                {routeCoordinates.length > 1 && (
                    <Polyline
                        positions={routeCoordinates}
                        pathOptions={{
                            color: '#10b981',
                            weight: 3,
                            dashArray: '8, 8',
                            opacity: 0.8
                        }}
                    />
                )}

                {/* Markers */}
                {validDestinations.map((dest, index) => (
                    <Marker
                        key={dest.id}
                        position={[dest.map.lat, dest.map.lng]}
                        icon={createNumberedIcon(index)}
                        eventHandlers={{
                            click: () => setSelectedId(dest.id),
                            mouseover: (e) => e.target.openPopup(),
                            mouseout: (e) => {
                                if (selectedId !== dest.id) e.target.closePopup()
                            }
                        }}
                    >
                        <Popup closeButton={false} minWidth={280} maxWidth={280} className="custom-popup p-0">
                            <MapPopup destination={dest} />
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Overlay Gradient for premium feel */}
            <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] overflow-hidden">
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
                `}</style>
            </div>
        </div>
    )
}
