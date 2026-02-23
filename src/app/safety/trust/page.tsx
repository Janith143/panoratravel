'use client'

import { Shield, AlertTriangle, Calculator, Map, Phone, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function TrustPage() {
    const [scamCalculator, setScamCalculator] = useState({ km: 5, fairPrice: 0 })

    const calculateTukTuk = (e: React.ChangeEvent<HTMLInputElement>) => {
        const km = parseFloat(e.target.value) || 0
        // Base rate ~100 LKR + 100 LKR per km (Approx)
        const price = 100 + (km * 120)
        setScamCalculator({ km, fairPrice: price })
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full font-bold text-sm mb-4">
                        <Shield className="h-4 w-4" /> Official Safety Hub
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Travel Safe, Travel Smart</h1>
                    <p className="text-slate-600 text-lg">
                        Sri Lanka is incredibly safe, but like any destination, it helps to be informed.
                        Use our tools to navigate confidently.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Tool 1: Tuk Tuk Calculator */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
                                <Calculator className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Tuk-Tuk Price Estimator</h2>
                                <p className="text-sm text-slate-500">Don't get overcharged.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Distance (KM)</label>
                                <input
                                    type="number"
                                    value={scamCalculator.km}
                                    onChange={calculateTukTuk}
                                    className="w-full text-lg p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                                />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                <p className="text-sm text-slate-500 mb-1">Estimated Fair Price</p>
                                <p className="text-3xl font-bold text-emerald-600">
                                    {scamCalculator.fairPrice.toLocaleString()} LKR
                                </p>
                                <p className="text-xs text-slate-400 mt-2">
                                    (~${(scamCalculator.fairPrice / 300).toFixed(2)} USD)
                                </p>
                            </div>

                            <div className="text-xs text-slate-500 bg-amber-50 p-3 rounded-lg flex gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                                Always agree on the price BEFORE getting in, or insist on using a meter (Uber/PickMe).
                            </div>
                        </div>
                    </div>

                    {/* Tool 2: Scam Alerts */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-red-100 p-3 rounded-xl text-red-600">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Common Tourist Scams</h2>
                                <p className="text-sm text-slate-500">Be aware of these tricks.</p>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                            <ScamItem
                                title="The 'Closed' Attraction"
                                desc="A driver may tell you a temple or hotel is 'closed' to take you elsewhere. Always verify yourself."
                            />
                            <ScamItem
                                title="Spice Garden Pressure"
                                desc="Free entry often means high-pressure sales for overpriced herbal products. You are never obligated to buy."
                            />
                            <ScamItem
                                title="Fake Gem Dealers"
                                desc="Only buy gems from government-certified dealers with a certificate of authenticity."
                            />
                        </div>
                    </div>
                </div>

                {/* Emergency Contacts */}
                <div className="mt-12 bg-slate-900 text-white rounded-2xl p-8 max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-4 rounded-full">
                            <Phone className="h-8 w-8 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">24/7 Tourist Police</h3>
                            <p className="text-slate-400">We are always just a call away.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <a href="tel:1912" className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition">
                            Call 1912 (Tourist Police)
                        </a>
                        <a href="tel:+94770000000" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition">
                            Call Panora Support
                        </a>
                    </div>
                </div>

            </div>
        </div>
    )
}

function ScamItem({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex gap-3 items-start p-3 hover:bg-slate-50 rounded-lg transition">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
                <h4 className="font-bold text-slate-800">{title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
