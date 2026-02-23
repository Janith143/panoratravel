import { Metadata } from 'next'
import { Droplets, MapPin, ArrowUpDown } from 'lucide-react'
import { getWaterfalls, getDistrictName } from '@/lib/content'

export const metadata: Metadata = {
    title: 'Waterfalls of Sri Lanka | Complete Guide | Panora Travels',
    description: 'Discover the most spectacular waterfalls in Sri Lanka, from the tallest Bambarakanda Falls to the scenic Diyaluma with natural infinity pools.',
}

export default function WaterfallsPage() {
    const waterfalls = getWaterfalls()
    // Sort by height descending
    const sortedWaterfalls = [...waterfalls].sort((a, b) => b.height - a.height)

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Hero */}
            <div className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/40" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546587348-d12660c30c50?q=80&w=2674&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                <div className="container max-w-7xl px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full text-blue-200 mb-6">
                        <Droplets className="w-5 h-5" />
                        Natural Wonders
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Waterfalls of Sri Lanka</h1>
                    <p className="text-slate-200 max-w-2xl mx-auto text-lg">
                        From the 263-meter Bambarakanda to hidden cascades in tea country, explore the island&apos;s most spectacular waterfalls.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container max-w-5xl px-4 py-12">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl font-bold text-emerald-600">{waterfalls.length}</div>
                        <div className="text-slate-600 text-sm">Major Waterfalls</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl font-bold text-emerald-600">263m</div>
                        <div className="text-slate-600 text-sm">Tallest (Bambarakanda)</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-3xl font-bold text-emerald-600">5</div>
                        <div className="text-slate-600 text-sm">Districts Covered</div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-4 font-semibold text-slate-700">
                                        <span className="flex items-center gap-2">
                                            Rank
                                        </span>
                                    </th>
                                    <th className="text-left px-6 py-4 font-semibold text-slate-700">Waterfall</th>
                                    <th className="text-left px-6 py-4 font-semibold text-slate-700">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            District
                                        </span>
                                    </th>
                                    <th className="text-left px-6 py-4 font-semibold text-slate-700">
                                        <span className="flex items-center gap-1">
                                            <ArrowUpDown className="w-4 h-4" />
                                            Height
                                        </span>
                                    </th>
                                    <th className="text-left px-6 py-4 font-semibold text-slate-700">Notable Feature</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {sortedWaterfalls.map((waterfall, index) => (
                                    <tr key={waterfall.name} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                index === 1 ? 'bg-slate-200 text-slate-700' :
                                                    index === 2 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-slate-100 text-slate-600'
                                                }`}>
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{waterfall.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{getDistrictName(waterfall.district)}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                                {waterfall.height}m
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{waterfall.feature}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="mt-12 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-8">
                    <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Visiting Tips</h2>
                    <ul className="space-y-3 text-slate-700">
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">1</span>
                            <span><strong>Best Time:</strong> Visit during or after monsoon (April-September for southwest, October-January for northeast) for fullest water flow.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</span>
                            <span><strong>Diyaluma:</strong> The upper pools are a challenging hike but reward with natural infinity pools overlooking the cascade.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</span>
                            <span><strong>Safety:</strong> Rocks near waterfalls are slippery. Always wear sturdy footwear and avoid swimming in strong currents.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
