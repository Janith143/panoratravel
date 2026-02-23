import Link from 'next/link'
import { Clock, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Tour = {
    id: string
    title: string
    duration: string
    price: string
    image: string
    category: string
    rating: number
    reviews: number
    description: string
    slug: string
    itinerary?: { day: number; title: string; description: string }[]
    highlights?: string[]
}

interface TourCardProps {
    tour: Tour
    className?: string
}

export default function TourCard({ tour, className }: TourCardProps) {
    return (
        <div className={cn("group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full", className)}>
            {/* Image Container */}
            <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                {/* Placeholder for Image - in production replace with Next/Image */}
                <div className="w-full h-full bg-slate-300 group-hover:scale-105 transition-transform duration-500 bg-cover bg-center" style={{ backgroundImage: `url(${tour.image})` }} />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900">
                    {tour.category}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center text-amber-500 text-xs font-bold">
                        <Star className="h-3 w-3 fill-current mr-1" />
                        <span>{tour.rating}</span>
                        <span className="text-slate-400 font-normal ml-1">({tour.reviews})</span>
                    </div>
                    <div className="flex items-center text-slate-500 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {tour.duration}
                    </div>
                </div>

                <h3 className="text-lg font-bold font-heading text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {tour.title}
                </h3>

                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">
                    {tour.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <span className="text-xs text-slate-400 block">From</span>
                        <span className="text-lg font-bold text-emerald-600">{tour.price}</span>
                    </div>
                    <Link href={`/tours/${tour.slug}`} className="inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-4 text-xs font-medium text-white shadow hover:bg-slate-800 transition-colors">
                        Details
                    </Link>
                </div>
            </div>
        </div>
    )
}
