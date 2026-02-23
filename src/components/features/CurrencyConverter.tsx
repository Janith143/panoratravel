'use client'

import { useState, useEffect } from 'react'
import { ArrowRightLeft, DollarSign, Loader2 } from 'lucide-react'

// Fallback rates (approximate LKR values)
const fallbackRates = {
    USD: 320,
    EUR: 350,
    GBP: 400,
    AUD: 210,
    SGD: 240
}

interface CurrencyConverterProps {
    variant?: 'light' | 'dark'
}

import { motion, AnimatePresence } from 'framer-motion'

export default function CurrencyConverter({ variant = 'light' }: CurrencyConverterProps) {
    const [amount, setAmount] = useState<number>(100)
    const [currency, setCurrency] = useState<keyof typeof fallbackRates>('USD')
    const [rates, setRates] = useState<typeof fallbackRates>(fallbackRates)
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<string | null>(null)
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        const fetchRates = async () => {
            try {
                // Frankfurter API - free, no API key required
                // Get rates from USD to common currencies
                const response = await fetch(
                    'https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,AUD,SGD',
                    { cache: 'no-store' }
                )

                if (response.ok) {
                    const data = await response.json()

                    // LKR is not in Frankfurter, so we use a fixed approximate rate
                    // and calculate cross-rates
                    const usdToLkr = 320 // Approximate USD to LKR rate

                    const newRates = {
                        USD: usdToLkr,
                        EUR: Math.round(usdToLkr / data.rates.EUR),
                        GBP: Math.round(usdToLkr / data.rates.GBP),
                        AUD: Math.round(usdToLkr / data.rates.AUD),
                        SGD: Math.round(usdToLkr / data.rates.SGD),
                    }

                    setRates(newRates)
                    setLastUpdated(new Date(data.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    }))
                } else {
                    // API failed, use fallback
                    setRates(fallbackRates)
                    setLastUpdated(null)
                }
            } catch {
                // Network error, use fallback rates
                setRates(fallbackRates)
                setLastUpdated(null)
            } finally {
                setLoading(false)
            }
        }

        fetchRates()
        // Refresh rates every hour
        const interval = setInterval(fetchRates, 60 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const converted = amount * rates[currency]
    const isDark = variant === 'dark'

    return (
        <motion.div
            className={`rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'w-72' : 'w-auto rounded-full'} ${isDark ? 'bg-slate-900/80 backdrop-blur-lg border border-white/10' : 'bg-white shadow-sm border border-slate-100'}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            layout
        >
            <AnimatePresence mode='wait'>
                {!isExpanded ? (
                    <motion.div
                        key="icon"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex items-center justify-center gap-3 px-5 py-3 cursor-pointer"
                    >
                        <ArrowRightLeft className={`h-5 w-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        <span className={`font-medium text-sm whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>Currency Converter</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-5"
                    >
                        <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <ArrowRightLeft className={`h-5 w-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            Currency Converter
                            {loading && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
                        </h3>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className={`text-xs block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Amount</label>
                                    <div className="relative">
                                        <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                            className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${isDark
                                                ? 'bg-white/10 border-white/20 text-white placeholder:text-slate-500'
                                                : 'border-slate-200 text-slate-900'
                                                }`}
                                        />
                                    </div>
                                </div>
                                <div className="w-24">
                                    <label className={`text-xs block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Currency</label>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value as keyof typeof fallbackRates)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${isDark
                                            ? 'bg-white/10 border-white/20 text-white'
                                            : 'border-slate-200 text-slate-900 bg-white'
                                            }`}
                                    >
                                        {Object.keys(rates).map((c) => (
                                            <option key={c} value={c} className="text-slate-900 bg-white">{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={`rounded-lg p-4 text-center ${isDark ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-100'}`}>
                                <p className={`text-sm mb-1 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Sri Lankan Rupees (LKR)</p>
                                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-emerald-900'}`}>
                                    Rs. {converted.toLocaleString()}
                                </p>
                            </div>

                            <p className={`text-xs text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {lastUpdated
                                    ? `Rates from ECB via Frankfurter • ${lastUpdated}`
                                    : '* Approximate rates. Actual rates may vary.'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
