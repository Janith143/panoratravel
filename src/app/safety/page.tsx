import { Metadata } from 'next'
import TukTukCalculator from '@/components/features/TukTukCalculator'
import WeatherWidget from '@/components/features/WeatherWidget'
import { ShieldAlert, Info, Phone, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Travel Safety Hub | Scam Buster & Updates',
    description: 'Your trusted source for Sri Lanka travel safety. Real-time scam alerts, fair price calculators, and health guidelines.',
}

export default function SafetyPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What is the Spice Garden scam in Sri Lanka?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Drivers may take unwitting tourists to "free" spice gardens where they face high-pressure sales tactics to buy oils at inflated prices. Always insist on government-approved sites.'
                }
            },
            {
                '@type': 'Question',
                name: 'How do I avoid gem scams in Sri Lanka?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Scammers often claim temples are closed to divert you to gem shops. Verify opening times independently and only buy from the National Gem & Jewellery Authority certified dealers.'
                }
            }
        ]
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="bg-slate-900 text-white py-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-red-900/20" />
                <div className="container max-w-4xl px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-bold mb-4 border border-emerald-500/30">
                        <ShieldAlert className="h-4 w-4" /> Official Panora Safety Hub
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Travel S.M.A.R.T. in Sri Lanka</h1>
                    <p className="text-slate-300 text-lg">We believe in radical transparency. Here is everything you need to know to stay safe and avoid common tourist traps.</p>
                </div>
            </div>

            <div className="container max-w-6xl px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-10 relative z-20">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Scam Buster Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <AlertTriangle className="h-6 w-6 text-amber-500" /> Common Tourist Scams
                        </h2>
                        <div className="space-y-6">
                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                                <h3 className="font-bold text-slate-900 mb-2">The "Spice Garden" Trap</h3>
                                <p className="text-slate-600 text-sm">
                                    <span className="font-bold">The Scam:</span> Drivers take you to "free" spice gardens where you get a massage and are then pressured to buy oils at 10x the market price.
                                </p>
                                <p className="text-emerald-700 text-sm font-medium mt-2">
                                    <span className="font-bold">Panora Promise:</span> We strictly prohibit our drivers from unauthorized stops. You only visit government-approved sites if requested.
                                </p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                                <h3 className="font-bold text-slate-900 mb-2">The "Gem Museum" Detour</h3>
                                <p className="text-slate-600 text-sm">
                                    <span className="font-bold">The Scam:</span> "The temple is closed, let's go to a special exhibition." This is always a lie to take you to a gem shop for commission.
                                </p>
                                <p className="text-emerald-700 text-sm font-medium mt-2">
                                    <span className="font-bold">Panora Promise:</span> We take zero commissions. If you want to buy gems, we take you to the National Gem & Jewellery Authority.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Emergency Contacts */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Phone className="h-6 w-6 text-emerald-600" /> Emergency Numbers
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-900">1912</div>
                                <div className="text-xs text-slate-500 uppercase">Tourist Police</div>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-900">1990</div>
                                <div className="text-xs text-slate-500 uppercase">Ambulance</div>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-900">119</div>
                                <div className="text-xs text-slate-500 uppercase">Emergency</div>
                            </div>
                            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                                <div className="text-2xl font-bold text-emerald-700">24/7</div>
                                <div className="text-xs text-emerald-600 uppercase">Panora SOS</div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <TukTukCalculator />

                    {/* Live Weather */}
                    <div>
                        <h3 className="font-bold text-slate-900 mb-3">Current Weather</h3>
                        <WeatherWidget destination="Colombo" />
                    </div>

                    <div className="bg-sky-50 p-6 rounded-xl border border-sky-100">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Info className="h-5 w-5 text-sky-500" /> Visa & Entry
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">• <span className="flex-1">On-Arrival Visa available for most countries ($50).</span></li>
                            <li className="flex items-start gap-2">• <span className="flex-1">Online ETA is recommended to save time at the airport.</span></li>
                            <li className="flex items-start gap-2">• <span className="flex-1">Passport must be valid for 6 months.</span></li>
                        </ul>
                        <a href="https://eta.gov.lk" target="_blank" rel="noopener noreferrer" className="mt-4 block w-full py-2 bg-white border border-sky-200 text-sky-700 text-center rounded-lg text-sm font-medium hover:bg-sky-50">
                            Official ETA Site
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
