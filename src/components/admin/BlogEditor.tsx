'use client'

import { useState } from 'react'
import { Plus, Trash2, Image as ImageIcon, Loader2, Link as LinkIcon, Calendar } from 'lucide-react'
import Image from 'next/image'
import { BlogPost } from '@/lib/content'

interface BlogEditorProps {
    content: BlogPost[]
    setContent: (content: BlogPost[]) => void
}

export default function BlogEditor({ content, setContent }: BlogEditorProps) {
    const [uploadingId, setUploadingId] = useState<number | null>(null)

    const addPost = () => {
        const newPost: BlogPost = {
            id: Date.now(),
            slug: `new-post-${Date.now()}`,
            title: 'New Blog Post',
            excerpt: 'Write a catchy excerpt here...',
            image: '/images/hero/main.jpg',
            category: 'Travel Tips',
            date: new Date().toISOString().split('T')[0],
            readTime: '5 min read'
        }
        setContent([newPost, ...content])
    }

    const removePost = (index: number) => {
        if (!confirm('Delete this post?')) return
        const newContent = [...content]
        newContent.splice(index, 1)
        setContent(newContent)
    }

    const updatePost = (index: number, field: keyof BlogPost, value: any) => {
        const newContent = [...content]
        newContent[index] = { ...newContent[index], [field]: value }
        setContent(newContent)
    }

    const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return
        setUploadingId(index)
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'blog')

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (data.success) {
                updatePost(index, 'image', data.path)
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

    const categories = ['Travel Tips', 'Destinations', 'Culture', 'Wildlife', 'Transport', 'Food']

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif text-slate-800">Manage Blog Posts</h2>
                <button onClick={addPost} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                    <Plus className="h-4 w-4" /> New Post
                </button>
            </div>

            <div className="grid gap-6">
                {content.map((post, index) => (
                    <div key={post.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
                        <button
                            onClick={() => removePost(index)}
                            className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100 z-10"
                            title="Delete Post"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Image Column */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Featured Image</label>
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group/image">
                                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                                        <label className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2">
                                            {uploadingId === index ? <Loader2 className="animate-spin h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                                            Change
                                            <input type="file" className="hidden text-slate-900" accept="image/*" onChange={(e) => handleImageUpload(index, e)} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Content Column */}
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={post.title}
                                        onChange={(e) => updatePost(index, 'title', e.target.value)}
                                        className="w-full border border-slate-300 rounded-md p-2 font-serif font-bold text-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                        <select
                                            value={post.category}
                                            onChange={(e) => updatePost(index, 'category', e.target.value)}
                                            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                        >
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                            <input
                                                type="date"
                                                value={post.date}
                                                onChange={(e) => updatePost(index, 'date', e.target.value)}
                                                className="w-full border border-slate-300 rounded-md p-2 pl-9 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={post.slug}
                                            onChange={(e) => updatePost(index, 'slug', e.target.value)}
                                            className="w-full border border-slate-300 rounded-md p-2 pl-9 text-sm font-mono text-slate-600 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
                                    <textarea
                                        value={post.excerpt}
                                        onChange={(e) => updatePost(index, 'excerpt', e.target.value)}
                                        className="w-full border border-slate-300 rounded-md p-2 text-sm h-24 resize-none focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
