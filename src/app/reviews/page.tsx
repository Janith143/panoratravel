'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { Star, Plus, User, Quote, X } from 'lucide-react'
import ReviewForm from '@/components/reviews/ReviewForm'
import TouristMemoriesGallery from '@/components/reviews/TouristMemoriesGallery'
import { motion, AnimatePresence } from 'framer-motion'

type Review = {
    id: string
    userName: string
    userImage: string
    rating: number
    text: string
    photos: string[]
    date: string
    category?: string // Legacy
    categories?: string[] // New
}

import { getGlobalCategories } from '@/lib/content'

export default function ReviewsPage() {
    const { data: session } = useSession()
    const globalCategories = ['All', ...getGlobalCategories()]

    const [reviews, setReviews] = useState<Review[]>([])
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [showForm, setShowForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const filteredReviews = selectedCategory === 'All'
        ? reviews
        : reviews.filter(r => {
            // Check new array format
            if (r.categories && Array.isArray(r.categories)) {
                return r.categories.includes(selectedCategory)
            }
            // Check legacy string format
            return r.category === selectedCategory
        })

    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/reviews')
            const data = await res.json()
            setReviews(data.reviews || [])
        } catch (error) {
            console.error('Failed to fetch reviews')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container px-4 mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Traveler Reviews</h1>
                        <p className="text-lg text-slate-600 max-w-xl">
                            Hear directly from our guests about their journeys through Sri Lanka with Panora Travels.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {session ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                                    {session.user?.image ? (
                                        <Image src={session.user.image} alt="User" width={24} height={24} className="rounded-full" />
                                    ) : (
                                        <User className="h-5 w-5 text-slate-400" />
                                    )}
                                    <span className="text-sm font-medium text-slate-700">{session.user?.name}</span>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="text-sm text-slate-500 hover:text-slate-800 underline"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : null}

                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-lg shadow-emerald-200"
                        >
                            <Plus className="h-5 w-5" /> Write a Review
                        </button>
                    </div>
                </div>

                {/* Traveler Moments (Gallery Preview) */}
                <div className="mb-16">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-slate-900">Traveler Moments</h2>
                            <p className="text-slate-500">Captured by our guests during their adventures.</p>
                        </div>
                        <a href="/gallery" className="text-emerald-600 font-bold hover:text-emerald-700 underline text-sm">
                            View Full Gallery
                        </a>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <GalleryPreview />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {globalCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Reviews Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100"></div>
                        ))}
                    </div>
                ) : (
                    <div className="masonry-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredReviews.map((review, idx) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow break-inside-avoid mb-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative">
                                            {review.userImage ? (
                                                <Image src={review.userImage} alt={review.userName} fill className="object-cover" />
                                            ) : (
                                                <User className="h-5 w-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 leading-tight">{review.userName}</h3>
                                            <span className="text-xs text-slate-400">{new Date(review.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Categories Tags */}
                                {(review.categories?.length || review.category) && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {review.categories?.map(cat => (
                                            <span key={cat} className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">
                                                {cat}
                                            </span>
                                        ))}
                                        {/* Legacy fallback */}
                                        {!review.categories && review.category && (
                                            <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">
                                                {review.category}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <p className="text-slate-600 mb-6 leading-relaxed relative z-10">
                                    <Quote className="h-8 w-8 text-slate-100 absolute -top-2 -left-2 -z-10" />
                                    {review.text}
                                </p>

                                {review.photos && review.photos.length > 0 && (
                                    <div className={`grid gap-2 ${review.photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        {review.photos.map((photo, i) => (
                                            <div key={i}
                                                className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 cursor-pointer group"
                                                onClick={() => setSelectedImage(photo)}
                                            >
                                                <Image src={photo} alt="Review photo" fill className="object-cover group-hover:scale-105 transition duration-500" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                                        Zoom
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Review Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif font-bold text-slate-900">Write a Review</h2>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full transition">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <ReviewForm
                                onSuccess={() => {
                                    setShowForm(false)
                                    fetchReviews()
                                }}
                                onCancel={() => setShowForm(false)}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Zoom Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-md"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition p-2"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="h-8 w-8" />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage}
                                alt="Zoomed Review"
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl bg-black"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container px-4 mx-auto">
                <TouristMemoriesGallery />
            </div>
        </div >
    )
}

function GalleryPreview() {
    const [images, setImages] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/gallery')
            .then(res => res.json())
            .then(data => {
                if (data.images) setImages(data.images.slice(0, 4))
            })
            .catch(err => console.error(err))
    }, [])

    if (images.length === 0) return <div className="col-span-4 text-center text-slate-400 py-10">Loading moments...</div>

    return (
        <>
            {images.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden shadow-sm group">
                    <Image
                        src={img.url}
                        alt={img.title || 'Travel Moment'}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>
            ))}
        </>
    )
}
