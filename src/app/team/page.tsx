import Image from 'next/image'
import { CheckCircle, Award, Star, Video } from 'lucide-react'

// Mock Data
const GUIDES = [
    { name: 'Wasantha Pradeep', role: 'Senior Chauffeur Guide', exp: '15 Years', badges: ['National License', 'First Aid'], image: '/images/hero/main.jpg' },
    { name: 'Nalin Perera', role: 'Wildlife Specialist', exp: '8 Years', badges: ['Yala Certified', 'Birdwatching Pro'], image: '/images/hero/main.jpg' },
    { name: 'Kamal De Silva', role: 'Cultural Expert', exp: '12 Years', badges: ['Archaeology Degree', 'English Fluent'], image: '/images/hero/main.jpg' },
]

export default function TeamPage() {
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/20" />
                <div className="container max-w-7xl px-4 md:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Meet Your Guides</h1>
                    <p className="text-slate-200 max-w-2xl mx-auto text-lg pt-2">
                        The people who make your journey unforgettable. Verified, trained, and trusted.
                    </p>
                </div>
            </div>

            <div className="container max-w-7xl px-4 md:px-8 py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    {GUIDES.map((guide, i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm group hover:shadow-lg transition-shadow">
                            {/* Video Placeholder */}
                            <div className="aspect-[4/5] bg-slate-200 relative">
                                <Image src={guide.image} alt={guide.name} fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
                                    <button className="bg-white/90 text-slate-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300">
                                        <Video className="h-5 w-5" /> Watch Intro
                                    </button>
                                </div>
                                <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg" title="Verified Profile">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900">{guide.name}</h3>
                                <p className="text-emerald-600 font-medium mb-4">{guide.role} • {guide.exp}</p>

                                <div className="flex flex-wrap gap-2">
                                    {guide.badges.map(b => (
                                        <span key={b} className="text-xs font-bold px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-600 flex items-center gap-1">
                                            <Award className="h-3 w-3 text-amber-500" /> {b}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
