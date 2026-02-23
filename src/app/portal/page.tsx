import { Metadata } from 'next'
import { Calendar, MapPin, Phone, ShieldCheck, Sun, Clock, User } from 'lucide-react'
import { IMAGES } from '@/lib/images'

export const metadata: Metadata = {
    title: 'My Trip Portal | Panora Travels',
    description: 'Manage your active trip. Live driver tracking, daily itinerary, and emergency support.',
}

export default function PortalPage() {
    return (
        <div className="bg-slate-100 min-h-screen pb-20">
            {/* Mobile-First Header */}
            <div className="bg-slate-900 text-white p-6 pb-24 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Welcome Back,</p>
                        <h1 className="text-2xl font-bold">Sarah Jenkins</h1>
                    </div>
                    <div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center text-lg font-bold">SJ</div>
                </div>

                <div className="flex justify-between items-end relative z-10">
                    <div>
                        <p className="text-4xl font-serif font-bold mb-1">Day 03</p>
                        <p className="text-emerald-400 font-medium flex items-center gap-2"><MapPin className="h-4 w-4" /> Kandy to Ella</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-lg"><Sun className="h-5 w-5" /> 28°C</div>
                    </div>
                </div>
            </div>

            <div className="container max-w-md mx-auto px-4 -mt-16 space-y-6">
                {/* Live Status Card */}
                <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold uppercase mb-2">Live Now</span>
                            <h3 className="font-bold text-slate-900">Driver is nearby</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">5 <span className="text-sm font-normal text-slate-500">mins</span></p>
                        </div>
                    </div>

                    {/* Simulated Map */}
                    <div className="h-32 bg-slate-200 rounded-xl mb-4 relative overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-50"
                            style={{ backgroundImage: `url('${IMAGES.portal.map_fallback}')` }}
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="h-4 w-4 bg-blue-500 rounded-full ring-4 ring-blue-500/30 animate-pulse" />
                        </div>
                        <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-slate-600">
                            Approaching Hotel Sigiriya
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-200 rounded-full overflow-hidden">
                            <img src={IMAGES.portal.driver} alt="Driver" className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Wasantha (Guide)</p>
                            <p className="text-xs text-slate-500">Toyota Premier • WP CAM-1234</p>
                        </div>
                        <button className="ml-auto h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white hover:bg-emerald-600">
                            <Phone className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Today's Timeline */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-emerald-600" /> Today's Agenda
                    </h3>
                    <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                        <div className="relative">
                            <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-slate-300 ring-4 ring-white" />
                            <p className="text-xs font-bold text-slate-400 mb-1">08:00 AM</p>
                            <h4 className="font-bold text-slate-900 line-through text-opacity-50">Breakfast at Hotel</h4>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-white shadow-emerald-500/50 shadow-sm" />
                            <p className="text-xs font-bold text-emerald-600 mb-1">10:30 AM (Current)</p>
                            <h4 className="font-bold text-slate-900">Tea Factory Visit</h4>
                            <p className="text-sm text-slate-500 mt-1">Damro Labookellie Tea Centre</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-slate-300 ring-4 ring-white" />
                            <p className="text-xs font-bold text-slate-400 mb-1">01:00 PM</p>
                            <h4 className="font-bold text-slate-900">Scenic Train to Ella</h4>
                            <div className="inline-flex mt-2 items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-bold">
                                <User className="h-3 w-3" /> Tickets Held by Guide
                            </div>
                        </div>
                    </div>
                </div>

                {/* SOS Button */}
                <button className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                    <ShieldCheck className="h-5 w-5" /> Emergency SOS
                </button>
            </div>
        </div>
    )
}
