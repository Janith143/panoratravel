'use client'

// ... imports
import { Award } from 'lucide-react'

const certifications = [
    { name: 'SLTDA Licensed', image: '/images/badges/sltda.png' },
    { name: 'TripAdvisor Excellence', image: '/images/badges/tripadvisor.png' },
    { name: 'SafeTravels', image: '/images/badges/safetravels.png' }
]

export default function TrustBadges() {
    return (
        <section className="py-16 bg-white">
            <div className="container max-w-7xl px-4">
                {/* Certifications */}
                <div className="border-t border-slate-100 pt-12">
                    <p className="text-center text-slate-400 uppercase tracking-wider text-sm font-medium mb-8">
                        Trusted & Certified
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {/* SLTDA Badge */}
                        <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                SLTDA
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-sm">Licensed Operator</p>
                                <p className="text-xs text-slate-500">Sri Lanka Tourism</p>
                            </div>
                        </div>

                        {/* TripAdvisor */}
                        <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                                <Award className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-sm">Excellent Rating</p>
                                <p className="text-xs text-slate-500">TripAdvisor 2024</p>
                            </div>
                        </div>

                        {/* Safe Travels */}
                        <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                SAFE
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-sm">Safe Travels</p>
                                <p className="text-xs text-slate-500">WTTC Verified</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
