import { Metadata } from 'next'
import Link from 'next/link'
import { PawPrint, Calendar, MapPin, Camera, Binoculars } from 'lucide-react'
import { getNationalParks, getDistrictName } from '@/lib/content'

export const metadata: Metadata = {
    title: 'National Parks & Safari Guide | Sri Lanka | Panora Travels',
    description: 'Complete guide to Sri Lanka\'s national parks. Plan your wildlife safari with seasonal tips, wildlife spotting guides, and park information.',
}

export default function NationalParksPage() {
    const parks = getNationalParks()

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Hero */}
            <div className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-900/40" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2668&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                <div className="container max-w-7xl px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full text-amber-200 mb-6">
                        <PawPrint className="w-5 h-5" />
                        Wildlife Safari
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">National Parks of Sri Lanka</h1>
                    <p className="text-slate-200 max-w-2xl mx-auto text-lg">
                        From leopard safaris in Yala to elephant gatherings in Minneriya, experience Sri Lanka&apos;s incredible wildlife diversity.
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="container max-w-5xl px-4 -mt-8 relative z-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <div className="text-3xl font-bold text-amber-600">{parks.length}</div>
                        <div className="text-slate-600 text-sm">Major Parks</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <div className="text-3xl font-bold text-amber-600">Leopards</div>
                        <div className="text-slate-600 text-sm">Highest Density</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <div className="text-3xl font-bold text-amber-600">300+</div>
                        <div className="text-slate-600 text-sm">Elephants in Gathering</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <div className="text-3xl font-bold text-amber-600">Year-round</div>
                        <div className="text-slate-600 text-sm">Safari Available</div>
                    </div>
                </div>
            </div>

            {/* Parks Grid */}
            <div className="container max-w-7xl px-4 py-16">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8">All National Parks</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parks.map((park) => (
                        <div key={park.name} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-48 bg-gradient-to-br from-amber-100 to-emerald-100 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <PawPrint className="w-16 h-16 text-amber-300" />
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{park.name}</h3>

                                <div className="flex items-center gap-2 text-slate-600 text-sm mb-3">
                                    <MapPin className="w-4 h-4" />
                                    {park.districts.map(d => getDistrictName(d)).join(', ')}
                                </div>

                                <div className="flex items-center gap-2 text-emerald-600 text-sm mb-4">
                                    <Calendar className="w-4 h-4" />
                                    Best: {park.bestSeason}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="text-xs text-slate-500 uppercase mb-2">Key Wildlife</div>
                                    <div className="flex flex-wrap gap-2">
                                        {park.wildlife.map((animal) => (
                                            <span key={animal} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs">
                                                {animal}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Safari Tips */}
            <div className="bg-amber-50 py-16">
                <div className="container max-w-5xl px-4">
                    <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8 text-center">Safari Planning Tips</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <Camera className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Best Time for Photos</h3>
                            <p className="text-slate-600 text-sm">Early morning (6-9am) and late afternoon (3-6pm) offer the best light and active wildlife.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                <Binoculars className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">The Gathering</h3>
                            <p className="text-slate-600 text-sm">July-October at Minneriya or Kaudulla to witness 300+ elephants congregating - one of Asia&apos;s greatest wildlife spectacles.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <PawPrint className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Leopard Spotting</h3>
                            <p className="text-slate-600 text-sm">Yala Block 1 has the world&apos;s highest leopard density. February-July is ideal when water is scarce.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="container max-w-5xl px-4 py-16">
                <div className="bg-gradient-to-r from-amber-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl font-serif font-bold mb-4">Ready for Your Safari Adventure?</h2>
                    <p className="text-white/90 mb-6 max-w-xl mx-auto">
                        Let us plan your perfect wildlife safari with expert naturalist guides and comfortable accommodations.
                    </p>
                    <Link href="/contact" className="inline-block bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors">
                        Plan Your Safari
                    </Link>
                </div>
            </div>
        </div>
    )
}
