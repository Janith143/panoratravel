'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayCircle, X, Maximize2 } from 'lucide-react'

type TouristMemory = {
    id: string
    url: string
    title: string | null
}

export default function TouristMemoriesGallery() {
    const [memories, setMemories] = useState<TouristMemory[]>([])
    const [selectedMedia, setSelectedMedia] = useState<TouristMemory | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('/api/tourist-memories')
            .then(res => res.json())
            .then(data => {
                if (data.images) {
                    setMemories(data.images)
                }
            })
            .catch(err => console.error('Failed to fetch memories', err))
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return (
            <div className="py-20 text-center">
                <div className="inline-flex gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
                <p className="mt-4 text-slate-500 font-medium tracking-wide">Loading traveler memories...</p>
            </div>
        )
    }

    if (memories.length === 0) return null

    const isVideo = (url: string) => {
        const ext = url.split('.').pop()?.toLowerCase() || ''
        return ['mp4', 'webm', 'mov', 'ogg'].includes(ext)
    }

    return (
        <section className="mt-24 mb-10 pb-10 border-t border-slate-200 pt-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4 tracking-tight">
                    Unforgettable <span className="text-emerald-600 italic">Moments</span>
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    A collection of beautiful memories captured by our travelers during their journeys across Sri Lanka.
                </p>
            </div>

            {/* Dynamic Masonry-like Grid */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {memories.map((memory, index) => (
                    <motion.div
                        key={memory.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index % 4 * 0.1 }}
                        className="relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-500 bg-slate-100"
                        onClick={() => setSelectedMedia(memory)}
                    >
                        {isVideo(memory.url) ? (
                            <div className="relative aspect-[4/5] w-full bg-slate-900">
                                <video
                                    src={memory.url}
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                                    muted
                                    loop
                                    playsInline
                                    onMouseOver={e => (e.target as HTMLVideoElement).play()}
                                    onMouseOut={e => {
                                        const video = e.target as HTMLVideoElement;
                                        video.pause();
                                        video.currentTime = 0;
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors duration-500">
                                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full transform group-hover:scale-110 transition-transform duration-500 shadow-xl border border-white/30">
                                        <PlayCircle className="w-8 h-8 text-white stroke-[1.5]" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Add slight random height variation for masonry feel
                            <div className={`relative w-full ${index % 3 === 0 ? 'aspect-[3/4]' : index % 2 === 0 ? 'aspect-square' : 'aspect-[4/5]'}`}>
                                <Image
                                    src={memory.url}
                                    alt={memory.title || 'Travel Memory'}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                            </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                            <div className="flex items-center justify-between">
                                {memory.title ? (
                                    <h3 className="text-white font-medium text-lg drop-shadow-md truncate pr-2">
                                        {memory.title.replace(/_/g, ' ')}
                                    </h3>
                                ) : (
                                    <span /> // Spacer
                                )}
                                <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30">
                                    <Maximize2 className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Media Viewer Modal */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
                        onClick={() => setSelectedMedia(null)}
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-6 right-6 md:top-8 md:right-8 z-10 p-3 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all transform hover:scale-105 backdrop-blur-md border border-white/10"
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelectedMedia(null)
                            }}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {isVideo(selectedMedia.url) ? (
                                <video
                                    src={selectedMedia.url}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain bg-black ring-1 ring-white/10"
                                />
                            ) : (
                                <div className="relative w-full h-[85vh]">
                                    <Image
                                        src={selectedMedia.url}
                                        alt={selectedMedia.title || 'Travel Memory'}
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        sizes="100vw"
                                        priority
                                    />
                                </div>
                            )}

                            {selectedMedia.title && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-lg px-6 py-3 rounded-full border border-white/10 shadow-xl"
                                >
                                    <p className="text-white/90 font-medium text-lg tracking-wide">
                                        {selectedMedia.title.replace(/_/g, ' ')}
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
