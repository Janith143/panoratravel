import { Metadata } from 'next'
import { Award, Heart, Globe, UserCheck } from 'lucide-react'
import { IMAGES } from '@/lib/images'

export const metadata: Metadata = {
    title: 'About Panora Travels | Our Story',
    description: 'Learn about Panora Travels, a premier travel agency in Sri Lanka. Our mission is to provide authentic, sustainable, and luxury travel experiences.',
}

export default function AboutPage() {
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Hero */}
            <div className="bg-slate-900 text-white py-20 md:py-32 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${IMAGES.hero.about}')` }}
                />
                <div className="container max-w-4xl px-4 relative z-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">We Are Panora Travels</h1>
                    <p className="text-slate-200 text-lg md:text-xl leading-relaxed">
                        Born from a passion for our island home, we are dedicated to sharing the magic of Sri Lanka with the world. Authentic, ethical, and unforgettable.
                    </p>
                </div>
            </div>

            <div className="container max-w-7xl px-4 md:px-8 py-16 mx-auto">
                {/* Mission */}
                <div className="prose prose-lg text-slate-600 mx-auto mb-20 md:text-center max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-8">Our Journey</h2>
                    <p>
                        Panora Travels began with a simple idea: that travel should be more than just sightseeing. It should be an immersion into the soul of a destination.
                        Founded by a team of experienced local guides, we wanted to bridge the gap between typical tourist trails and the real, hidden Sri Lanka.
                    </p>
                    <p>
                        Today, we are proud to be one of the leading boutique travel agencies in the island, serving travelers from across the globe who seek luxury without pretension and adventure with comfort.
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-lg transition-all duration-300">
                        <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                            <Heart className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Passion for Hospitality</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Treating every guest like family is the heart of Sri Lankan culture, and it's the core of our service.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-lg transition-all duration-300">
                        <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                            <Award className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Excellence Standards</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">From our vehicles to our hotels, we only partner with the best to ensure a premium experience.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-lg transition-all duration-300">
                        <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                            <Globe className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Sustainable Travel</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">We are committed to preserving our natural heritage and supporting local communities.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-lg transition-all duration-300">
                        <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                            <UserCheck className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Guidance</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Our guides are licensed professionals who bring history and culture to life.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
