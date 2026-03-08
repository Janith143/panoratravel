'use client'

import { useTripPlanner } from '@/lib/contexts/TripPlannerContext'
import { Plus, Check, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function AddToPlannerButton({ destinationId, destinationName }: { destinationId: string, destinationName: string }) {
    const { isInPlanner, addDestination, removeDestination } = useTripPlanner()

    // We only rely on client-side state correctly rendered
    const isAdded = isInPlanner(destinationId)

    if (isAdded) {
        return (
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => removeDestination(destinationId)}
                    className="w-full py-3 bg-slate-100 text-emerald-700 text-center rounded-lg font-bold hover:bg-slate-200 transition-colors border border-emerald-200 flex items-center justify-center gap-2"
                >
                    <Check className="h-5 w-5" /> Added to Planner
                </button>
                <Link
                    href="/planner"
                    className="w-full py-3 bg-emerald-600 text-white text-center rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2"
                >
                    <MapPin className="h-5 w-5" /> View My Trip
                </Link>
            </div>
        )
    }

    return (
        <button
            onClick={() => addDestination(destinationId)}
            className="w-full py-3 bg-emerald-600 text-white text-center rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2"
        >
            <Plus className="h-5 w-5" /> Add to Trip Planner
        </button>
    )
}
