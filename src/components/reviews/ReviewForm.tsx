'use client'

import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { Star, Upload, X, Loader2, Image as ImageIcon, Facebook } from 'lucide-react'
import { getGlobalCategories } from '@/lib/content'

export default function ReviewForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
    const { data: session } = useSession()
    const categories = getGlobalCategories()

    // State
    const [rating, setRating] = useState(5)
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [text, setText] = useState('')
    const [files, setFiles] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    // Guest fields
    const [guestName, setGuestName] = useState('')
    const [guestContact, setGuestContact] = useState('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files || [])])
        }
    }

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index))
    }

    const toggleCategory = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(prev => prev.filter(c => c !== cat))
        } else {
            setSelectedCategories(prev => [...prev, cat])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!text.trim()) return
        if (!session && (!guestName.trim() || !guestContact.trim())) {
            setError('Please provide your name and contact info.')
            return
        }
        if (selectedCategories.length === 0) {
            setError('Please select at least one category.')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            // 1. Upload Images
            const photoPaths: string[] = []
            if (files.length > 0) {
                for (const file of files) {
                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('folder', 'reviews')

                    const uploadRes = await fetch('/api/admin/upload', {
                        method: 'POST',
                        body: formData
                    })
                    const uploadData = await uploadRes.json()
                    if (uploadData.success) {
                        photoPaths.push(uploadData.path)
                    }
                }
            }

            // 2. Submit Review
            const reviewRes = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session?.user?.email || `guest_${Date.now()}`,
                    userName: session?.user?.name || guestName,
                    userImage: session?.user?.image || '',
                    userContact: session ? '' : guestContact,
                    rating,
                    categories: selectedCategories,
                    text,
                    photos: photoPaths
                })
            })

            if (reviewRes.ok) {
                onSuccess()
                setText('')
                setFiles([])
                setRating(5)
                setSelectedCategories([])
                setGuestName('')
                setGuestContact('')
            } else {
                setError('Failed to submit review. Please try again.')
            }

        } catch {
            setError('An error occurred.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {!session && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-slate-700">Guest Details</h3>
                        <button type="button" onClick={() => signIn('facebook')} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                            <Facebook className="w-3 h-3" /> Login with FB
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Name *</label>
                            <input
                                type="text"
                                value={guestName}
                                onChange={e => setGuestName(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg p-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="Your Name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Contact (Email or Phone) *</label>
                            <input
                                type="text"
                                value={guestContact}
                                onChange={e => setGuestContact(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg p-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="Email or Phone Number"
                                required
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Category Selection */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Trip Categories (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${selectedCategories.includes(cat)
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-500'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`p-1 transition ${rating >= star ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'}`}
                        >
                            <Star className="h-8 w-8 fill-current" />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Experience</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                    placeholder="Tell us about your trip..."
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Photos (Unlimited)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer relative">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer text-slate-900"
                    />
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Upload className="h-8 w-8" />
                        <span className="text-sm">Click to upload photos (Multiple allowed)</span>
                    </div>
                </div>
                {files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 max-h-40 overflow-y-auto p-2 border rounded-lg">
                        {files.map((file, i) => (
                            <div key={i} className="bg-slate-100 text-xs px-2 py-1 rounded-lg flex items-center gap-2 group relative">
                                <ImageIcon className="h-3 w-3" />
                                <span className="truncate max-w-[100px]">{file.name}</span>
                                <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 sm:py-2 text-slate-500 font-medium hover:bg-slate-50 rounded-lg w-full sm:w-auto"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || !text || (!session && (!guestName || !guestContact))}
                    className="px-6 py-3 sm:py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Submit Review
                </button>
            </div>
        </form>
    )
}
