import { NextResponse } from 'next/server'

// Fallback currency rates (to LKR)
const fallbackRates = {
    USD: 320,
    EUR: 350,
    GBP: 400,
    AUD: 210,
    SGD: 240
}

export async function GET() {
    try {
        // Fetch live rates from Frankfurter API (free, no API key, EU Central Bank rates)
        const response = await fetch(
            'https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,AUD,SGD',
            { headers: { 'Accept': 'application/json' } }
        )

        if (!response.ok) {
            throw new Error('API error')
        }

        const data = await response.json()

        if (!data?.rates) {
            throw new Error('Invalid data')
        }

        // Base USD to LKR rate
        const USD_TO_LKR = 320

        // Calculate rates: How many LKR for 1 unit of each currency
        const rates = {
            USD: USD_TO_LKR,
            EUR: Math.round(USD_TO_LKR / data.rates.EUR),
            GBP: Math.round(USD_TO_LKR / data.rates.GBP),
            AUD: Math.round(USD_TO_LKR / data.rates.AUD),
            SGD: Math.round(USD_TO_LKR / data.rates.SGD)
        }

        return NextResponse.json({
            rates,
            lastUpdated: data.date,
            source: 'EU Central Bank',
            live: true
        })
    } catch {
        // Fallback to static rates
        return NextResponse.json({
            rates: fallbackRates,
            lastUpdated: null,
            source: 'Static rates',
            live: false
        })
    }
}
