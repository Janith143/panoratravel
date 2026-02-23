import { Metadata } from 'next'
import { Car, UserCheck, Hotel, ShieldCheck, Map } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Travel Services & Vehicle Rentals | Panora Travels',
    description: 'Luxury vehicle rentals, certified tourist guides, and hotel booking assistance in Sri Lanka. Experience seamless travel with Panora Travels.',
}

export default function ServicesPage() {
    const services = [
        {
            icon: Car,
            title: 'Luxury Vehicle Fleet',
            description: 'Travel in comfort with our diverse fleet of modern vehicles. From luxury sedans and spacious SUVs for families, to comfortable vans for groups. All vehicles are air-conditioned and regularly maintained for safety.',
            items: ['Luxury Sedans (Benz/BMW)', 'Toyota Land Cruiser V8', 'Toyota KDH Vans', 'Tourist Coaches']
        },
        {
            icon: UserCheck,
            title: 'Certified Chauffeur Guides',
            description: 'Our drivers are not just drivers; they are government-licensed tour guides with deep knowledge of Sri Lanka’s history, culture, and nature. Fluent in English and friendly.',
            items: ['SLTDA Licensed', 'English Speaking', 'Kid-friendly', 'Knowledgeable']
        },
        {
            icon: Map,
            title: 'Tailor-Made Itineraries',
            description: 'Don\'t like pre-packaged tours? We specialize in crafting completely personalized travel plans based on your interests, budget, and time.',
            items: ['Custom Routes', 'Flexible Timing', 'Hidden Gems', 'Local Experiences']
        },
        {
            icon: Hotel,
            title: 'Accommodation Booking',
            description: 'We partner with the best hotels in Sri Lanka to offer you exclusive rates. From 5-star luxury resorts and boutique villas to cozy eco-lodges.',
            items: ['Luxury Resorts', 'Boutique Villas', 'Eco Lodges', 'Camping']
        }
    ]

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/40" />
                <div className="container max-w-7xl px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Premium Services</h1>
                    <p className="text-slate-200 max-w-2xl mx-auto text-lg">Beyond just tours, we provide a complete travel ecosystem to ensure your Sri Lankan journey is flawless.</p>
                </div>
            </div>

            <div className="container max-w-7xl px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                            <div className="h-14 w-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                                <service.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 font-serif">{service.title}</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                {service.description}
                            </p>
                            <ul className="space-y-2">
                                {service.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-20 bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-amber-500/20" />
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-serif font-bold mb-6">Need a Custom Transport Solution?</h2>
                        <p className="text-slate-300 mb-8 text-lg">Whether you need an airport transfer or a full-round tour vehicle, we offer competitive rates with no hidden charges.</p>
                        <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-8 text-white font-bold hover:bg-emerald-700 transition-colors">
                            Request a Vehicle Quote
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
