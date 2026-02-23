import { Metadata } from 'next'
import { Suspense } from 'react'
import DestinationsClient from './DestinationsClient'

export const metadata: Metadata = {
    title: 'Explore All Destinations in Sri Lanka | Panora Travels',
    description: 'Discover 100+ destinations across all 25 districts of Sri Lanka. Filter by province, district, or category to find your perfect adventure.',
}

export default function DestinationsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div></div>}>
            <DestinationsClient />
        </Suspense>
    )
}
