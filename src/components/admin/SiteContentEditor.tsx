'use client'

import { useState } from 'react'
import { Save, Plus, Trash2, MapPin, Globe, Loader2, Phone, Mail } from 'lucide-react'
import { SiteConfig } from '@/lib/content'

interface SiteContentEditorProps {
    content: SiteConfig
    setContent: (content: SiteConfig) => void
}

export default function SiteContentEditor({ content, setContent }: SiteContentEditorProps) {
    const [isSaving, setIsSaving] = useState(false)

    const updateContact = (field: keyof SiteConfig['contact'], value: string) => {
        setContent({
            ...content,
            contact: { ...content.contact, [field]: value }
        })
    }

    const updateHeroSlide = (index: number, field: string, value: string) => {
        const newSlides = [...(content.heroSlides || [])]
        newSlides[index] = { ...newSlides[index], [field]: value }
        setContent({
            ...content,
            heroSlides: newSlides
        })
    }

    const addHeroSlide = () => {
        const newSlide = {
            id: `slide-${Date.now()}`,
            badge: "New Badge",
            title: "New Title",
            highlight: "Highlight",
            subtitle: "New Subtitle",
            subtext: "Description goes here.",
            image: "/images/hero/main.jpg"
        }
        setContent({
            ...content,
            heroSlides: [...(content.heroSlides || []), newSlide]
        })
    }

    const removeHeroSlide = (index: number) => {
        if (!confirm('Are you sure you want to remove this slide?')) return
        const newSlides = (content.heroSlides || []).filter((_: any, i: number) => i !== index)
        setContent({
            ...content,
            heroSlides: newSlides
        })
    }

    const handleHeroImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'hero')

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (data.success) {
                updateHeroSlide(index, 'image', data.path)
            } else {
                alert('Upload failed')
            }
        } catch (err) {
            console.error(err)
            alert('Upload error')
        }
    }

    const updateAbout = (field: 'footerTagline', value: string) => {
        setContent({
            ...content,
            about: { ...content.about, [field]: value }
        })
    }

    const updateLinks = (field: keyof SiteConfig['links'], value: string) => {
        setContent({
            ...content,
            links: { ...content.links, [field]: value }
        })
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif text-slate-800">Global Site Settings</h2>
            </div>

            {/* Hero Section */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-emerald-600" /> Homepage Hero Slider
                    </h3>
                    <button onClick={addHeroSlide} className="flex items-center gap-1 bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition text-sm font-medium">
                        <Plus className="h-4 w-4" /> Add Slide
                    </button>
                </div>

                {(content.heroSlides || []).map((slide: any, index: number) => (
                    <div key={slide.id || index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group space-y-4">
                        <button
                            onClick={() => removeHeroSlide(index)}
                            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition focus:opacity-100"
                            title="Remove Slide"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Image Config */}
                            <div className="md:col-span-4 space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Slide Image</label>
                                <div className="relative aspect-[3/4] md:aspect-[4/3] rounded-lg overflow-hidden bg-slate-200 border border-slate-300 group/image">
                                    <img src={slide.image} alt="Slide Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                                        <label className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2">
                                            Change Photo
                                            <input type="file" className="hidden text-slate-900" accept="image/*" onChange={(e) => handleHeroImageUpload(index, e)} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Text Config */}
                            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Badge Text</label>
                                    <input
                                        type="text"
                                        value={slide.badge}
                                        onChange={(e) => updateHeroSlide(index, 'badge', e.target.value)}
                                        className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Main Title</label>
                                    <input
                                        type="text"
                                        value={slide.title}
                                        onChange={(e) => updateHeroSlide(index, 'title', e.target.value)}
                                        className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-serif"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Highlight Word</label>
                                    <input
                                        type="text"
                                        value={slide.highlight}
                                        onChange={(e) => updateHeroSlide(index, 'highlight', e.target.value)}
                                        className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-serif italic text-emerald-600"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                                    <input
                                        type="text"
                                        value={slide.subtitle}
                                        onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                                        className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Subtext</label>
                                    <textarea
                                        value={slide.subtext}
                                        onChange={(e) => updateHeroSlide(index, 'subtext', e.target.value)}
                                        className="w-full border border-slate-300 rounded-md p-2 text-sm h-16 focus:ring-2 focus:ring-emerald-500 outline-none bg-white resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contact Info */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="tex-lg font-bold text-slate-800 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-emerald-600" /> Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                        <input
                            type="text"
                            value={content.contact.phone}
                            onChange={(e) => updateContact('phone', e.target.value)}
                            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp (Digits Only)</label>
                        <input
                            type="text"
                            value={content.contact.whatsapp}
                            onChange={(e) => updateContact('whatsapp', e.target.value)}
                            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="text"
                            value={content.contact.email}
                            onChange={(e) => updateContact('email', e.target.value)}
                            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Physical Address</label>
                        <input
                            type="text"
                            value={content.contact.address}
                            onChange={(e) => updateContact('address', e.target.value)}
                            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Tagline */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="tex-lg font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" /> Footer Details
                </h3>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Footer Tagline</label>
                    <input
                        type="text"
                        value={content.about.footerTagline}
                        onChange={(e) => updateAbout('footerTagline', e.target.value)}
                        className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="tex-lg font-bold text-slate-800 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-emerald-600" /> Social Media Links
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Facebook URL</label>
                        <input
                            type="text"
                            value={content.links.facebook}
                            onChange={(e) => updateLinks('facebook', e.target.value)}
                            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Instagram URL</label>
                        <input
                            type="text"
                            value={content.links.instagram}
                            onChange={(e) => updateLinks('instagram', e.target.value)}
                            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Twitter/X URL</label>
                        <input
                            type="text"
                            value={content.links.twitter}
                            onChange={(e) => updateLinks('twitter', e.target.value)}
                            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
