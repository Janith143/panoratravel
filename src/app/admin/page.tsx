'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, Image as ImageIcon, Loader2, MapPin, Calendar, Clock, DollarSign, GripVertical, Check, X, Mail } from 'lucide-react'
import Image from 'next/image'
import AttractionsAdmin from '@/components/admin/AttractionsAdmin'
import ToursAdmin from '@/components/admin/ToursAdmin'
import BlogEditor from '@/components/admin/BlogEditor'
import FAQEditor from '@/components/admin/FaqEditor'
import SiteContentEditor from '@/components/admin/SiteContentEditor'
import ReviewsAdmin from '@/components/admin/ReviewsAdmin'

import contentData from '@/data/content.json'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('inquiries')
    const [content, setContent] = useState<any>(contentData)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [selectedInquiry, setSelectedInquiry] = useState<any>(null)
    const [feedback, setFeedback] = useState('')

    const handlePlanInquiry = (inq: any) => {
        setSelectedInquiry(inq)
        setActiveTab('planner')
    }

    // Load initial content from API (Database + JSON)
    useEffect(() => {
        setIsLoading(true)
        fetch('/api/admin/content')
            .then(res => res.json())
            .then(data => {
                setContent(data)
                setIsLoading(false)
            })
            .catch(err => {
                console.error(err)
                setIsLoading(false)
            })
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        setFeedback('')
        try {
            const res = await fetch('/api/admin/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content)
            })
            const data = await res.json()
            if (data.success) {
                setFeedback('Saved successfully!')
                setTimeout(() => setFeedback(''), 3000)
            } else {
                setFeedback('Error saving.')
            }
        } catch (e) {
            setFeedback('Network error.')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-emerald-600" /></div>

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Panora Travels CMS</h1>
                    <div className="flex items-center gap-4">
                        {feedback && <span className="text-emerald-400 text-sm font-medium animate-pulse">{feedback}</span>}
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto p-4 md:p-8 space-y-6">
                <div className="flex flex-wrap gap-2 pb-4">
                    {['inquiries', 'planner', 'attractions', 'tours', 'fleet', 'blog', 'faq', 'reviews', 'settings'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 rounded-lg text-sm font-medium capitalize transition whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 shadow text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                        >
                            {tab === 'attractions' ? 'Destinations / Attractions' : tab}
                        </button>
                    ))}
                </div>

                {/* Main Editor */}
                <main className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 min-h-[500px]">
                    {activeTab === 'attractions' && <AttractionsAdmin globalCategories={content?.categories || []} />}
                    {activeTab === 'tours' && <ToursAdmin globalCategories={content?.categories || []} />}
                    {activeTab === 'blog' && <BlogEditor content={content.posts || []} setContent={(posts) => setContent({ ...content, posts })} />}
                    {activeTab === 'faq' && <FAQEditor content={content.faq || []} setContent={(faq) => setContent({ ...content, faq })} />}
                    {activeTab === 'reviews' && <ReviewsAdmin />}
                    {activeTab === 'settings' && <SiteContentEditor content={content.siteConfig} setContent={(siteConfig) => setContent({ ...content, siteConfig })} />}
                    {activeTab === 'inquiries' && <InquiriesViewer content={content} onPlan={handlePlanInquiry} />}
                    {activeTab === 'planner' && <TripPlanner content={content} initialInquiry={selectedInquiry} />}
                    {activeTab === 'fleet' && <FleetEditor content={content} setContent={setContent} />}
                </main>

                {/* Note about hidden features */}
                <div className="text-xs text-slate-400 mt-2 flex items-center justify-center gap-2">
                    <span className="font-bold">Hidden Features:</span>
                    <span>360° Fleet View (Disabled)</span>
                </div>
            </div>
        </div>
    )
}





