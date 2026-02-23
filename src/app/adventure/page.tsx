import { Metadata } from 'next'
import Link from 'next/link'
import { Mountain, Waves, Wind, Anchor, Footprints, Calendar, MapPin } from 'lucide-react'
import { getAdventureHubs, getDistrictName } from '@/lib/content'

export const metadata: Metadata = {
    title: 'Adventure Activities in Sri Lanka | Surfing, Rafting, Hiking | Panora Travels',
    description: 'Plan your adventure in Sri Lanka - surfing in Arugam Bay, white water rafting in Kitulgala, kitesurfing in Kalpitiya, and more.',
}

const activityIcons: { [key: string]: React.ReactNode } = {
    'Surfing (Pro)': <Waves className="w-5 h-5" />,
    'Surfing (Beginner)': <Waves className="w-5 h-5" />,
    'Kitesurfing': <Wind className="w-5 h-5" />,
    'White Water Rafting': <Anchor className="w-5 h-5" />,
    'Hiking/Trekking': <Footprints className="w-5 h-5" />,
    'Whale Watching': <Waves className="w-5 h-5" />,
    'Wreck Diving': <Anchor className="w-5 h-5" />
}

const activityColors: { [key: string]: { bg: string; text: string; border: string } } = {
    'Surfing (Pro)': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Surfing (Beginner)': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
    'Kitesurfing': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    'White Water Rafting': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    'Hiking/Trekking': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Whale Watching': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Wreck Diving': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' }
}

export default function AdventurePage() {
    const adventures = getAdventureHubs()

    // Group by activity type
    const groupedActivities: { [key: string]: typeof adventures } = {}
    adventures.forEach(adv => {
        const key = adv.activity.includes('Surfing') ? 'Surfing' :
            adv.activity.includes('Whale') ? 'Marine Wildlife' : adv.activity
        if (!groupedActivities[key]) groupedActivities[key] = []
        groupedActivities[key].push(adv)
    })

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Hero */}
            <div className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-orange-900/40" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                <div className="container max-w-7xl px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full text-orange-200 mb-6">
                        <Mountain className="w-5 h-5" />
                        Adrenaline Rush
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Adventure Activities</h1>
                    <p className="text-slate-200 max-w-2xl mx-auto text-lg">
                        From world-class surfing to white water rafting, Sri Lanka offers year-round adventure for thrill seekers.
                    </p>
                </div>
            </div>

            {/* Activity Cards */}
            <div className="container max-w-7xl px-4 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adventures.map((adv, index) => {
                        const colors = activityColors[adv.activity] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' }
                        return (
                            <div
                                key={index}
                                className={`${colors.bg} border ${colors.border} rounded-xl p-6 hover:shadow-lg transition-shadow`}
                            >
                                <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mb-4 border ${colors.border}`}>
                                    <span className={colors.text}>
                                        {activityIcons[adv.activity] || <Mountain className="w-5 h-5" />}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{adv.activity}</h3>
                                <p className={`text-lg ${colors.text} font-medium mb-3`}>{adv.location}</p>
                                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {getDistrictName(adv.district)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {adv.season}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Featured Adventures */}
            <div className="bg-white py-16">
                <div className="container max-w-7xl px-4">
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8 text-center">Featured Experiences</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Surfing */}
                        <div className="relative group">
                            <div className="h-80 rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-400" />
                                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                    <Waves className="w-10 h-10 mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">Surf Sri Lanka</h3>
                                    <p className="text-white/90 text-sm">From beginner-friendly Weligama to world-class Arugam Bay point breaks.</p>
                                    <div className="mt-4 text-xs bg-white/20 px-3 py-1 rounded-full w-fit">
                                        Nov-Apr (West) • May-Sept (East)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rafting */}
                        <div className="relative group">
                            <div className="h-80 rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-amber-400" />
                                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                    <Anchor className="w-10 h-10 mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">White Water Rafting</h3>
                                    <p className="text-white/90 text-sm">Grade 2-4 rapids on the Kelani River in Kitulgala - where "Bridge on River Kwai" was filmed.</p>
                                    <div className="mt-4 text-xs bg-white/20 px-3 py-1 rounded-full w-fit">
                                        Year-round
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hiking */}
                        <div className="relative group">
                            <div className="h-80 rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-400" />
                                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                    <Footprints className="w-10 h-10 mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">Trekking & Hiking</h3>
                                    <p className="text-white/90 text-sm">From Ella Rock to the Knuckles Range - trails for all fitness levels.</p>
                                    <div className="mt-4 text-xs bg-white/20 px-3 py-1 rounded-full w-fit">
                                        Jan-Mar (Best)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="container max-w-5xl px-4 py-16">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl font-serif font-bold mb-4">Ready for Adventure?</h2>
                    <p className="text-white/90 mb-6 max-w-xl mx-auto">
                        Let us design your custom adventure itinerary with expert guides and all safety equipment included.
                    </p>
                    <Link href="/contact" className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                        Plan Your Adventure
                    </Link>
                </div>
            </div>
        </div>
    )
}
