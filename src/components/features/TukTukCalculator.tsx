'use client'

import { useState } from 'react'
import { Calculator, MapPin } from 'lucide-react'

export default function TukTukCalculator() {
    const [distance, setDistance] = useState<number>(0)
    const [baseFare] = useState(100) // First km
    const [perKm] = useState(80)    // Subsequent kms

    const calculateFare = (dist: number) => {
        if (dist <= 1) return baseFare * dist
        return baseFare + ((dist - 1) * perKm)
    }

    const estimatedFare = calculateFare(distance)

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                    <Calculator className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Fair Price Calculator</h3>
                    <p className="text-xs text-slate-500">For Tuk-Tuks in Colombo/Suburbs</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Distance (KM)</label>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            value={distance}
                            onChange={(e) => setDistance(Number(e.target.value))}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none pl-10"
                        />
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Estimated Fare:</span>
                    <span className="text-2xl font-bold text-emerald-600">LKR {estimatedFare.toFixed(0)}</span>
                </div>

                <p className="text-xs text-slate-400 italic">
                    *Based on standard meter rates. Night rates (10pm-5am) are 1.5x. Always ask to use the meter.
                </p>
            </div>
        </div>
    )
}