function InquiriesViewer({ content, onPlan }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif">Inquiries</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-700">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Client</th>
                            <th className="px-6 py-3">Vehicle</th>
                            <th className="px-6 py-3">Destinations</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...(content.inquiries || [])].map((inq: any) => (
                            <tr key={inq.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                                <td className="px-6 py-4">{new Date(inq.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">{inq.email}</div>
                                    <div className="text-xs text-slate-500">{inq.contact?.whatsapp || '-'}</div>
                                    {inq.startDate && (
                                        <div className="text-xs text-emerald-600 mt-1 font-medium">
                                            Start: {new Date(inq.startDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm">
                                        {inq.vehicleType} x{inq.vehicleCount} ({inq.passengers} Pax)
                                    </div>
                                    {inq.addons && inq.addons.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {inq.addons.map((addon: string) => (
                                                <span key={addon} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">
                                                    + {addon}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {inq.destinations?.map((did: string) => {
                                            const d = content.destinations.find((x: any) => x.id === did)
                                            return <span key={did} className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">{d?.name || did}</span>
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{inq.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => onPlan(inq)}
                                        className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 transition font-bold"
                                    >
                                        Plan Trip
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!content.inquiries || content.inquiries.length === 0) && (
                    <div className="text-center py-10 text-slate-500">No inquiries yet.</div>
                )}
            </div>
        </div>
    )
}

// Re-implementing the Day-based Planner logic here for Admins
function TripPlanner({ content, initialInquiry }: any) {
    // Basic state for the trip planner
    type Activity = { id: string, title: string, cost: number, duration: string }
    type AdditionalService = { id: string, title: string, cost: number }

    const [days, setDays] = useState<string[]>(['day-1', 'day-2'])
    const [itinerary, setItinerary] = useState<{ [key: string]: Activity[] }>({
        'day-1': [],
        'day-2': []
    })
    const [draggedItem, setDraggedItem] = useState<{ item: Activity, source: string, index: number } | null>(null)

    // New State for Additional Services
    const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([])
    const [newServiceName, setNewServiceName] = useState('')
    const [newServiceCost, setNewServiceCost] = useState('')

    // Simplified list of destinations as "Activities"
    const availableActivities: Activity[] = content.destinations.map((d: any) => ({
        id: d.id,
        title: d.name,
        cost: 0,
        duration: '2h'
    }))

    // Auto-populate additional services from inquiry
    useEffect(() => {
        if (initialInquiry && initialInquiry.addons && content.addons) {
            const mappedServices: AdditionalService[] = initialInquiry.addons.map((addonName: string) => {
                const found = content.addons.find((a: any) => a.title === addonName)
                return {
                    id: `service-${Date.now()}-${Math.random()}`,
                    title: addonName,
                    cost: found ? found.price : 0
                }
            })
            setAdditionalServices(mappedServices)
        }
    }, [initialInquiry, content.addons])

    const handleDragStart = (e: React.DragEvent, item: Activity, source: string, index: number) => {
        setDraggedItem({ item, source, index })
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent, targetDay: string) => {
        e.preventDefault()
        if (!draggedItem) return
        const { item, source, index } = draggedItem

        if (source === targetDay) return // Reorder logic could go here

        const newItinerary = { ...itinerary }

        // If moving from another day, remove from source
        if (source !== 'bank') {
            newItinerary[source] = newItinerary[source].filter((_, i) => i !== index)
        }

        // Add to target
        if (!newItinerary[targetDay]) newItinerary[targetDay] = []
        newItinerary[targetDay].push({ ...item }) // Clone item to allow independent edits

        setItinerary(newItinerary)
        setDraggedItem(null)
    }

    const updateActivityCost = (day: string, index: number, cost: number) => {
        const newItinerary = { ...itinerary }
        newItinerary[day][index].cost = cost
        setItinerary(newItinerary)
    }

    // Additional Services Logic
    const addService = () => {
        if (!newServiceName.trim()) return
        const cost = parseFloat(newServiceCost) || 0
        const newService: AdditionalService = {
            id: `service-${Date.now()}`,
            title: newServiceName,
            cost: cost
        }
        setAdditionalServices([...additionalServices, newService])
        setNewServiceName('')
        setNewServiceCost('')
    }

    const removeService = (id: string) => {
        setAdditionalServices(additionalServices.filter(s => s.id !== id))
    }

    const calculateTotal = () => {
        let total = 0
        Object.values(itinerary).forEach(dayActivities => {
            dayActivities.forEach(act => total += (act.cost || 0))
        })
        additionalServices.forEach(s => total += (s.cost || 0))
        return total
    }

    const addDay = () => {
        const newDayId = `day-${days.length + 1}`
        setDays([...days, newDayId])
        setItinerary({ ...itinerary, [newDayId]: [] })
    }

    const exportPDF = () => {
        const printWindow = window.open('', '', 'width=800,height=600')
        if (!printWindow) return

        const totalCost = calculateTotal()

        let html = `
            <html>
                <head>
                    <title>Trip Itinerary - ${initialInquiry?.email || 'Draft'}</title>
                    <style>
                        body {font - family: sans-serif; padding: 40px; color: #1e293b; }
                        h1 {color: #064e3b; border-bottom: 2px solid #064e3b; padding-bottom: 10px; }
                        .meta {margin - bottom: 30px; background: #f0fdf4; padding: 20px; border-radius: 8px; border: 1px solid #bbf7d0; }
                        .day {margin - bottom: 30px; page-break-inside: avoid; }
                        .day-header {font - weight: bold; font-size: 1.2em; background: #ecfdf5; padding: 10px; border-radius: 4px; color: #065f46; margin-bottom: 10px; border-left: 4px solid #059669; }
                        .activity {padding: 10px 20px; border-bottom: 1px solid #e2e8f0; margin-bottom: 5px; display: flex; justify-content: space-between; }
                        .activity:last-child {border - bottom: none; }
                        .cost {font - weight: bold; color: #059669; }
                        .total-section {margin - top: 40px; text-align: right; font-size: 1.5em; font-weight: bold; padding-top: 20px; border-top: 2px solid #064e3b; color: #064e3b; }
                        .footer {margin - top: 50px; text-align: center; font-size: 0.8em; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px; }
                        .extras {margin - top: 30px; border-top: 2px dashed #cbd5e1; padding-top: 20px; }
                        .extras h3 {color: #475569; margin-bottom: 10px; }
                    </style>
                </head>
                <body>
                    <h1>Trip Itinerary</h1>
                    <div class="meta">
                        <strong>Client:</strong> ${initialInquiry?.email || 'N/A'}<br>
                            <strong>Vehicle:</strong> ${initialInquiry?.vehicleType || 'Not specified'} (${initialInquiry?.passengers || 0} Pax)<br>
                                <strong>Date Generated:</strong> ${new Date().toLocaleDateString()}
                            </div>
                            `

        days.forEach((day, idx) => {
            if (itinerary[day]?.length > 0) {
                html += `<div class="day"><div class="day-header">Day ${idx + 1}</div>`
                itinerary[day].forEach(act => {
                    html += `
                        <div class="activity">
                            <span>${act.title}</span>
                            <span class="cost">$${act.cost || 0}</span>
                        </div>`
                })
                html += `</div>`
            }
        })

        if (additionalServices.length > 0) {
            html += `<div class="extras"><h3>Additional Services</h3>`
            additionalServices.forEach(s => {
                html += `
                    <div class="activity">
                        <span>${s.title}</span>
                        <span class="cost">$${s.cost || 0}</span>
                    </div>`
            })
            html += `</div>`
        }

        html += `
                <div class="total-section">
                    Total Estimated Cost: $${totalCost}
                </div>
                <div class="footer">Generated by Panora Travels Trip Architect</div>
            </body>
        </html>
        `

        printWindow.document.write(html)
        printWindow.document.close()
        setTimeout(() => printWindow.print(), 500)
    }

    return (
        <div className="space-y-6 h-[600px] flex flex-col">
            <h2 className="text-2xl font-bold font-serif flex justify-between items-center">
                <span>
                    Trip Builder
                    {initialInquiry && <span className="ml-3 text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">For: {initialInquiry.email}</span>}
                </span>
                <div className="flex items-center gap-4">
                    <div className="text-lg font-bold text-slate-700 bg-white px-4 py-1 rounded-lg border border-slate-200 shadow-sm">
                        Total: <span className="text-emerald-600">${calculateTotal()}</span>
                    </div>
                    <button onClick={exportPDF} className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition shadow-sm flex items-center gap-2">
                        <Save className="h-4 w-4" /> Download PDF
                    </button>
                </div>
            </h2>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Sidebar Bank */}
                <div className="w-64 flex-shrink-0 bg-slate-50 border border-slate-200 rounded-xl flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-slate-200 font-bold text-slate-700 bg-slate-100">Destinations</div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {availableActivities.sort((a, b) => {
                            // Sort logic: requested items first
                            const aReq = initialInquiry?.destinations?.includes(a.id) ? 1 : 0
                            const bReq = initialInquiry?.destinations?.includes(b.id) ? 1 : 0
                            return bReq - aReq
                        }).map((act, i) => {
                            const isRequested = initialInquiry?.destinations?.includes(act.id)
                            return (
                                <div
                                    key={act.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, act, 'bank', i)}
                                    className={`p-2 text-sm border rounded shadow-sm cursor-grab text-slate-900 ${isRequested ? 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-100' : 'bg-white border-slate-200'} `}
                                >
                                    <div className="flex justify-between items-center">
                                        {act.title}
                                        {isRequested && <Check className="h-3 w-3 text-emerald-600" />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Days Horizontal Scroll */}
                <div className="flex-1 overflow-x-auto">
                    <div className="flex gap-4 h-full pb-2">
                        {days.map((day, idx) => (
                            <div
                                key={day}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, day)}
                                className="w-72 flex-shrink-0 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col"
                            >
                                <div className="p-3 bg-emerald-50 border-b border-emerald-100 font-bold text-emerald-800 flex justify-between items-center">
                                    Day {idx + 1}
                                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                        ${itinerary[day]?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0}
                                    </span>
                                </div>
                                <div className="flex-1 p-2 space-y-2 overflow-y-auto bg-slate-50/50">
                                    {itinerary[day]?.map((act, i) => (
                                        <div
                                            key={`${day} -${i} `}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, act, day, i)}
                                            className="bg-white p-3 rounded border border-emerald-100 shadow-sm text-sm text-slate-900 space-y-2"
                                        >
                                            <div className="font-medium">{act.title}</div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-3 w-3 text-slate-400" />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={act.cost}
                                                    onChange={(e) => updateActivityCost(day, i, parseFloat(e.target.value) || 0)}
                                                    className="w-full text-xs border border-slate-200 rounded px-1 py-0.5 outline-none focus:border-emerald-500 text-slate-900"
                                                    placeholder="Cost"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {itinerary[day]?.length === 0 && <div className="text-center text-xs text-slate-400 py-10">Drop items here</div>}
                                </div>
                            </div>
                        ))}
                        <button onClick={addDay} className="w-16 h-full border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-300">
                            <Plus className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Additional Services Panel */}
                <div className="w-64 flex-shrink-0 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
                    <div className="p-3 border-b border-slate-200 font-bold text-slate-700 bg-slate-100">Additional Services</div>

                    <div className="p-3 border-b border-slate-100 space-y-2 bg-slate-50">
                        <input
                            type="text"
                            value={newServiceName}
                            onChange={(e) => setNewServiceName(e.target.value)}
                            placeholder="Item Name (e.g. Visa)"
                            className="w-full text-xs border border-slate-300 rounded px-2 py-1 outline-none focus:border-emerald-500 text-slate-900"
                        />
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={newServiceCost}
                                onChange={(e) => setNewServiceCost(e.target.value)}
                                placeholder="Cost ($)"
                                className="w-full text-xs border border-slate-300 rounded px-2 py-1 outline-none focus:border-emerald-500 text-slate-900"
                            />
                            <button onClick={addService} className="bg-slate-900 text-white px-2 py-1 rounded text-xs font-bold hover:bg-slate-800">Add</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {additionalServices.map((service) => (
                            <div key={service.id} className="bg-white p-2 rounded border border-slate-200 shadow-sm text-sm text-slate-700 flex justify-between items-center group">
                                <div>
                                    <div className="font-medium text-xs">{service.title}</div>
                                    <div className="text-emerald-600 font-bold text-xs">${service.cost}</div>
                                </div>
                                <button onClick={() => removeService(service.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        {additionalServices.length === 0 && <div className="text-center text-xs text-slate-400 py-4">No extras added</div>}
                    </div>
                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs font-bold text-slate-700 flex justify-between">
                        <span>Extras Total:</span>
                        <span>${additionalServices.reduce((sum, s) => sum + s.cost, 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ToursEditor({ content, setContent }: any) {
    const [uploadingId, setUploadingId] = useState<number | null>(null)

    const updateTour = (index: number, field: string, value: any) => {
        const newTours = [...content.tours]
        newTours[index] = { ...newTours[index], [field]: value }
        setContent({ ...content, tours: newTours })
    }

    const addTour = () => {
        const newTour = {
            id: `new- tour - ${Date.now()} `,
            title: 'New Tour Package',
            duration: '3 Days',
            price: '$0',
            image: '/images/hero/main.jpg',
            category: 'General',
            rating: 5.0,
            reviews: 0,
            description: 'Description goes here.',
            slug: `new- tour - ${Date.now()} `,
            highlights: ['Highlight 1'],
            itinerary: []
        }
        setContent({ ...content, tours: [...content.tours, newTour] })
    }

    const deleteTour = (index: number) => {
        if (!confirm('Are you sure you want to delete this tour?')) return
        const newTours = content.tours.filter((_: any, i: number) => i !== index)
        setContent({ ...content, tours: newTours })
    }

    const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return
        setUploadingId(index)
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
                updateTour(index, 'image', data.path)
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

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif">Manage Tours</h2>
                <button onClick={addTour} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                    <Plus className="h-4 w-4" /> Add New Package
                </button>
            </div>

            {content.tours.map((tour: any, index: number) => (
                <div key={index} className="border border-slate-200 rounded-lg p-6 bg-slate-50 relative group">
                    <button
                        onClick={() => deleteTour(index)}
                        className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100"
                        title="Delete Tour"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                        {/* Image Uploader */}
                        <div className="md:col-span-4 space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Cover Image</label>
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 border border-slate-300 group/image">
                                <Image src={tour.image} alt={tour.title} fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                                    <label className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2">
                                        {uploadingId === index ? <Loader2 className="animate-spin h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                                        Change Photo
                                        <input type="file" className="hidden text-slate-900" accept="image/*" onChange={(e) => handleImageUpload(index, e)} />
                                    </label>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500">Recommended: 800x600px</p>
                        </div>

                        {/* Fields */}
                        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={tour.title}
                                    onChange={(e) => updateTour(index, 'title', e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                                <input
                                    type="text"
                                    value={tour.slug}
                                    onChange={(e) => updateTour(index, 'slug', e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-mono bg-slate-100 text-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                                <input
                                    type="text"
                                    value={tour.price}
                                    onChange={(e) => updateTour(index, 'price', e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={tour.description}
                                    onChange={(e) => updateTour(index, 'description', e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 text-sm h-24 focus:ring-2 focus:ring-emerald-500 outline-none resize-none text-slate-900"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}


function DestinationsEditor({ content, setContent }: any) {
    const [uploadingId, setUploadingId] = useState<number | null>(null)

    const updateDest = (index: number, field: string, value: any) => {
        const newDests = [...content.destinations]
        newDests[index] = { ...newDests[index], [field]: value }
        setContent({ ...content, destinations: newDests })
    }

    const addDest = () => {
        const newDest = {
            id: `dest - ${Date.now()} `,
            name: 'New Destination',
            description: 'Description goes here.',
            image: '/images/hero/main.jpg',
            slug: `new- dest - ${Date.now()} `,
            highlights: ['Highlight 1'],
            attractions: [],
            category: 'General',
            map: { x: 50, y: 50, lat: 7.8731, lng: 80.7718 }
        }
        setContent({ ...content, destinations: [...content.destinations, newDest] })
    }

    const deleteDest = (index: number) => {
        if (!confirm('Are you sure you want to delete this destination?')) return
        const newDests = content.destinations.filter((_: any, i: number) => i !== index)
        setContent({ ...content, destinations: newDests })
    }

    const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return
        setUploadingId(index)
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'destinations')

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (data.success) {
                updateDest(index, 'image', data.path)
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

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif">Manage Destinations</h2>
                <button onClick={addDest} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                    <Plus className="h-4 w-4" /> Add New Destination
                </button>
            </div>

            {content.destinations.map((dest: any, index: number) => (
                <div key={index} className="border border-slate-200 rounded-lg p-6 bg-slate-50 relative group">
                    <button
                        onClick={() => deleteDest(index)}
                        className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100"
                        title="Delete Destination"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                        {/* Image Uploader */}
                        <div className="md:col-span-4 space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Cover Image</label>
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 border border-slate-300 group/image">
                                <Image src={dest.image} alt={dest.name} fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                                    <label className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2">
                                        {uploadingId === index ? <Loader2 className="animate-spin h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                                        Change Photo
                                        <input type="file" className="hidden text-slate-900" accept="image/*" onChange={(e) => handleImageUpload(index, e)} />
                                    </label>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500">Recommended: 800x600px</p>
                        </div>

                        <div className="md:col-span-8 grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={dest.name}
                                        onChange={(e) => updateDest(index, 'name', e.target.value)}
                                        className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <select
                                        value={dest.category || 'General'}
                                        onChange={(e) => updateDest(index, 'category', e.target.value)}
                                        className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                    >
                                        <option value="General">General</option>
                                        {content.categories?.map((cat: string) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Map Position
                                </label>

                                {/* Leaflet Coordinates */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-xs font-bold text-emerald-700">Latitude (Lat)</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={dest.map?.lat || ''}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value)
                                                updateDest(index, 'map', { ...dest.map, lat: isNaN(val) ? 0 : val })
                                            }}
                                            className="w-full border border-emerald-300 rounded-md p-2 text-sm text-slate-900 bg-emerald-50"
                                            placeholder="e.g. 6.9271"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-emerald-700">Longitude (Lng)</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={dest.map?.lng || ''}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value)
                                                updateDest(index, 'map', { ...dest.map, lng: isNaN(val) ? 0 : val })
                                            }}
                                            className="w-full border border-emerald-300 rounded-md p-2 text-sm text-slate-900 bg-emerald-50"
                                            placeholder="e.g. 79.8612"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 my-4 pt-2">
                                    <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Legacy Coordinates (Static Map)</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-500">X (%)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={dest.map?.x ?? 50}
                                                onChange={(e) => updateDest(index, 'map', { ...dest.map, x: parseInt(e.target.value) })}
                                                className="w-full border border-slate-300 rounded-md p-2 text-sm text-slate-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500">Y (%)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={dest.map?.y ?? 50}
                                                onChange={(e) => updateDest(index, 'map', { ...dest.map, y: parseInt(e.target.value) })}
                                                className="w-full border border-slate-300 rounded-md p-2 text-sm text-slate-900"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                value={dest.slug}
                                onChange={(e) => updateDest(index, 'slug', e.target.value)}
                                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-mono bg-slate-100 text-slate-900"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={dest.description}
                            onChange={(e) => updateDest(index, 'description', e.target.value)}
                            className="w-full border border-slate-300 rounded-md p-2 text-sm h-48 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                        />
                    </div>
                </div>
            ))
            }
        </div >
    )
}

function FleetEditor({ content, setContent }: any) {
    const [uploadingId, setUploadingId] = useState<number | null>(null)

    const updateVehicle = (index: number, field: string, value: any) => {
        const newFleet = [...(content.fleet || [])]
        newFleet[index] = { ...newFleet[index], [field]: value }
        setContent({ ...content, fleet: newFleet })
    }

    const addVehicle = () => {
        const newVehicle = {
            id: `vehicle - ${Date.now()} `,
            name: 'New Vehicle',
            type: 'Car',
            passengers: 4,
            price: 50,
            image: '/images/hero/main.jpg'
        }
        setContent({ ...content, fleet: [...(content.fleet || []), newVehicle] })
    }

    const deleteVehicle = (index: number) => {
        if (!confirm('Delete this vehicle?')) return
        const newFleet = content.fleet.filter((_: any, i: number) => i !== index)
        setContent({ ...content, fleet: newFleet })
    }

    const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return
        setUploadingId(index)
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'fleet')

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (data.success) {
                updateVehicle(index, 'image', data.path)
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

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif">Manage Fleet</h2>
                <button onClick={addVehicle} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                    <Plus className="h-4 w-4" /> Add Vehicle
                </button>
            </div>

            {(content.fleet || []).map((vehicle: any, index: number) => (
                <div key={index} className="border border-slate-200 rounded-lg p-6 bg-slate-50 relative group">
                    <button
                        onClick={() => deleteVehicle(index)}
                        className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100"
                        title="Delete Vehicle"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Image */}
                        <div className="md:col-span-4 space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Vehicle Image</label>
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 border border-slate-300 group/image">
                                <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                                    <label className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2">
                                        {uploadingId === index ? <Loader2 className="animate-spin h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                                        Change Photo
                                        <input type="file" className="hidden text-slate-900" accept="image/*" onChange={(e) => handleImageUpload(index, e)} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="md:col-span-8 grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Name</label>
                                <input
                                    type="text"
                                    value={vehicle.name}
                                    onChange={(e) => updateVehicle(index, 'name', e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                <select
                                    value={vehicle.type}
                                    onChange={(e) => updateVehicle(index, 'type', e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                >
                                    <option value="Car">Car</option>
                                    <option value="Van">Van</option>
                                    <option value="Bus">Bus</option>
                                    <option value="TukTuk">TukTuk</option>
                                    <option value="Jeep">Jeep</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Max Passengers</label>
                                <input
                                    type="number"
                                    value={vehicle.passengers}
                                    onChange={(e) => updateVehicle(index, 'passengers', parseInt(e.target.value))}
                                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Price per day with driver ($)</label>
                                <input
                                    type="number"
                                    value={vehicle.price}
                                    onChange={(e) => updateVehicle(index, 'price', parseInt(e.target.value))}
                                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Additional KM rate ($/km)</label>
                                <input
                                    type="number"
                                    value={vehicle.additionalKmRate || 0}
                                    onChange={(e) => updateVehicle(index, 'additionalKmRate', parseInt(e.target.value))}
                                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                />
                                <p className="text-xs text-slate-500 mt-2 bg-slate-100 p-3 rounded-md border border-slate-200">
                                    <span className="font-bold">Note:</span> Price includes a maximum of 150 KM per day. <br />
                                    <span className="italic">Example:</span> If you book a 10 days travel, you can travel 150 x 10 = 1500 km without additional fee. If 1500km is exceeded by the end of the tour, only then is this additional KM rate applied.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
