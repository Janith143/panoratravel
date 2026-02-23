'use client'

import dynamic from 'next/dynamic'

const DestinationsLeafletMap = dynamic(
    () => import('./DestinationsLeafletMap'),
    {
        ssr: false,
        loading: () => (
            <div className="h-[600px] w-full rounded-3xl bg-slate-100 animate-pulse flex flex-col items-center justify-center text-slate-400 gap-4">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-serif text-lg">Loading Map Experience...</p>
            </div>
        )
    }
)

export default DestinationsLeafletMap
