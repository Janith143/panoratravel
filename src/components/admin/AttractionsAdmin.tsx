'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Plus, Trash2, Image as ImageIcon, Loader2, MapPin, Search, ChevronDown, ChevronUp, X, Check, Edit2, Eye, Upload, Download, Trees, Landmark, PawPrint, Waves, Mountain, Footprints, Droplets } from 'lucide-react'
import Image from 'next/image'
import Papa from 'papaparse'
import destinationsData from '@/data/destinations-data.json'

type Attraction = {
    id: string
    name: string
    description: string
    district: string
    province: string
    categories: string[]
    image: string
    highlights: string[]
    bestTime?: string
    entryFee?: string
    map?: { x: number, y: number, lat: number, lng: number }
    category?: string
}

type Category = {
    id: string
    name: string
    icon: string
    color: string
}

type District = {
    name: string
    province: string
}

export default function AttractionsAdmin({ globalCategories }: { globalCategories?: string[] }) {
    const [data, setData] = useState<any>(destinationsData)
    const [isSaving, setIsSaving] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [activeTab, setActiveTab] = useState<'attractions' | 'categories' | 'districts'>('attractions')

    // Attractions state
    const [searchQuery, setSearchQuery] = useState('')
    const [filterDistrict, setFilterDistrict] = useState('All')
    const [filterCategory, setFilterCategory] = useState('All')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const categoryInputRef = useRef<HTMLInputElement>(null)

    // New attraction form
    const [showAddForm, setShowAddForm] = useState(false)
    const [newAttraction, setNewAttraction] = useState<Partial<Attraction>>({
        name: '',
        description: '',
        district: '',
        province: '',
        categories: [],
        image: '/images/destinations/default.jpg',
        highlights: [],
        map: { x: 50, y: 50, lat: 7.8731, lng: 80.7718 },
        category: 'General'
    })

    const handleSave = async () => {
        setIsSaving(true)
        setFeedback('')
        try {
            const res = await fetch('/api/admin/destinations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            const result = await res.json()
            if (result.success) {
                setFeedback('✅ Saved successfully!')
                setTimeout(() => setFeedback(''), 3000)
            } else {
                setFeedback('❌ Error saving.')
            }
        } catch (e) {
            setFeedback('❌ Network error.')
        } finally {
            setIsSaving(false)
        }
    }

    // Get unique districts and categories
    const districts: string[] = [...new Set(data.attractions.map((a: Attraction) => a.district))].sort() as string[]
    const categories: string[] = data.categories.map((c: Category) => c.name)

    // Filter attractions
    const filteredAttractions = data.attractions.filter((a: Attraction) => {
        const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesDistrict = filterDistrict === 'All' || a.district === filterDistrict
        const matchesCategory = filterCategory === 'All' || a.categories.includes(filterCategory.toLowerCase())
        return matchesSearch && matchesDistrict && matchesCategory
    })

    // CRUD operations
    const updateAttraction = (id: string, field: string, value: any) => {
        const newAttractions = data.attractions.map((a: Attraction) =>
            a.id === id ? { ...a, [field]: value } : a
        )
        setData({ ...data, attractions: newAttractions })
    }

    const deleteAttraction = (id: string) => {
        if (!confirm('Delete this attraction?')) return
        const newAttractions = data.attractions.filter((a: Attraction) => a.id !== id)
        setData({ ...data, attractions: newAttractions })
    }

    const addAttraction = () => {
        const id = newAttraction.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `attraction-${Date.now()}`
        const defaultDistrict = districts.length > 0 ? districts[0] : 'Colombo'
        const attraction: Attraction = {
            id,
            name: newAttraction.name || 'New Attraction',
            description: newAttraction.description || '',
            district: newAttraction.district || defaultDistrict,
            province: newAttraction.province || 'Western',
            categories: newAttraction.categories || [],
            image: newAttraction.image || '/images/destinations/default.jpg',
            highlights: newAttraction.highlights || [],
            bestTime: newAttraction.bestTime,
            entryFee: newAttraction.entryFee,
            map: newAttraction.map || { x: 50, y: 50, lat: 7.8731, lng: 80.7718 },
            category: newAttraction.category || (globalCategories && globalCategories.length > 0 ? globalCategories[0] : 'General')
        }
        setData({ ...data, attractions: [...data.attractions, attraction] })
        setShowAddForm(false)
        setNewAttraction({ name: '', description: '', district: '', province: '', categories: [], image: '/images/destinations/default.jpg', highlights: [], map: { x: 50, y: 50, lat: 7.8731, lng: 80.7718 }, category: 'General' })
        setFeedback('✅ Attraction added! Remember to Save Changes.')
    }

    // Category management
    const addCategory = (name: string) => {
        console.log('addCategory called with:', name)
        const categories = Array.isArray(data.categories) ? data.categories : []
        if (!name.trim()) {
            console.log('addCategory: name is empty, returning')
            return
        }
        if (categories.find((c: Category) => c.name?.toLowerCase() === name.toLowerCase())) {
            console.log('addCategory: duplicate found, returning')
            return
        }
        const newCat: Category = {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            icon: '📍',
            color: 'emerald'
        }
        console.log('addCategory: adding new category', newCat)
        setData({ ...data, categories: [...categories, newCat] })
    }

    const deleteCategory = (id: string) => {
        if (!confirm('Delete this category?')) return
        const newCategories = data.categories.filter((c: Category) => c.id !== id)
        setData({ ...data, categories: newCategories })
    }

    // Image upload
    const handleImageUpload = async (attractionId: string, file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'destinations')

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })
            const result = await res.json()
            if (result.success) {
                updateAttraction(attractionId, 'image', result.path)
            } else {
                alert('Upload failed')
            }
        } catch (err) {
            alert('Upload error')
        }
    }

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                let updatedCount = 0
                let addedCount = 0

                // Track parsed items separated by whether they have an ID matches 
                const incomingItems: Attraction[] = results.data.map((row: any) => {
                    const name = row.name || row.Name || 'Unknown Attraction'

                    // Use provided ID or generate a new one
                    const id = row.id || row.Id || row.ID || (name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000))

                    const district = row.district || row.District || (districts.length > 0 ? districts[0] : 'Colombo')
                    const province = row.province || row.Province || 'Western'
                    const catString = row.categories || row.Categories || ''
                    const categoriesArray = catString ? catString.split(',').map((c: string) => c.trim().toLowerCase()) : []
                    const highString = row.highlights || row.Highlights || ''
                    const highlightsArray = highString ? highString.split(',').map((h: string) => h.trim()) : []

                    return {
                        id,
                        name,
                        description: row.description || row.Description || '',
                        district,
                        province,
                        categories: categoriesArray,
                        image: row.image || row.Image || '/images/destinations/default.jpg',
                        highlights: highlightsArray,
                        bestTime: row.bestTime || row.BestTime || '',
                        entryFee: row.entryFee || row.EntryFee || '',
                        map: {
                            x: parseInt(row.mapX || row.x) || 50,
                            y: parseInt(row.mapY || row.y) || 50,
                            lat: parseFloat(row.lat || row.latitude) || 7.8731,
                            lng: parseFloat(row.lng || row.longitude) || 80.7718
                        }
                    }
                })

                setData((prevData: any) => {
                    const existingAttractions = [...prevData.attractions]
                    const newAttractions: Attraction[] = []

                    incomingItems.forEach(incoming => {
                        const existingIndex = existingAttractions.findIndex(a => a.id === incoming.id)
                        if (existingIndex >= 0) {
                            // Update existing
                            existingAttractions[existingIndex] = incoming
                            updatedCount++
                        } else {
                            // Add new
                            newAttractions.push(incoming)
                            addedCount++
                        }
                    })

                    return {
                        ...prevData,
                        attractions: [...existingAttractions, ...newAttractions]
                    }
                })

                if (updatedCount > 0 || addedCount > 0) {
                    setFeedback(`✅ Updated ${updatedCount} / Added ${addedCount} attractions! Remember to Save Changes.`)
                    setTimeout(() => setFeedback(''), 5000)
                }
            },
            error: (error) => {
                console.error("CSV Parse Error:", error)
                setFeedback('❌ Error parsing CSV file.')
                setTimeout(() => setFeedback(''), 3000)
            }
        })

        // Reset the file input
        e.target.value = ''
    }

    const downloadTemplate = () => {
        const headers = ['id', 'name', 'description', 'district', 'province', 'categories', 'image', 'highlights', 'bestTime', 'entryFee', 'lat', 'lng', 'x', 'y']

        // Map all existing attractions to CSV rows
        const rows = data.attractions.map((attr: Attraction) => {
            // Helper to escape commas by wrapping in quotes
            const escapeCSV = (val: string) => {
                if (!val) return ''
                if (val.includes(',') || val.includes('"')) {
                    return `"${val.replace(/"/g, '""')}"`
                }
                return val
            }

            return [
                attr.id,
                escapeCSV(attr.name),
                escapeCSV(attr.description),
                attr.district,
                attr.province,
                escapeCSV(attr.categories?.join(',')),
                attr.image,
                escapeCSV(attr.highlights?.join(',')),
                escapeCSV(attr.bestTime || ''),
                escapeCSV(attr.entryFee || ''),
                attr.map?.lat || '',
                attr.map?.lng || '',
                attr.map?.x || '',
                attr.map?.y || ''
            ].join(',')
        })

        // If no attractions exist, provide a fallback template row
        if (rows.length === 0) {
            const exampleRow = ['', 'Sigiriya Rock Fortress', 'Ancient rock fortress with frescoes and mirror wall', 'Matale', 'Central', '"heritage,nature"', '/images/destinations/sigiriya.jpg', '"Lion Rock,Frescoes,Mirror Wall"', 'December - April', '$30 foreigners', '7.9570', '80.7603', '55', '40']
            rows.push(exampleRow.join(','))
        }

        const csv = [headers.join(','), ...rows].join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'attractions_export.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-slate-900 text-white p-4 shadow-md relative z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">Attractions Manager</h1>
                        <p className="text-xs text-slate-400">{data.attractions.length} attractions • {data.categories.length} categories</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {feedback && <span className="text-sm font-medium animate-pulse">{feedback}</span>}
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                            Save All Changes
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto p-6">
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {['attractions', 'categories', 'districts'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize ${activeTab === tab ? 'bg-white shadow text-emerald-600' : 'text-slate-600 hover:bg-white/50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Attractions Tab */}
                {activeTab === 'attractions' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search attractions..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                            <select
                                value={filterDistrict}
                                onChange={(e) => setFilterDistrict(e.target.value)}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900"
                            >
                                <option value="All">All Districts ({districts.length})</option>
                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900"
                            >
                                <option value="All">All Categories</option>
                                {categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className="flex gap-2">
                                <button
                                    onClick={downloadTemplate}
                                    className="flex items-center gap-2 bg-white text-slate-600 font-medium px-4 py-2 rounded-lg hover:bg-slate-50 border border-slate-300"
                                >
                                    <Download className="h-4 w-4" /> Template
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 bg-slate-100 text-slate-700 font-medium px-4 py-2 rounded-lg hover:bg-slate-200 border border-slate-300"
                                >
                                    <Upload className="h-4 w-4" /> Upload CSV
                                </button>
                                <input
                                    type="file"
                                    accept=".csv"
                                    ref={fileInputRef}
                                    className="hidden text-slate-900"
                                    onChange={handleCSVUpload}
                                />
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                                >
                                    <Plus className="h-4 w-4" /> Add Attraction
                                </button>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500">Showing {filteredAttractions.length} of {data.attractions.length} attractions</p>

                        {/* Attractions List */}
                        <div className="space-y-3">
                            {filteredAttractions.map((attr: Attraction) => (
                                <div key={attr.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition">
                                    <div
                                        className="p-4 flex items-center gap-4 cursor-pointer"
                                        onClick={() => setExpandedId(expandedId === attr.id ? null : attr.id)}
                                    >
                                        <div className="w-16 h-16 bg-slate-200 rounded-lg relative overflow-hidden flex-shrink-0">
                                            <Image src={attr.image} alt={attr.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900 truncate">{attr.name}</h3>
                                            <p className="text-sm text-slate-500">{attr.district} • {attr.province}</p>
                                            <div className="flex gap-1 mt-1">
                                                {attr.categories.slice(0, 3).map(c => (
                                                    <span key={c} className="text-xs bg-slate-100 px-2 py-0.5 rounded">{c}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteAttraction(attr.id) }}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            {expandedId === attr.id ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                                        </div>
                                    </div>

                                    {/* Expanded Edit Form */}
                                    {expandedId === attr.id && (
                                        <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                                    <input
                                                        type="text"
                                                        value={attr.name}
                                                        onChange={(e) => updateAttraction(attr.id, 'name', e.target.value)}
                                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                                                    <select
                                                        value={attr.district}
                                                        onChange={(e) => updateAttraction(attr.id, 'district', e.target.value)}
                                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                                                    >
                                                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                                    </select>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                                    <textarea
                                                        value={attr.description}
                                                        onChange={(e) => updateAttraction(attr.id, 'description', e.target.value)}
                                                        rows={3}
                                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Categories</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {categories.map((cat: string) => (
                                                            <label key={cat} className="flex items-center gap-1 text-sm bg-slate-100 px-2 py-1 rounded text-slate-900">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={attr.categories.includes(cat.toLowerCase())}
                                                                    onChange={(e) => {
                                                                        const newCats = e.target.checked
                                                                            ? [...attr.categories, cat.toLowerCase()]
                                                                            : attr.categories.filter(c => c !== cat.toLowerCase())
                                                                        updateAttraction(attr.id, 'categories', newCats)
                                                                    }}
                                                                    className="rounded"
                                                                />
                                                                {cat}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={attr.image}
                                                            onChange={(e) => updateAttraction(attr.id, 'image', e.target.value)}
                                                            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-slate-900"
                                                        />
                                                        <label className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-slate-800">
                                                            Upload
                                                            <input
                                                                type="file"
                                                                className="hidden text-slate-900"
                                                                accept="image/*"
                                                                onChange={(e) => e.target.files?.[0] && handleImageUpload(attr.id, e.target.files[0])}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Best Time to Visit</label>
                                                    <input
                                                        type="text"
                                                        value={attr.bestTime || ''}
                                                        onChange={(e) => updateAttraction(attr.id, 'bestTime', e.target.value)}
                                                        placeholder="e.g. December - April"
                                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Entry Fee</label>
                                                    <input
                                                        type="text"
                                                        value={attr.entryFee || ''}
                                                        onChange={(e) => updateAttraction(attr.id, 'entryFee', e.target.value)}
                                                        placeholder="e.g. $30 foreigners"
                                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                                                    />
                                                </div>
                                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50/50 p-4 rounded-lg border border-emerald-100 mt-2">
                                                    <div className="md:col-span-2">
                                                        <h4 className="text-sm font-bold text-emerald-800 mb-2">Map Configuration</h4>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-emerald-700 mb-1 block">Latitude (Lat)</label>
                                                        <input
                                                            type="number" step="any"
                                                            value={attr.map?.lat || ''}
                                                            onChange={(e) => updateAttraction(attr.id, 'map', { ...(attr.map || { x: 50, y: 50, lat: 0, lng: 0 }), lat: parseFloat(e.target.value) || 0 })}
                                                            className="w-full border border-emerald-300 rounded-md p-2 text-sm text-slate-900 bg-white focus:ring-emerald-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-emerald-700 mb-1 block">Longitude (Lng)</label>
                                                        <input
                                                            type="number" step="any"
                                                            value={attr.map?.lng || ''}
                                                            onChange={(e) => updateAttraction(attr.id, 'map', { ...(attr.map || { x: 50, y: 50, lat: 0, lng: 0 }), lng: parseFloat(e.target.value) || 0 })}
                                                            className="w-full border border-emerald-300 rounded-md p-2 text-sm text-slate-900 bg-white focus:ring-emerald-500"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2 border-t border-emerald-200/50 pt-2 mt-2">
                                                        <label className="text-[10px] text-emerald-600/70 uppercase tracking-widest font-bold mb-2 block">Legacy Coordinates (Static Map)</label>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-slate-500 mb-1 block">Legacy X (%)</label>
                                                        <input
                                                            type="number"
                                                            value={attr.map?.x ?? 50}
                                                            onChange={(e) => updateAttraction(attr.id, 'map', { ...(attr.map || { x: 50, y: 50, lat: 0, lng: 0 }), x: parseInt(e.target.value) || 0 })}
                                                            className="w-full border border-slate-300 rounded-md p-2 text-sm text-slate-900"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-slate-500 mb-1 block">Legacy Y (%)</label>
                                                        <input
                                                            type="number"
                                                            value={attr.map?.y ?? 50}
                                                            onChange={(e) => updateAttraction(attr.id, 'map', { ...(attr.map || { x: 50, y: 50, lat: 0, lng: 0 }), y: parseInt(e.target.value) || 0 })}
                                                            className="w-full border border-slate-300 rounded-md p-2 text-sm text-slate-900"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Highlights (comma separated)</label>
                                                    <input
                                                        type="text"
                                                        value={attr.highlights?.join(', ') || ''}
                                                        onChange={(e) => updateAttraction(attr.id, 'highlights', e.target.value.split(',').map(h => h.trim()).filter(Boolean))}
                                                        placeholder="Lion Rock, Frescoes, Mirror Wall"
                                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-xl font-bold mb-4 text-slate-900">Manage Categories</h2>
                        <div className="flex gap-2 mb-6">
                            <input
                                type="text"
                                ref={categoryInputRef}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        const val = categoryInputRef.current?.value || ''
                                        if (val.trim()) {
                                            addCategory(val)
                                            categoryInputRef.current!.value = ''
                                        }
                                    }
                                }}
                                placeholder="New category name"
                                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const val = categoryInputRef.current?.value || ''
                                    console.log('Add Category button clicked, ref value:', val)
                                    if (val.trim()) {
                                        addCategory(val)
                                        categoryInputRef.current!.value = ''
                                    } else {
                                        console.log('Button clicked but input is empty')
                                    }
                                }}
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 whitespace-nowrap"
                            >
                                Add Category
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {data.categories.map((cat: Category) => {
                                // Map string icon names to Lucide components
                                const IconComp =
                                    cat.icon === 'trees' ? Trees :
                                        cat.icon === 'landmark' ? Landmark :
                                            cat.icon === 'paw-print' ? PawPrint :
                                                cat.icon === 'waves' ? Waves :
                                                    cat.icon === 'mountain' ? Mountain :
                                                        cat.icon === 'footprints' ? Footprints :
                                                            cat.icon === 'droplets' ? Droplets : MapPin

                                return (
                                    <div key={cat.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 min-w-[140px] flex-1 max-w-[250px]">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className={`p-2 rounded-lg ${cat.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'} shrink-0`}>
                                                <IconComp className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium text-slate-900 truncate">{cat.name}</span>
                                        </div>
                                        <button
                                            onClick={() => deleteCategory(cat.id)}
                                            className="text-slate-400 hover:text-red-500 shrink-0 p-1 rounded-md hover:bg-red-50 transition"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Districts Tab */}
                {activeTab === 'districts' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-xl font-bold mb-4 text-slate-900">Districts Overview</h2>
                        <p className="text-sm text-slate-500 mb-6">Districts are automatically extracted from attraction data. Add attractions with new districts to create them.</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {districts.map(district => {
                                const count = data.attractions.filter((a: Attraction) => a.district === district).length
                                return (
                                    <div key={district} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                        <div className="text-2xl font-bold text-emerald-600">{count}</div>
                                        <div className="text-sm font-medium text-slate-700">{district}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Add Attraction Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Add New Attraction</h2>
                                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={newAttraction.name}
                                        onChange={(e) => setNewAttraction({ ...newAttraction, name: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">District *</label>
                                        <select
                                            value={newAttraction.district}
                                            onChange={(e) => setNewAttraction({ ...newAttraction, district: e.target.value })}
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                                        >
                                            <option value="">Select District</option>
                                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Province *</label>
                                        <select
                                            value={newAttraction.province}
                                            onChange={(e) => setNewAttraction({ ...newAttraction, province: e.target.value })}
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                                        >
                                            <option value="">Select Province</option>
                                            <option value="Western">Western</option>
                                            <option value="Central">Central</option>
                                            <option value="Southern">Southern</option>
                                            <option value="Northern">Northern</option>
                                            <option value="Eastern">Eastern</option>
                                            <option value="North Western">North Western</option>
                                            <option value="North Central">North Central</option>
                                            <option value="Uva">Uva</option>
                                            <option value="Sabaragamuwa">Sabaragamuwa</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea
                                        value={newAttraction.description}
                                        onChange={(e) => setNewAttraction({ ...newAttraction, description: e.target.value })}
                                        rows={3}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Categories</label>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((cat: string) => (
                                            <label key={cat} className="flex items-center gap-1 text-sm bg-slate-100 px-2 py-1 rounded text-slate-900">
                                                <input
                                                    type="checkbox"
                                                    checked={newAttraction.categories?.includes(cat.toLowerCase())}
                                                    onChange={(e) => {
                                                        const newCats = e.target.checked
                                                            ? [...(newAttraction.categories || []), cat.toLowerCase()]
                                                            : (newAttraction.categories || []).filter(c => c !== cat.toLowerCase())
                                                        setNewAttraction({ ...newAttraction, categories: newCats })
                                                    }}
                                                    className="rounded"
                                                />
                                                {cat}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50/50 p-4 rounded-lg border border-emerald-100 mt-4">
                                    <div className="md:col-span-2">
                                        <h4 className="text-sm font-bold text-emerald-800 mb-2">Map Configuration</h4>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-emerald-700 mb-1 block">Latitude (Lat)</label>
                                        <input
                                            type="number" step="any"
                                            value={newAttraction.map?.lat ?? 7.8731}
                                            onChange={(e) => setNewAttraction({ ...newAttraction, map: { ...(newAttraction.map || { x: 50, y: 50, lat: 0, lng: 0 }), lat: parseFloat(e.target.value) || 0 } })}
                                            className="w-full border border-emerald-300 rounded-md px-3 py-2 bg-white focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-emerald-700 mb-1 block">Longitude (Lng)</label>
                                        <input
                                            type="number" step="any"
                                            value={newAttraction.map?.lng ?? 80.7718}
                                            onChange={(e) => setNewAttraction({ ...newAttraction, map: { ...(newAttraction.map || { x: 50, y: 50, lat: 0, lng: 0 }), lng: parseFloat(e.target.value) || 0 } })}
                                            className="w-full border border-emerald-300 rounded-md px-3 py-2 bg-white focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2 border-t border-emerald-200/50 pt-2 mt-2">
                                        <label className="text-[10px] text-emerald-600/70 uppercase tracking-widest font-bold mb-2 block">Legacy Coordinates (Static Map)</label>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Legacy X (%)</label>
                                        <input
                                            type="number"
                                            value={newAttraction.map?.x ?? 50}
                                            onChange={(e) => setNewAttraction({ ...newAttraction, map: { ...(newAttraction.map || { x: 50, y: 50, lat: 0, lng: 0 }), x: parseInt(e.target.value) || 0 } })}
                                            className="w-full border border-slate-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Legacy Y (%)</label>
                                        <input
                                            type="number"
                                            value={newAttraction.map?.y ?? 50}
                                            onChange={(e) => setNewAttraction({ ...newAttraction, map: { ...(newAttraction.map || { x: 50, y: 50, lat: 0, lng: 0 }), y: parseInt(e.target.value) || 0 } })}
                                            className="w-full border border-slate-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={addAttraction}
                                    disabled={!newAttraction.name || !newAttraction.district}
                                    className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    Add Attraction
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
