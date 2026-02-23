'use client'

import { useState, useEffect } from 'react'
import { MapPin, Search, Car, Users, Send, Loader2, Info, GripVertical, Check, Plus, X, Trash2, ExternalLink, Calendar, ChevronUp, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import PlannerInteractiveMapWrapper from '@/components/planner/PlannerInteractiveMapWrapper'

type Destination = {
    id: string
    name: string
    description: string
    image: string
    category: string
    categories: string[]
    highlights: string[]
    slug: string
    district: string
}

import destinationsData from '@/data/destinations-data.json'

// Map attractions to planner format
const allDestinations: Destination[] = destinationsData.attractions.map((attr: any) => ({
    id: attr.id,
    name: attr.name,
    description: attr.description,
    image: attr.image,
    category: attr.categories[0] || 'general',
    categories: attr.categories,
    highlights: attr.highlights || [],
    slug: attr.id,
    district: attr.district,
    map: attr.map
}))

import { getGlobalCategories } from '@/lib/content'

// Get unique categories from the data
const allCategories = getGlobalCategories()

export default function PlannerPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>}>
            <PlannerContent />
        </Suspense>
    )
}

function PlannerContent() {
    const searchParams = useSearchParams()
    const preselectedVehicle = searchParams.get('vehicle')

    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [searchQuery, setSearchQuery] = useState('')

    // Planner State
    const [preferredDestinations, setPreferredDestinations] = useState<Destination[]>([])

    // Drag State
    const [draggedItem, setDraggedItem] = useState<Destination | null>(null)

    // Form Modal State
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        whatsapp: '',
        telegram: '',
        vehicleType: preselectedVehicle || 'Sedan',
        vehicleCount: 1,
        passengers: 2,
        startDate: '',
        selectedAddons: [] as string[]
    })

    // Filter destinations by category and search
    const availableDestinations = allDestinations.filter(d =>
        (selectedCategory === 'All' || d.categories.includes(selectedCategory.toLowerCase())) &&
        !preferredDestinations.find(p => p.id === d.id) &&
        (searchQuery === '' || d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.district.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const handleDragStart = (e: React.DragEvent, item: Destination) => {
        setDraggedItem(item)
        e.dataTransfer.effectAllowed = 'copy'
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if (draggedItem) {
            if (!preferredDestinations.find(p => p.id === draggedItem.id)) {
                setPreferredDestinations([...preferredDestinations, draggedItem])
            }
            setDraggedItem(null)
        }
    }

    const removeFromPreferred = (id: string) => {
        setPreferredDestinations(preferredDestinations.filter(d => d.id !== id))
    }

    const moveUp = (index: number) => {
        if (index === 0) return
        const newDests = [...preferredDestinations]
        const temp = newDests[index - 1]
        newDests[index - 1] = newDests[index]
        newDests[index] = temp
        setPreferredDestinations(newDests)
    }

    const moveDown = (index: number) => {
        if (index === preferredDestinations.length - 1) return
        const newDests = [...preferredDestinations]
        const temp = newDests[index + 1]
        newDests[index + 1] = newDests[index]
        newDests[index] = temp
        setPreferredDestinations(newDests)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        const payload = {
            ...formData,
            destinations: preferredDestinations.map(d => d.id),
            addons: formData.selectedAddons,
            contact: {
                whatsapp: formData.whatsapp,
                telegram: formData.telegram
            }
        }

        try {
            const res = await fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (res.ok) {
                setSubmitted(true)
                setIsFormOpen(false)
            } else {
                alert('Submission failed. Please try again.')
            }
        } catch (error) {
            alert('Network error.')
        } finally {
            setSubmitting(false)
        }
    }



    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Inquiry Received!</h2>
                    <p className="text-slate-500 mb-6">We have received your list of {preferredDestinations.length} destinations. Our team will contact you shortly with a personalized plan.</p>
                    <button
                        onClick={() => {
                            setSubmitted(false)
                            setPreferredDestinations([])
                            setFormData({ ...formData, email: '' })
                        }}
                        className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition"
                    >
                        Plan Another Trip
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
                <h1 className="text-xl font-serif font-bold text-slate-900">Trip Architect</h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-500">
                        Drop items to your list <span className="bg-slate-100 px-2 py-0.5 rounded text-xs border font-mono">Right Side</span>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        disabled={preferredDestinations.length === 0}
                        className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-900/10 flex items-center gap-2"
                    >
                        Request Quote ({preferredDestinations.length})
                    </button>
                </div>
            </header>

            {preselectedVehicle && (
                <div className="bg-blue-50 border-b border-blue-100 px-6 py-3 flex items-center gap-3 text-blue-800 shrink-0 z-10 relative">
                    <Car className="h-5 w-5 text-blue-600" />
                    <p className="font-medium text-sm">
                        You have selected the <strong>{preselectedVehicle}</strong>. Please select the places you'd like to visit to complete your trip plan.
                    </p>
                </div>
            )}

            <main className="flex-1 flex overflow-hidden">
                {/* Left: Destination Bank */}
                <aside className="w-full md:w-[350px] xl:w-[450px] flex flex-col shrink-0 border-r border-slate-200 bg-white">
                    <div className="p-4 border-b border-slate-100 space-y-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search destinations or districts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        {/* Categories */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition ${selectedCategory === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                All ({allDestinations.length})
                            </button>
                            {allCategories.map((cat: string) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition ${selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400">{availableDestinations.length} destinations available</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                        {availableDestinations.map(dest => (
                            <div
                                key={dest.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, dest)}
                                className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-emerald-400 hover:shadow-md transition group flex gap-3"
                            >
                                <div className="h-20 w-24 bg-slate-200 rounded-lg flex-shrink-0 relative overflow-hidden">
                                    <Image src={dest.image} alt={dest.name} fill className="object-cover" sizes="96px" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h4 className="font-bold text-slate-900 truncate">{dest.name}</h4>
                                    <p className="text-xs text-slate-500 line-clamp-1 mb-2">{dest.description}</p>
                                    <span className="self-start text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium uppercase tracking-wider">{dest.category}</span>
                                </div>
                                <div className="flex flex-col gap-2 items-center text-slate-300">
                                    <Link
                                        href={`/destinations/${dest.slug}`}
                                        target="_blank"
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1 hover:bg-slate-100 rounded-full hover:text-emerald-600 transition"
                                        title="View Details"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Link>
                                    <div className="group-hover:text-emerald-500 transition">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Center: Preferred List (Drop Zone) */}
                <div
                    className="flex-1 bg-slate-100 p-4 xl:p-8 overflow-y-auto relative min-w-[320px]"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <div className="max-w-2xl mx-auto min-h-[500px]">
                        <h2 className="text-2xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <MapPin className="h-6 w-6 text-emerald-600" /> My Trip Itinerary
                        </h2>

                        {preferredDestinations.length === 0 ? (
                            <div className="border-3 border-dashed border-slate-300 rounded-2xl h-96 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                                <MapPin className="h-12 w-12 mb-4 opacity-50" />
                                <p className="font-medium text-lg">Your list is empty</p>
                                <p className="text-sm">Drag destinations here from the left panel</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {preferredDestinations.map((dest, index) => (
                                    <div key={dest.id} className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 flex items-center gap-4 group">
                                        <div className="flex flex-col gap-1 items-center pr-3 border-r border-slate-100">
                                            <button onClick={() => moveUp(index)} disabled={index === 0} className={`p-1 rounded-full ${index === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-100 hover:text-emerald-600 transition'}`}>
                                                <ChevronUp className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => moveDown(index)} disabled={index === preferredDestinations.length - 1} className={`p-1 rounded-full ${index === preferredDestinations.length - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-100 hover:text-emerald-600 transition'}`}>
                                                <ChevronDown className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="h-16 w-24 bg-slate-200 rounded-lg relative overflow-hidden flex-shrink-0">
                                            <Image src={dest.image} alt={dest.name} fill className="object-cover" sizes="96px" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900">{dest.name}</h3>
                                            <div className="flex gap-2 mt-1">
                                                {dest.highlights?.slice(0, 3).map((h, i) => (
                                                    <span key={i} className="text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{h}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Link
                                                href={`/destinations/${dest.slug}`}
                                                target="_blank"
                                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition"
                                                title="View Details"
                                            >
                                                <ExternalLink className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => removeFromPreferred(dest.id)}
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Map Visualization (Desktop Only) */}
                <aside className="hidden lg:flex w-[350px] xl:w-[450px] shrink-0 bg-white border-l border-slate-200 p-6 flex-col overflow-y-auto">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-emerald-500" /> Trip Map
                    </h3>
                    <div className="sticky top-6">
                        <PlannerInteractiveMapWrapper
                            destinations={preferredDestinations.map(d => {
                                // Find full destination data from allDestinations to ensure we have map coordinates
                                const fullDest = allDestinations.find(ad => ad.id === d.id) || d
                                return {
                                    ...fullDest,
                                    // if missing map data in the static array, fallback to colombo for safety so it doesn't crash 
                                    // (though our json has coordinates for all)
                                    map: (fullDest as any).map || { lat: 6.9271, lng: 79.8612 }
                                }
                            })}
                        />

                        <div className="mt-6 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                            <h4 className="font-bold text-emerald-900 text-sm mb-2">Trip Summary</h4>
                            <div className="space-y-2 text-sm text-emerald-800">
                                <div className="flex justify-between">
                                    <span>Destinations:</span>
                                    <span className="font-bold">{preferredDestinations.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Districts:</span>
                                    <span className="font-bold">{new Set(preferredDestinations.map(d => d.district)).size}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Inquiry Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-xl font-serif">Finalize Request</h3>
                            <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                <X className="h-5 w-5 text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-sm text-emerald-800">
                                You are requesting a quote for a trip visiting <strong>{preferredDestinations.length} destinations</strong>.
                            </div>

                            {preselectedVehicle && (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 flex items-center gap-2">
                                    <Car className="h-4 w-4" />
                                    <span>You have a pre-selected vehicle requirement: <strong>{preselectedVehicle}</strong></span>
                                </div>
                            )}

                            {/* Date, Vehicle & Pax */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-400" /> Expected Start Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                            <Car className="h-4 w-4 text-slate-400" /> Vehicle Preference
                                        </label>
                                        <select
                                            value={formData.vehicleType}
                                            onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                                            className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                                        >
                                            {preselectedVehicle && (
                                                <option value={preselectedVehicle}>{preselectedVehicle} (Pre-selected)</option>
                                            )}
                                            <option value="Sedan">Sedan (1-3 Pax)</option>
                                            <option value="SUV">SUV (1-4 Pax)</option>
                                            <option value="Van">Mini Van (1-6 Pax)</option>
                                            <option value="Bus">Mini Bus (7-15 Pax)</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Count</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={formData.vehicleCount}
                                                onChange={e => setFormData({ ...formData, vehicleCount: parseInt(e.target.value) })}
                                                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                                                <Users className="h-3 w-3" /> Passengers
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={formData.passengers}
                                                onChange={e => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
                                                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Add-ons */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h4 className="font-bold text-slate-800 mb-3 text-sm">Additional Services</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { id: '1', title: 'Private Guide', price: 50 },
                                        { id: '2', title: 'Photography Package', price: 75 },
                                        { id: '3', title: 'Airport Transfer', price: 35 },
                                        { id: '4', title: 'Local SIM Card', price: 15 }
                                    ].map((addon) => (
                                        <label key={addon.id} className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-400 transition">
                                            <input
                                                type="checkbox"
                                                checked={formData.selectedAddons.includes(addon.title)}
                                                onChange={(e) => {
                                                    const newAddons = e.target.checked
                                                        ? [...formData.selectedAddons, addon.title]
                                                        : formData.selectedAddons.filter(a => a !== addon.title)
                                                    setFormData({ ...formData, selectedAddons: newAddons })
                                                }}
                                                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                            />
                                            <div className="flex justify-between w-full">
                                                <span className="text-sm font-medium text-slate-700">{addon.title}</span>
                                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">${addon.price}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Info className="h-4 w-4 text-emerald-500" />
                                    Contact Details
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.whatsapp}
                                            onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                            className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                                            placeholder="+94..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Telegram (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.telegram}
                                            onChange={e => setFormData({ ...formData, telegram: e.target.value })}
                                            className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                                            placeholder="@username"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                                Send Inquiry
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
