'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, Sun } from 'lucide-react'
import { IMAGES } from '@/lib/images'
import WeatherTicker from './WeatherTicker'
import CurrencyConverter from './CurrencyConverter'
import ReviewTicker from './ReviewTicker'
import WeatherMapModal from './WeatherMapModal'

import { getSiteConfig } from '@/lib/content'

export default function Hero({ config }: { config?: any }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const siteConfig = config || getSiteConfig()
    const slides = siteConfig.heroSlides || []

    const [showMap, setShowMap] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    // Parallax Text Effects
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    // Auto-play Logic
    useEffect(() => {
        if (!isAutoPlaying || slides.length <= 1) return

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 6000)

        return () => clearInterval(timer)
    }, [isAutoPlaying, slides.length, currentSlide])

    // Mask Animation Variants for spectacular cinematic wipe
    const variants = {
        enter: {
            clipPath: "circle(0% at 50% 50%)",
            scale: 1.1,
            opacity: 0
        },
        center: {
            clipPath: "circle(150% at 50% 50%)",
            scale: 1,
            opacity: 1,
            transition: {
                clipPath: { duration: 1.5, ease: [0.77, 0, 0.175, 1] as any },
                scale: { duration: 6, ease: "linear" as any }, // Continuous slow zoom
                opacity: { duration: 0.5 }
            }
        },
        exit: {
            clipPath: "circle(150% at 50% 50%)", // Keep full during exit so the new one wipes over it
            opacity: 0,
            transition: { duration: 1 }
        }
    }

    if (slides.length === 0) return null

    const activeSlide = slides[currentSlide]

    return (
        <div ref={containerRef} className="relative h-[100svh] w-full overflow-hidden flex flex-col bg-black">
            {/* Weather Ticker at Top */}
            <div className="absolute top-0 left-0 right-0 z-40">
                <WeatherTicker onOpenMap={() => setShowMap(true)} />
            </div>

            {/* Cinematic Slider Backgrounds */}
            <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                <AnimatePresence initial={false} mode="sync">
                    <motion.div
                        key={currentSlide}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${activeSlide.image || IMAGES.hero.bg_video_fallback}')` }}
                    />
                </AnimatePresence>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent z-10 pointer-events-none" />
            </motion.div>

            {/* Live Map Widget - Top Right */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute right-4 lg:right-6 top-24 z-30 hidden lg:block w-80"
            >
                <div
                    className="relative group cursor-pointer overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-black/50 backdrop-blur-md transition-transform hover:scale-105"
                    onClick={() => setShowMap(true)}
                >
                    <div className="absolute top-0 left-0 right-0 z-10 bg-black/40 backdrop-blur-sm px-4 py-2 flex items-center justify-between border-b border-white/10">
                        <span className="text-white font-bold text-sm flex items-center gap-2">
                            <Sun className="h-4 w-4 text-emerald-400 animate-pulse" /> Live Weather
                        </span>
                        <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Live
                        </span>
                    </div>

                    <div className="h-48 w-full relative pointer-events-none">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://embed.windy.com/embed2.html?lat=7.873&lon=80.772&detailLat=7.873&detailLon=80.772&width=300&height=200&zoom=5&level=surface&overlay=temp&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1"
                            frameBorder="0"
                            className="absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                            tabIndex={-1}
                        ></iframe>
                    </div>

                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                            Click to Expand
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Currency Converter */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 hidden lg:block"
            >
                <CurrencyConverter variant="dark" />
            </motion.div>

            {/* Main Text Content */}
            <div className="relative z-20 container max-w-7xl px-4 text-center space-y-8 flex-1 flex flex-col items-center justify-center pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`text-${currentSlide}`}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 1.05 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center space-y-6"
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md">
                            <span className="text-emerald-300 text-sm font-medium tracking-[0.2em] uppercase">
                                {activeSlide.badge}
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-white tracking-tight drop-shadow-2xl leading-none">
                            {activeSlide.title} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 italic pr-4">
                                {activeSlide.highlight}
                            </span>
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-light">
                            {activeSlide.subtitle} <br className="hidden md:block" />
                            {activeSlide.subtext}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
                >
                    <Link href="#start-planning" className="group inline-flex h-14 items-center justify-center rounded-full bg-emerald-600 px-10 text-lg font-bold text-white shadow-xl shadow-emerald-900/40 transition-all hover:scale-105 hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        Start Your Journey
                    </Link>
                    <Link href="/tours" className="inline-flex h-14 items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/20 px-10 text-lg font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring group">
                        Explore Packages <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            </div>

            {/* Custom Slider Navigation (Liquid Progress Indicators) */}
            {slides.length > 1 && (
                <div className="absolute bottom-20 left-0 right-0 z-30 flex justify-center items-center gap-3">
                    {slides.map((_: any, i: number) => (
                        <button
                            key={i}
                            onClick={() => {
                                setIsAutoPlaying(false)
                                setCurrentSlide(i)
                            }}
                            className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-500 ${currentSlide === i ? 'w-16 bg-white/30' : 'w-6 bg-white/20 hover:bg-white/40'}`}
                            aria-label={`Go to slide ${i + 1}`}
                        >
                            {currentSlide === i && isAutoPlaying && (
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 6, ease: "linear" }}
                                    className="absolute top-0 left-0 bottom-0 bg-emerald-400"
                                />
                            )}
                            {currentSlide === i && !isAutoPlaying && (
                                <div className="absolute top-0 left-0 bottom-0 w-full bg-emerald-400" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            <ReviewTicker />

            {showMap && <WeatherMapModal onClose={() => setShowMap(false)} />}
        </div>
    )
}

