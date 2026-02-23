import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import {
    getDestinations,
    getAttractions,
    getAnyDestination,
    getAttractionsByDistrict,
    getDistrictName
} from '@/lib/content'
import { MapPin, ArrowLeft, Camera, Compass } from 'lucide-react'
import * as turf from '@turf/turf'

interface DestinationPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateStaticParams() {
    const destinations = getDestinations()
    const attractions = getAttractions()
    return [
        ...destinations.map((dest) => ({ slug: dest.slug })),
        ...attractions.map((attr) => ({ slug: attr.id })),
    ]
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
    const { slug } = await params
    const result = getAnyDestination(slug)

    if (!result) {
        return {
            title: 'Destination Not Found',
        }
    }

    const { data } = result
    return {
        title: `${data.name} | Panora Travels`,
        description: data.description,
    }
}

export default async function DestinationDetailPage({ params }: DestinationPageProps) {
    const { slug } = await params
    const result = getAnyDestination(slug)

    if (!result) {
        notFound()
    }

    const { type, data } = result

    // Prepare data for rendering
    let highlights: string[] = []
    let nearbyAttractions: { name: string, description: string, slug?: string, distance?: string }[] = []

    if (type === 'region') {
        // It's a Region (Destination)
        highlights = (data as any).highlights || []
        nearbyAttractions = (data as any).attractions || []
    } else {
        // It's an Attraction
        // For highlights, we can use categories or generic text if specific highlights aren't in data
        highlights = (data as any).categories?.map((c: string) => c.charAt(0).toUpperCase() + c.slice(1)) || []

        // Fetch nearby attractions based on true geographical distance
        const currentAttraction = data as any;
        const allAttractions = getAttractions().filter(a => a.id !== currentAttraction.id)

        // Ensure coordinates exist before calculating distance
        const currentLat = currentAttraction.map?.lat;
        const currentLng = currentAttraction.map?.lng;

        if (currentLat !== undefined && currentLng !== undefined) {
            const currentPoint = turf.point([currentLng, currentLat])

            nearbyAttractions = allAttractions
                .map(attr => {
                    const attrLat = attr.map?.lat
                    const attrLng = attr.map?.lng
                    let dist = Infinity

                    if (attrLat !== undefined && attrLng !== undefined) {
                        const targetPoint = turf.point([attrLng, attrLat])
                        dist = turf.distance(currentPoint, targetPoint, { units: 'kilometers' })
                    }

                    return {
                        name: attr.name,
                        description: attr.description,
                        slug: attr.id,
                        distanceRaw: dist,
                        distance: dist === Infinity ? '' : `${dist.toFixed(1)} km away`
                    }
                })
                .sort((a, b) => a.distanceRaw - b.distanceRaw)
                .slice(0, 3)
        } else {
            // Fallback to district logic if no active coordinates
            const districtAttractions = getAttractionsByDistrict((data as any).district)
            nearbyAttractions = districtAttractions
                .filter(a => a.id !== currentAttraction.id) // Exclude self
                .slice(0, 3) // Take top 3
                .map(a => ({
                    name: a.name,
                    description: a.description,
                    slug: a.id
                }))
        }
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: data.name,
        description: data.description,
        image: data.image,
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '7.8731', // Placeholder coords
            longitude: '80.7718'
        }
    }

    return (
        <article className="min-h-screen bg-slate-50 pb-20">
            <div className="relative h-[60vh] w-full">
                <Image
                    src={data.image}
                    alt={data.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute top-8 left-4 md:left-8 z-20">
                    <Link href="/destinations" className="text-white/80 hover:text-white flex items-center gap-2 backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Destinations
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="container max-w-5xl">
                        {type === 'attraction' && (
                            <span className="inline-block px-3 py-1 bg-emerald-600/80 text-white text-xs font-bold rounded-full mb-4 backdrop-blur-sm uppercase tracking-wide">
                                {getDistrictName((data as any).district)} District
                            </span>
                        )}
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">{data.name}</h1>
                        <p className="text-xl text-white/90 max-w-2xl">{data.description}</p>
                    </div>
                </div>
            </div>

            <div className="container max-w-5xl px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Intro */}
                        <div className="prose prose-lg text-slate-600">
                            <p>{data.description}</p>
                            <p>Experience the unique charm of {data.name}, a highlight of Sri Lankan travel. Whether you are looking for culture, nature, or adventure, this destination offers an unforgettable experience.</p>
                        </div>

                        {/* Highlights */}
                        {highlights.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 font-serif flex items-center gap-2">
                                    <Camera className="h-6 w-6 text-emerald-600" /> Key Highlights
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {highlights.map((highlight, i) => (
                                        <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                            <span className="font-medium text-slate-800">{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Nearby */}
                        {nearbyAttractions.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 font-serif flex items-center gap-2">
                                    <MapPin className="h-6 w-6 text-emerald-600" /> Nearby Attractions
                                </h2>
                                <div className="space-y-4">
                                    {nearbyAttractions.map((attr, i) => (
                                        <Link href={attr.slug ? `/destinations/${attr.slug}` : '#'} key={i} className="block">
                                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-lg text-slate-900 leading-tight">{attr.name}</h3>
                                                    {attr.distance && (
                                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                                            {attr.distance}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-slate-500 line-clamp-2">{attr.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 sticky top-24">
                            <h3 className="text-xl font-bold text-emerald-900 mb-4 font-serif">Visit {data.name}</h3>
                            <p className="text-emerald-800/80 mb-6 text-sm">
                                Ready to explore {data.name}? Let us include this amazing destination in your custom itinerary.
                            </p>
                            <Link href="/contact" className="block w-full py-3 bg-emerald-600 text-white text-center rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/10">
                                Plan My Trip
                            </Link>
                            <p className="text-xs text-emerald-800/60 mt-4 text-center">
                                Our local experts can guide you to the best spots.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </article>
    )
}
