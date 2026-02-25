'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'
import { getPosts } from '@/lib/content'

// Fetch posts dynamically
const postsData = getPosts()

// Derive categories from the actual posts
const categories = ['All', ...Array.from(new Set(postsData.map(post => post.category)))]

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState('All')

    const filteredPosts = selectedCategory === 'All'
        ? postsData
        : postsData.filter(post => post.category === selectedCategory)

    const featuredPost = filteredPosts[0]
    const gridPosts = filteredPosts.slice(1)

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-slate-900 text-white py-16 md:py-24 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-amber-900/30" />
                <div className="container max-w-4xl px-4 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Travel Blog & Guides</h1>
                    <p className="text-slate-300 text-lg">Expert tips, destination guides, and inspiration for your Sri Lanka adventure.</p>
                </div>
            </div>

            <div className="container max-w-7xl px-4 py-12 md:py-16">
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-12 justify-center">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {filteredPosts.length > 0 ? (
                    <>
                        {/* Featured Post */}
                        {featuredPost && (
                            <div className="mb-12">
                                <Link href={`/blog/${featuredPost.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all">
                                    <div className="grid md:grid-cols-2">
                                        <div className="relative h-64 md:h-auto overflow-hidden">
                                            <Image
                                                src={featuredPost.image}
                                                alt={featuredPost.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-8 md:p-12 flex flex-col justify-center">
                                            <span className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium mb-3">
                                                <Tag className="h-4 w-4" /> {featuredPost.category}
                                            </span>
                                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                                                {featuredPost.title}
                                            </h2>
                                            <p className="text-slate-600 mb-6 line-clamp-2">{featuredPost.excerpt}</p>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {featuredPost.readTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Post Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {gridPosts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all flex flex-col">
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <span className="text-emerald-600 text-xs font-medium uppercase tracking-wider mb-2">{post.category}</span>
                                        <h3 className="font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">{post.excerpt}</p>
                                        <div className="flex items-center justify-between text-xs text-slate-400">
                                            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            <span>{post.readTime}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <p>No articles found in {selectedCategory}.</p>
                    </div>
                )}

                {/* Newsletter CTA */}
                <div className="mt-16 bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-8 md:p-12 text-center text-white">
                    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">Get Travel Inspiration</h3>
                    <p className="text-emerald-100 mb-6 max-w-xl mx-auto">Subscribe to our newsletter for exclusive travel tips, destination guides, and special offers.</p>
                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                        <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-full font-bold transition-colors">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
