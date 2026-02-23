'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

// Extended image interface for the gallery
export interface GalleryItem {
    id: string
    url: string
    title: string
    category: string
    aspectRatio?: 'square' | 'video' | 'portrait' | 'tall'
}

interface GalleryGridProps {
    images: GalleryItem[]
}

export default function GalleryGrid({ images }: GalleryGridProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const [zoom, setZoom] = useState(1)

    // Helper to assign random aspect ratios for the masonry effect if not provided
    const getAspectClass = (aspect?: string, index?: number) => {
        // Deterministic pseudo-random based on index so hydration matches
        const patterns = ['aspect-square', 'aspect-[3/4]', 'aspect-video', 'aspect-[4/5]']
        const pattern = aspect || patterns[(index || 0) % patterns.length]

        switch (pattern) {
            case 'square': return 'aspect-square'
            case 'portrait': return 'aspect-[3/4]'
            case 'tall': return 'aspect-[4/5]'
            case 'video': return 'aspect-video'
            default: return pattern
        }
    }

    const openLightbox = (index: number) => {
        setLightboxIndex(index)
        setZoom(1)
        document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    const closeLightbox = () => {
        setLightboxIndex(null)
        setZoom(1)
        document.body.style.overflow = 'auto'
    }

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex + 1) % images.length)
            setZoom(1)
        }
    }

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)
            setZoom(1)
        }
    }

    const handleZoomIn = (e: React.MouseEvent) => {
        e.stopPropagation()
        setZoom(prev => Math.min(prev + 0.5, 3))
    }

    const handleZoomOut = (e: React.MouseEvent) => {
        e.stopPropagation()
        setZoom(prev => Math.max(prev - 0.5, 1))
    }

    return (
        <div className="w-full">
            {/* Masonry CSS implementation using Tailwind columns */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {images.map((img, index) => (
                    <div
                        key={`${img.id}-${index}`}
                        className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-slate-200"
                        onClick={() => openLightbox(index)}
                    >
                        <div className={`relative w-full ${getAspectClass(img.aspectRatio, index)}`}>
                            <Image
                                src={img.url}
                                alt={img.title || 'Gallery Image'}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <p className="text-white font-serif font-bold text-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    {img.title}
                                </p>
                                <span className="text-emerald-400 text-sm font-medium tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 mt-1">
                                    {img.category}
                                </span>
                            </div>

                            {/* Hover zoom icon hint */}
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                <ZoomIn className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
                    onClick={closeLightbox}
                >
                    {/* Controls */}
                    <div className="absolute top-6 right-6 flex gap-4 z-[110]">
                        <button
                            onClick={handleZoomIn}
                            className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors"
                            title="Zoom In"
                        >
                            <ZoomIn className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleZoomOut}
                            className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors"
                            title="Zoom Out"
                        >
                            <ZoomOut className="w-6 h-6" />
                        </button>
                        <button
                            onClick={closeLightbox}
                            className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors"
                            title="Close (Esc)"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevImage}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-colors z-[110]"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-colors z-[110]"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Image Container */}
                    <div
                        className="relative w-full max-w-6xl max-h-[85vh] h-full flex items-center justify-center overflow-hidden"
                        onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing modal
                    >
                        <div
                            className="relative w-full h-full transition-transform duration-300 ease-out flex items-center justify-center"
                            style={{ transform: `scale(${zoom})` }}
                        >
                            <Image
                                src={images[lightboxIndex].url}
                                alt={images[lightboxIndex].title}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />
                        </div>

                        {/* Caption below image */}
                        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-center">
                            <h3 className="text-white text-2xl font-serif font-bold mb-1">
                                {images[lightboxIndex].title}
                            </h3>
                            <p className="text-emerald-400 font-medium">
                                {images[lightboxIndex].category}
                            </p>
                            <p className="text-white/50 text-sm mt-2">
                                {lightboxIndex + 1} of {images.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
