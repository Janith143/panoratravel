'use client'

import dynamic from 'next/dynamic'

const LeafletMap = dynamic(
    () => import('./LeafletMap'),
    {
        ssr: false,
        loading: () => (
            <div className="h-[500px] w-full rounded-xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
                Loading Map...
            </div>
        )
    }
)

export default LeafletMap
