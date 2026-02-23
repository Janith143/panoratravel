'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MapMarker from './MapMarker'

// Fix for default Leaflet marker icons if needed (we use custom mostly)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
})

interface DestinationsMapProps {
    destinations: any[]
    activeCategory: string
}

// Controller to handle smooth flyTo animations
function MapController({ destinations }: { destinations: any[] }) {
    const map = useMap()

    useEffect(() => {
        if (destinations.length > 0) {
            // Create bounds from all visible destinations
            const bounds = L.latLngBounds(destinations.map(d => [d.map.lat, d.map.lng]))

            // Pad the bounds so markers aren't on the edge
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10, animate: true, duration: 1.5 })
        } else {
            // Default to Sri Lanka center if no destinations
            map.flyTo([7.8731, 80.7718], 7, { duration: 1.5 })
        }
    }, [destinations, map])

    return null
}

export default function DestinationsLeafletMap({ destinations, activeCategory }: DestinationsMapProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null)

    // Filter out destinations without valid coordinates to prevent crashes
    // Filter out destinations without valid coordinates to prevent crashes
    const validDestinations = destinations.filter(d =>
        d.map &&
        typeof d.map.lat === 'number' && !isNaN(d.map.lat) &&
        typeof d.map.lng === 'number' && !isNaN(d.map.lng)
    )

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
                // Removing extreme filter class here, handling in global CSS if needed or just cleaner look
                />

                <ZoomControl position="bottomright" />

                {/* Map Controller for Animations */}
                <MapController destinations={validDestinations} />

                {/* Markers */}
                {validDestinations.map((dest) => (
                    <MapMarker
                        key={dest.id}
                        destination={dest}
                        isActive={selectedId === dest.id}
                        onClick={() => setSelectedId(dest.id)}
                    />
                ))}
            </MapContainer>

            {/* Overlay Gradient for premium feel */}
            <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_0_40px_rgba(0,0,0,0.1)]"></div>
        </div>
    )
}
