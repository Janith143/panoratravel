import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react'
import { getPostBySlug } from '@/lib/content'
import fs from 'fs'
import path from 'path'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Fetch the markdown content dynamically
async function getMarkdownContent(slug: string) {
    try {
        // Map slug to filename.
        const slugMap: Record<string, string> = {
            'best-time-to-visit-sri-lanka': '1_best_time.md',
            'hidden-gems-sri-lanka': '2_hidden_gems.md',
            'sri-lanka-packing-list': '3_packing_list.md',
            'sri-lanka-food-guide': '4_food_guide.md',
            'train-ella-kandy': '5_train_guide.md',
            'wildlife-safari-tips': '6_safari.md'
        }

        const filename = slugMap[slug]

        if (!filename) return null

        const filePath = path.join(process.cwd(), 'src', 'data', 'blog', filename)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        return fileContent
    } catch (error) {
        console.error("Failed to load markdown for slug:", slug, error)
        return null
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        notFound()
    }

    const markdownContent = await getMarkdownContent(slug)

    return (
        <article className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Image Header */}
            <div className="relative h-[60vh] min-h-[400px] w-full bg-slate-900">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                <div className="absolute bottom-0 inset-x-0 container max-w-4xl px-4 pb-12">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-slate-300 hover:text-white mb-8 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog
                    </Link>

                    <div className="flex items-center gap-3 text-emerald-400 font-medium mb-4">
                        <Tag className="w-5 h-5" />
                        <span className="uppercase tracking-wider text-sm">{post.category}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container max-w-4xl px-4 mt-[-40px] relative z-10 mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 lg:p-16 border border-slate-100">

                    {/* Excerpt Lead */}
                    <p className="text-xl md:text-2xl text-slate-600 font-serif italic leading-relaxed mb-12 border-l-4 border-emerald-500 pl-6">
                        {post.excerpt}
                    </p>

                    {/* Markdown Body */}
                    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-img:rounded-xl">
                        {markdownContent ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {markdownContent}
                            </ReactMarkdown>
                        ) : (
                            <p className="text-slate-500 text-center py-10">We are currently updating this article. Please check back soon!</p>
                        )}
                    </div>

                    {/* Footer Share/CTA */}
                    <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <span className="font-medium text-slate-900">Share this post:</span>
                            {/* Simple social links could go here */}
                            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-100 hover:text-emerald-600 transition-colors">f</button>
                            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-100 hover:text-emerald-600 transition-colors">t</button>
                        </div>

                        <Link
                            href="/planner"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg shadow-emerald-600/20"
                        >
                            Start Planning Your Trip
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}
