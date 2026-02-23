'use client'

import { useState, useEffect } from 'react'
import { Star, Trash2, Calendar, User, Search, Filter, Edit2, X } from 'lucide-react'
import Image from 'next/image'

// Interface for Review (matching the structure in reviews.json)
interface Review {
    id: string
    userId: string
    userName: string
    userImage?: string
    rating: number
    date: string
    text: string
    photos?: string[]
    contact?: string
    isFeatured?: boolean
}

export default function ReviewsAdmin() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterRating, setFilterRating] = useState<number | 'all'>('all')

    const [editingReview, setEditingReview] = useState<Review | null>(null)
    const [editForm, setEditForm] = useState({ text: '', isFeatured: false, rating: 5 })

    // Fetch reviews from API (which reads from reviews.json)
    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/reviews')
            const data = await res.json()
            // Sort by newset first
            const sorted = (data.reviews || []).sort((a: Review, b: Review) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            setReviews(sorted)
        } catch (error) {
            console.error('Failed to fetch reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review? This cannot be undone.')) return

        try {
            const res = await fetch(`/api/reviews?id=${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                setReviews(posts => posts.filter(p => p.id !== id))
            } else {
                alert('Failed to delete review')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('Error deleting review')
        }
    }

    const startEdit = (review: Review) => {
        setEditingReview(review)
        setEditForm({
            text: review.text,
            isFeatured: !!review.isFeatured,
            rating: review.rating
        })
    }

    const handleUpdate = async () => {
        if (!editingReview) return

        try {
            const res = await fetch('/api/reviews', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingReview.id,
                    text: editForm.text,
                    rating: editForm.rating,
                    isFeatured: editForm.isFeatured
                })
            })

            if (res.ok) {
                setReviews(reviews.map(r => r.id === editingReview.id ? { ...r, ...editForm } : r))
                setEditingReview(null)
            } else {
                alert('Failed to update review')
            }
        } catch (error) {
            console.error(error)
            alert('Error updating review')
        }
    }


    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.userName.toLowerCase().includes(search.toLowerCase()) ||
            review.text.toLowerCase().includes(search.toLowerCase())
        const matchesRating = filterRating === 'all' || review.rating === filterRating
        return matchesSearch && matchesRating
    })

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif text-slate-800">User Reviews <span className="text-sm font-sans font-normal text-slate-500 ml-2">({reviews.length})</span></h2>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or content..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <div className="relative w-full sm:w-48">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none appearance-none bg-white"
                    >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars Only</option>
                        <option value="4">4 Stars Only</option>
                        <option value="3">3 Stars Only</option>
                        <option value="2">2 Stars Only</option>
                        <option value="1">1 Star Only</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading reviews...</div>
            ) : filteredReviews.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-slate-100">No reviews found matching your criteria.</div>
            ) : (
                <div className="grid gap-4">
                    {filteredReviews.map((review) => (
                        <div key={review.id} className={`bg-white p-4 md:p-6 rounded-xl border shadow-sm relative group transition-all hover:shadow-md ${review.isFeatured ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/10' : 'border-slate-200'}`}>
                            <div className="absolute top-2 right-2 md:top-4 md:right-4 flex gap-1 md:gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none rounded-full p-1 md:p-0 border md:border-none border-slate-100 shadow-sm md:shadow-none">
                                <button
                                    onClick={() => startEdit(review)}
                                    className="p-1.5 md:p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition"
                                    title="Edit Review"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    className="p-1.5 md:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                    title="Delete Review"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <div className="flex-shrink-0 flex items-center gap-3 w-full sm:w-auto">
                                    <div className="relative">
                                        {review.userImage ? (
                                            <Image src={review.userImage} alt={review.userName} width={48} height={48} className="rounded-full object-cover border border-slate-200" />
                                        ) : (
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                                <User className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                    {/* Mobile-only header details that move next to avatar */}
                                    <div className="sm:hidden flex-grow">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900">{review.userName}</h3>
                                            {review.isFeatured && (
                                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">Featured</span>
                                            )}
                                        </div>
                                        <div className="flex items-center text-amber-400 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                                            ))}
                                            <span className="text-slate-400 ml-2 text-xs">{new Date(review.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow w-full">
                                    {/* Desktop header details */}
                                    <div className="hidden sm:block">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-slate-900">{review.userName}</h3>
                                            {review.contact && (
                                                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Guest</span>
                                            )}
                                            {review.isFeatured && (
                                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">Featured</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                                            <div className="flex items-center text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(review.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-slate-700 leading-relaxed mb-3 text-sm md:text-base">{review.text}</p>

                                    {review.photos && review.photos.length > 0 && (
                                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                            {review.photos.map((photo, i) => (
                                                <div key={i} className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-slate-200">
                                                    <Image src={photo} alt={`Review photo ${i}`} fill className="object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingReview && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-serif">Edit Review by {editingReview.userName}</h3>
                            <button onClick={() => setEditingReview(null)} className="p-2 hover:bg-slate-100 rounded-full">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Review Content</label>
                                <textarea
                                    className="w-full border border-slate-300 rounded-lg p-3 h-32 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={editForm.text}
                                    onChange={e => setEditForm({ ...editForm, text: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                                    <select
                                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900"
                                        value={editForm.rating}
                                        onChange={e => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                                    >
                                        {[1, 2, 3, 4, 5].map(nu => <option key={nu} value={nu}>{nu} Stars</option>)}
                                    </select>
                                </div>
                                <div className="flex items-center gap-3 pt-6">
                                    <input
                                        type="checkbox"
                                        id="feat"
                                        checked={editForm.isFeatured}
                                        onChange={e => setEditForm({ ...editForm, isFeatured: e.target.checked })}
                                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                    />
                                    <label htmlFor="feat" className="font-medium text-slate-700">Feature this review</label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                                <button onClick={() => setEditingReview(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                <button onClick={handleUpdate} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
