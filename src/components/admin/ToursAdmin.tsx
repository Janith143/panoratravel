'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Plus, Trash2, Image as ImageIcon, Loader2, ChevronDown, ChevronUp, X, Star, Clock, Tag } from 'lucide-react'
import Image from 'next/image'
import contentData from '@/data/content.json'

type ItineraryDay = {
    day: number
    title: string
    description: string
}

type Tour = {
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
    highlights: string[]
    itinerary: ItineraryDay[]
}

export default function ToursAdmin({ globalCategories }: { globalCategories: string[] }) {
    const [tours, setTours] = useState<Tour[]>(contentData.tours || [])
    const [isSaving, setIsSaving] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [uploadingId, setUploadingId] = useState<string | null>(null)
    const highlightInputRef = useRef<HTMLInputElement>(null)

    const handleSave = async () => {
        setIsSaving(true)
        setFeedback('')
        try {
            const res = await fetch('/api/admin/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tours })
            })
            const data = await res.json()
            if (data.success) {
                setFeedback('Tours saved successfully!')
                setTimeout(() => setFeedback(''), 3000)
            } else {
                setFeedback('Error saving tours.')
            }
        } catch (e) {
            setFeedback('Network error.')
        } finally {
            setIsSaving(false)
        }
    }

    const updateTour = (id: string, field: string, value: any) => {
        setTours(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))
    }

    const addTour = () => {
        const newTour: Tour = {
            id: `tour-${Date.now()}`,
            title: 'New Tour Package',
            duration: '3 Days',
            price: '$0',
            image: '/images/tours/cultural.jpg',
            category: 'Nature',
            rating: 5.0,
            reviews: 0,
            description: 'Description goes here.',
            slug: `new-tour-${Date.now()}`,
            highlights: [],
            itinerary: []
        }
        setTours(prev => [...prev, newTour])
        setExpandedId(newTour.id)
    }

    const deleteTour = (id: string) => {
        if (!confirm('Are you sure you want to delete this tour package?')) return
        setTours(prev => prev.filter(t => t.id !== id))
    }

    const handleImageUpload = async (tourId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return
        setUploadingId(tourId)
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'tours')

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (data.success) {
                updateTour(tourId, 'image', data.path)
            } else {
                alert('Upload failed')
            }
        } catch (err) {
            console.error(err)
            alert('Upload error')
        } finally {
            setUploadingId(null)
        }
    }

    // Itinerary helpers
    const addItineraryDay = (tourId: string) => {
        setTours(prev => prev.map(t => {
            if (t.id !== tourId) return t
            const nextDay = (t.itinerary?.length || 0) + 1
            return {
                ...t,
                itinerary: [...(t.itinerary || []), { day: nextDay, title: `Day ${nextDay}`, description: '' }]
            }
        }))
    }

    const updateItineraryDay = (tourId: string, dayIndex: number, field: string, value: string) => {
        setTours(prev => prev.map(t => {
            if (t.id !== tourId) return t
            const newItinerary = [...(t.itinerary || [])]
            newItinerary[dayIndex] = { ...newItinerary[dayIndex], [field]: value }
            return { ...t, itinerary: newItinerary }
        }))
    }

    const removeItineraryDay = (tourId: string, dayIndex: number) => {
        setTours(prev => prev.map(t => {
            if (t.id !== tourId) return t
            const newItinerary = (t.itinerary || []).filter((_, i) => i !== dayIndex)
                .map((d, i) => ({ ...d, day: i + 1 }))
            return { ...t, itinerary: newItinerary }
        }))
    }

    // Highlights helpers
    const addHighlight = (tourId: string, text: string) => {
        if (!text.trim()) return
        setTours(prev => prev.map(t => {
            if (t.id !== tourId) return t
            return { ...t, highlights: [...(t.highlights || []), text.trim()] }
        }))
    }

    const removeHighlight = (tourId: string, index: number) => {
        setTours(prev => prev.map(t => {
            if (t.id !== tourId) return t
            return { ...t, highlights: (t.highlights || []).filter((_, i) => i !== index) }
        }))
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-serif text-slate-900">Tour Packages</h2>
                    <p className="text-sm text-slate-500">{tours.length} packages</p>
                </div>
                <div className="flex items-center gap-3">
                    {feedback && <span className="text-sm font-medium text-emerald-600 animate-pulse">{feedback}</span>}
                    <button
                        onClick={addTour}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition text-sm"
                    >
                        <Plus className="h-4 w-4" /> Add Package
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 text-sm"
                    >
                        {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                        Save Tours
                    </button>
                </div>
            </div>

            {/* Tours List */}
            {tours.map((tour) => {
                const isExpanded = expandedId === tour.id
                return (
                    <div key={tour.id} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                        {/* Collapsed Header */}
                        <div
                            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition"
                            onClick={() => setExpandedId(isExpanded ? null : tour.id)}
                        >
                            <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0 relative">
                                <Image src={tour.image} alt={tour.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-900 truncate">{tour.title}</h3>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {tour.duration}</span>
                                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" /> {tour.rating}</span>
                                    <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {tour.category}</span>
                                    <span className="font-bold text-emerald-600">{tour.price}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">{tour.itinerary?.length || 0} days</span>
                                {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                            </div>
                        </div>

                        {/* Expanded Editor */}
                        {isExpanded && (
                            <div className="border-t border-slate-200 p-6 space-y-6 bg-slate-50/50">
                                {/* Basic Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    {/* Image */}
                                    <div className="md:col-span-4 space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Cover Image</label>
                                        <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 border border-slate-300 group/image">
                                            <Image src={tour.image} alt={tour.title} fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                                                <label className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2">
                                                    {uploadingId === tour.id ? <Loader2 className="animate-spin h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                                                    Change Photo
                                                    <input type="file" className="hidden text-slate-900" accept="image/*" onChange={(e) => handleImageUpload(tour.id, e)} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fields */}
                                    <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                            <input
                                                type="text"
                                                defaultValue={tour.title}
                                                onBlur={(e) => updateTour(tour.id, 'title', e.target.value)}
                                                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                                            <input
                                                type="text"
                                                defaultValue={tour.slug}
                                                onBlur={(e) => updateTour(tour.id, 'slug', e.target.value)}
                                                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-mono bg-slate-100 text-slate-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                                            <input
                                                type="text"
                                                defaultValue={tour.price}
                                                onBlur={(e) => updateTour(tour.id, 'price', e.target.value)}
                                                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                                            <input
                                                type="text"
                                                defaultValue={tour.duration}
                                                onBlur={(e) => updateTour(tour.id, 'duration', e.target.value)}
                                                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                            <select
                                                defaultValue={tour.category}
                                                onChange={(e) => updateTour(tour.id, 'category', e.target.value)}
                                                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                            >
                                                {globalCategories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="5"
                                                    defaultValue={tour.rating}
                                                    onBlur={(e) => updateTour(tour.id, 'rating', parseFloat(e.target.value) || 0)}
                                                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Reviews</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    defaultValue={tour.reviews}
                                                    onBlur={(e) => updateTour(tour.id, 'reviews', parseInt(e.target.value) || 0)}
                                                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                            <textarea
                                                defaultValue={tour.description}
                                                onBlur={(e) => updateTour(tour.id, 'description', e.target.value)}
                                                className="w-full border border-slate-300 rounded-md p-2 text-sm h-24 focus:ring-2 focus:ring-emerald-500 outline-none resize-none text-slate-900"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Highlights Editor */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-2">Highlights</label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {(tour.highlights || []).map((h, i) => (
                                            <span key={i} className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm border border-emerald-200">
                                                {h}
                                                <button onClick={() => removeHighlight(tour.id, i)} className="hover:text-red-500 ml-1">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            ref={highlightInputRef}
                                            placeholder="Add a highlight..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    const val = highlightInputRef.current?.value || ''
                                                    if (val.trim()) {
                                                        addHighlight(tour.id, val)
                                                        highlightInputRef.current!.value = ''
                                                    }
                                                }
                                            }}
                                            className="flex-1 border border-slate-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const val = highlightInputRef.current?.value || ''
                                                if (val.trim()) {
                                                    addHighlight(tour.id, val)
                                                    highlightInputRef.current!.value = ''
                                                }
                                            }}
                                            className="bg-slate-800 text-white px-3 py-1.5 rounded-md text-sm hover:bg-slate-700 transition"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/* Itinerary Editor */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-bold text-slate-800">Itinerary</label>
                                        <button
                                            onClick={() => addItineraryDay(tour.id)}
                                            className="flex items-center gap-1 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 transition"
                                        >
                                            <Plus className="h-3 w-3" /> Add Day
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {(tour.itinerary || []).map((day, i) => (
                                            <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 relative group">
                                                <button
                                                    onClick={() => removeItineraryDay(tour.id, i)}
                                                    className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">Day {day.day}</span>
                                                    <input
                                                        type="text"
                                                        defaultValue={day.title}
                                                        onBlur={(e) => updateItineraryDay(tour.id, i, 'title', e.target.value)}
                                                        placeholder="Day title..."
                                                        className="flex-1 border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-emerald-400 text-slate-900"
                                                    />
                                                </div>
                                                <textarea
                                                    defaultValue={day.description}
                                                    onBlur={(e) => updateItineraryDay(tour.id, i, 'description', e.target.value)}
                                                    placeholder="Day description..."
                                                    className="w-full border border-slate-200 rounded px-2 py-1 text-sm h-16 outline-none focus:border-emerald-400 resize-none text-slate-900"
                                                />
                                            </div>
                                        ))}
                                        {(!tour.itinerary || tour.itinerary.length === 0) && (
                                            <div className="text-center py-6 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                                                No itinerary days yet. Click "Add Day" to start.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <div className="pt-4 border-t border-slate-200 flex justify-end">
                                    <button
                                        onClick={() => deleteTour(tour.id)}
                                        className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition text-sm font-medium"
                                    >
                                        <Trash2 className="h-4 w-4" /> Delete Package
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}

            {tours.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                    <p className="text-lg mb-4">No tour packages yet.</p>
                    <button onClick={addTour} className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition">
                        Create First Package
                    </button>
                </div>
            )}
        </div>
    )
}
