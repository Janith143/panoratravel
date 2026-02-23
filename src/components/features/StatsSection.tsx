'use client'

import { useEffect, useState, useRef } from 'react'
import { Users, MapPin, Award, Calendar } from 'lucide-react'

const stats = [
    { icon: Users, value: 2500, suffix: '+', label: 'Happy Travelers' },
    { icon: MapPin, value: 50, suffix: '+', label: 'Destinations' },
    { icon: Award, value: 15, suffix: '', label: 'Years Experience' },
    { icon: Calendar, value: 500, suffix: '+', label: 'Tours Completed' }
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLDivElement>(null)
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true)
                    let start = 0
                    const duration = 2000
                    const increment = value / (duration / 16)

                    const timer = setInterval(() => {
                        start += increment
                        if (start >= value) {
                            setCount(value)
                            clearInterval(timer)
                        } else {
                            setCount(Math.floor(start))
                        }
                    }, 16)
                }
            },
            { threshold: 0.5 }
        )

        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [value, hasAnimated])

    return (
        <div ref={ref} className="text-4xl md:text-5xl font-bold text-slate-900">
            {count.toLocaleString()}{suffix}
        </div>
    )
}

export default function StatsSection() {
    return (
        <section className="py-12 bg-white relative z-10 -mt-4 rounded-t-3xl border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            <div className="container max-w-7xl px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-100 text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                                <stat.icon className="h-8 w-8" />
                            </div>
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            <p className="text-slate-500 mt-2 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
