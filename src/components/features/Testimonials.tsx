'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([])
    const [current, setCurrent] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    useEffect(() => {
        async function fetchReviews() {
            try {
                const res = await fetch('/api/reviews?featured=true')
                const data = await res.json()
                if (data.reviews && data.reviews.length > 0) {
                    setTestimonials(data.reviews)
                }
            } catch (error) {
                console.error('Failed to fetch testimonials', error)
            }
        }
        fetchReviews()
    }, [])

    useEffect(() => {
        if (!isAutoPlaying || testimonials.length === 0) return
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [isAutoPlaying, testimonials])

    const next = () => {
        setIsAutoPlaying(false)
        if (testimonials.length > 0) setCurrent((prev) => (prev + 1) % testimonials.length)
    }

    const prev = () => {
        setIsAutoPlaying(false)
        if (testimonials.length > 0) setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    if (testimonials.length === 0) return null

    const t = testimonials[current]


    return (
        <section className="py-20 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-64 h-64 bg-amber-500 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
            </div>

            <div className="container max-w-6xl px-4 relative z-10">
                <div className="text-center mb-12">
                    <span className="text-emerald-400 font-semibold tracking-wide uppercase text-sm">Testimonials</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mt-2">What Our Travelers Say</h2>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Quote Icon */}
                    <Quote className="absolute -top-6 -left-6 h-16 w-16 text-emerald-500/20" />

                    {/* Testimonial Card */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gradient-to-br from-emerald-400 to-amber-400 p-1">
                                    <div className="h-full w-full rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold">
                                        {t.name.charAt(0)}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-center md:text-left">
                                {/* Stars */}
                                <div className="flex justify-center md:justify-start gap-1 mb-4">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6 italic">
                                    "{t.text}"
                                </p>

                                {/* Author */}
                                <div>
                                    <p className="font-bold text-lg">{t.name}</p>
                                    <p className="text-emerald-400 text-sm">{t.location}</p>
                                    <p className="text-white/50 text-xs mt-1">Trip: {t.trip}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={prev}
                            className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>

                        {/* Dots */}
                        <div className="flex items-center gap-2">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setIsAutoPlaying(false); setCurrent(i) }}
                                    className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
