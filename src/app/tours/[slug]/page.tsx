import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { getTours, getTourBySlug } from '@/lib/content'
import { Calendar, Clock, MapPin, CheckCircle, ArrowLeft, Star, Users } from 'lucide-react'

interface TourPageProps {
    params: Promise<{
        slug: string
    }>
}

// Generate Static Params for SSG
export async function generateStaticParams() {
    const tours = getTours()
    return tours.map((tour) => ({
        slug: tour.slug,
    }))
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
    const { slug } = await params
    const tour = getTourBySlug(slug)

    if (!tour) {
        return {
            title: 'Tour Not Found',
        }
    }

    return {
        title: `${tour.title} | Panora Travels`,
        description: tour.description,
        openGraph: {
            images: [tour.image],
            type: 'article'
        }
    }
}

export default async function TourDetailPage({ params }: TourPageProps) {
    const { slug } = await params
    const tour = getTourBySlug(slug)

    if (!tour) {
        notFound()
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: tour.title,
        image: tour.image,
        description: tour.description,
        brand: {
            '@type': 'Brand',
            name: 'Panora Travels'
        },
        offers: {
            '@type': 'Offer',
            url: `https://panoratravels.com/tours/${tour.slug}`,
            priceCurrency: 'USD',
            price: tour.price.replace('$', ''),
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'Panora Travels'
            }
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: tour.rating,
            reviewCount: tour.reviews
        }
    }

    return (
        <article className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Banner */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 lg:p-12">
                    <div className="container max-w-7xl">
                        <div className="inline-block bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                            {tour.category}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 drop-shadow-md">
                            {tour.title}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-white/90 font-medium">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                {tour.duration}
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                                {tour.rating} ({tour.reviews} reviews)
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-white">
                                    {tour.price} <span className="text-sm font-normal text-white/70">per person</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container max-w-7xl px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Highlights */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 font-serif">Trip Highlights</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tour.highlights?.map((highlight, i) => (
                                <li key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-slate-100">
                                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-700 font-medium">{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                    {/* Itinerary */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 font-serif">Daily Itinerary</h2>
                        <div className="space-y-6">
                            {tour.itinerary?.map((day) => (
                                <div key={day.day} className="relative pl-8 border-l-2 border-slate-200 pb-2 last:pb-0">
                                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-white" />
                                    <span className="text-sm font-bold text-emerald-600 mb-1 block uppercase tracking-wider">Day {day.day}</span>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{day.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{day.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sticky Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-slate-100 p-6 space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 font-serif border-b border-slate-100 pb-4">Book This Tour</h3>

                        <div className="space-y-4 text-sm text-slate-600">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-emerald-500" />
                                <span>Available throughout the year</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-emerald-500" />
                                <span>Minimum 2 people required</span>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <p className="text-xs text-center text-slate-400">Customizable according to your preferences</p>
                            <Link href="/contact" className="flex items-center justify-center w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/10">
                                Request Quote
                            </Link>
                            <a href="https://wa.me/94719276870" className="flex items-center justify-center w-full bg-slate-100 text-slate-900 font-bold py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors">
                                Chat on WhatsApp
                            </a>
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
