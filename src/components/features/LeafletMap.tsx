'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import * as turf from '@turf/turf'
import 'leaflet/dist/leaflet.css'
import { Feature, FeatureCollection, Geometry } from 'geojson'

const districtToZone: { [key: string]: number } = {
    // Zone 1: North & East
    "LK41": 1, "LK42": 1, "LK45": 1, "LK43": 1, "LK44": 1, "LK53": 1, "LK51": 1, "LK52": 1,
    // Zone 2: Cultural Triangle
    "LK71": 2, "LK72": 2, "LK22": 2, "LK61": 2,
    // Zone 3: Hill Country
    "LK21": 3, "LK23": 3, "LK81": 3, "LK82": 3, "LK92": 3, "LK91": 3,
    // Zone 4: West Coast
    "LK62": 4, "LK12": 4, "LK11": 4, "LK13": 4,
    // Zone 5: South Coast
    "LK31": 5, "LK32": 5, "LK33": 5
}

const zoneColors: { [key: number]: string } = {
    1: "#3498db", 2: "#e67e22", 3: "#2ecc71", 4: "#e74c3c", 5: "#9b59b6"
}

const zoneNames: { [key: number]: string } = {
    1: "North & East Region",
    2: "Cultural Triangle",
    3: "Hill Country",
    4: "West Coast",
    5: "South Coast"
}

interface LeafletMapProps {
    selectedRegion: string
    onRegionSelect: (regionId: string) => void
}

function MapController({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
    const map = useMap()
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds)
        }
    }, [bounds, map])
    return null
}

export default function LeafletMap({ selectedRegion, onRegionSelect }: LeafletMapProps) {
    const [geoData, setGeoData] = useState<FeatureCollection | null>(null)
    const [bounds, setBounds] = useState<L.LatLngBoundsExpression | null>(null)

    useEffect(() => {
        fetch('/data/lk.json?v=' + new Date().getTime())
            .then(res => res.json())
            .then(rawData => {
                const unifiedFeatures: Feature[] = []
                const zonesArrays: { [key: number]: Feature[] } = { 1: [], 2: [], 3: [], 4: [], 5: [] }

                // Group features by zone
                if (rawData.features) {
                    rawData.features.forEach((feature: any) => {
                        const districtId = feature.properties.id
                        const zoneId = districtToZone[districtId]
                        if (zoneId) {
                            feature.properties.zoneId = zoneId
                            zonesArrays[zoneId].push(feature)
                        }
                    })
                }

                // Union features
                Object.keys(zonesArrays).forEach((zIdStr) => {
                    const zId = parseInt(zIdStr)
                    const features = zonesArrays[zId]
                    if (features.length === 0) return

                    let merged: Feature | null = null
                    try {
                        if (features.length === 1) {
                            merged = features[0]
                        } else {
                            const fc: FeatureCollection = {
                                type: "FeatureCollection",
                                features: features
                            }
                            // Turf v7 supports unioning a FeatureCollection directly
                            // Cast to any to bypass strict Geometry type check (we know they are Polygons)
                            merged = turf.union(fc as any) as Feature
                        }
                    } catch (err) {
                        console.warn("Issue merging feature in zone " + zId, err)
                        // Fallback: use the first feature so at least something shows
                        if (features.length > 0) merged = features[0]
                    }

                    if (merged) {
                        merged.properties = {
                            zoneId: zId,
                            name: zoneNames[zId],
                            id: zId.toString() // Use string ID for selection
                        }
                        unifiedFeatures.push(merged)
                    }
                })

                const collection: FeatureCollection = {
                    type: "FeatureCollection",
                    features: unifiedFeatures
                }

                setGeoData(collection)

                // Calculate bounds
                try {
                    // Simple bounds calculation
                    const bbox = turf.bbox(collection)
                    // bbox is [minX, minY, maxX, maxY]
                    // leaflet bounds is [[minY, minX], [maxY, maxX]]
                    setBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]])
                } catch (e) {
                    // Fallback bounds for Sri Lanka
                    setBounds([[5.8, 79.5], [9.9, 82.0]])
                }
            })
            .catch(err => console.error("Failed to load map data", err))
    }, [])

    const style = (feature: any) => {
        const zoneId = feature.properties.zoneId
        const isSelected = selectedRegion === zoneId.toString()
        // Map zoneId to our color palette
        const color = zoneColors[zoneId]

        return {
            fillColor: color,
            weight: isSelected ? 3 : 2,
            opacity: 1,
            color: '#333', // Dark border as seen in image
            dashArray: isSelected ? '' : '5, 5', // Dashed for unselected, solid for selected
            fillOpacity: isSelected ? 0.8 : 0.6 // Slightly transparent to show underlying map labels
        }
    }

    const onEachFeature = (feature: any, layer: L.Layer) => {
        const zoneId = feature.properties.zoneId.toString()
        const name = feature.properties.name

        layer.bindTooltip(name, {
            sticky: true,
            direction: 'center',
            className: 'font-sans font-medium text-xs bg-white px-2 py-1 rounded shadow-lg border border-slate-100 opacity-90'
        })

        layer.on({
            click: (e) => {
                L.DomEvent.stopPropagation(e) // Prevent map click
                if (selectedRegion === zoneId) {
                    onRegionSelect('')
                } else {
                    onRegionSelect(zoneId)
                }
            },
            mouseover: (e) => {
                const l = e.target
                l.setStyle({
                    weight: 4,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.9
                })
                l.bringToFront()
            },
            mouseout: (e) => {
                const l = e.target
                // Reset style is complex with React state, relying on re-render or manual reset
                // Here we just reset to base style approx
                if (selectedRegion !== zoneId) {
                    l.setStyle({
                        weight: 2,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    })
                } else {
                    // Restore selected style
                    l.setStyle({
                        weight: 4,
                        color: '#333',
                        dashArray: '',
                        fillOpacity: 0.9
                    })
                }
            }
        })
    }

    return (
        <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 relative">
            <MapContainer
                center={[7.8731, 80.7718]}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
                zoomControl={true}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={style}
                        onEachFeature={onEachFeature}
                        key={selectedRegion} // Force re-render on selection change to update styles
                    />
                )}

                <MapController bounds={bounds} />
            </MapContainer>

            {/* Legend / Info Overlay */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg text-xs z-[1000] max-w-[200px]">
                <h4 className="font-bold mb-2 text-slate-700">Tourism Zones</h4>
                <div className="space-y-1">
                    {Object.entries(zoneNames).map(([id, name]) => (
                        <div key={id} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: zoneColors[parseInt(id)] }}
                            />
                            <span className="text-slate-600">{name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
