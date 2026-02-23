'use client'

import { useState, useEffect } from 'react'
import { Sun, Cloud, CloudRain, CloudFog, CloudLightning, Snowflake, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

// Destination coordinates for Open-Meteo API
const destinations = [
    { name: 'Colombo', lat: 6.9271, lon: 79.8612 },
    { name: 'Kandy', lat: 7.2906, lon: 80.6337 },
    { name: 'Ella', lat: 6.8667, lon: 81.0466 },
    { name: 'Galle', lat: 6.0535, lon: 80.2210 },
    { name: 'Sigiriya', lat: 7.9570, lon: 80.7603 },
    { name: 'Yala', lat: 6.3728, lon: 81.5169 },
    { name: 'Nuwara Eliya', lat: 6.9497, lon: 80.7891 },
    { name: 'Mirissa', lat: 5.9483, lon: 80.4716 },
]

// Fallback data in case API fails
const fallbackData = [
    { destination: 'Colombo', temp: 31, condition: 'sunny' },
    { destination: 'Kandy', temp: 26, condition: 'cloudy' },
    { destination: 'Ella', temp: 22, condition: 'foggy' },
    { destination: 'Galle', temp: 29, condition: 'sunny' },
    { destination: 'Sigiriya', temp: 32, condition: 'sunny' },
    { destination: 'Yala', temp: 33, condition: 'sunny' },
    { destination: 'Nuwara Eliya', temp: 16, condition: 'foggy' },
    { destination: 'Mirissa', temp: 28, condition: 'cloudy' },
]

interface WeatherData {
    destination: string
    temp: number
    condition: string
}

// Map WMO weather codes to our condition strings
const getConditionFromCode = (code: number): string => {
    if (code === 0) return 'sunny'
    if (code >= 1 && code <= 3) return 'cloudy'
    if (code >= 45 && code <= 48) return 'foggy'
    if (code >= 51 && code <= 67) return 'rainy'
    if (code >= 71 && code <= 77) return 'snowy'
    if (code >= 80 && code <= 82) return 'rainy'
    if (code >= 95 && code <= 99) return 'stormy'
    return 'cloudy'
}

const getWeatherIcon = (condition: string, className: string = "h-4 w-4") => {
    switch (condition) {
        case 'sunny':
            return <Sun className={`${className} text-amber-400`} />
        case 'cloudy':
            return <Cloud className={`${className} text-slate-300`} />
        case 'rainy':
            return <CloudRain className={`${className} text-blue-400`} />
        case 'foggy':
            return <CloudFog className={`${className} text-slate-400`} />
        case 'stormy':
            return <CloudLightning className={`${className} text-purple-400`} />
        case 'snowy':
            return <Snowflake className={`${className} text-cyan-300`} />
        default:
            return <Sun className={`${className} text-amber-400`} />
    }
}

interface WeatherTickerProps {
    onOpenMap: () => void
}

export default function WeatherTicker({ onOpenMap }: WeatherTickerProps) {
    const [weatherData, setWeatherData] = useState<WeatherData[]>(fallbackData)

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Fetch weather for all destinations from Open-Meteo API
                const results = await Promise.all(
                    destinations.map(async (dest) => {
                        try {
                            const response = await fetch(
                                `https://api.open-meteo.com/v1/forecast?latitude=${dest.lat}&longitude=${dest.lon}&current=temperature_2m,weather_code`,
                                {
                                    cache: 'no-store',
                                    signal: AbortSignal.timeout(5000) // 5s timeout
                                }
                            )
                            if (response.ok) {
                                const data = await response.json()
                                return {
                                    destination: dest.name,
                                    temp: Math.round(data.current.temperature_2m),
                                    condition: getConditionFromCode(data.current.weather_code)
                                }
                            }
                        } catch {
                            // Individual fetch failed, return fallback
                        }
                        // Return fallback for this destination
                        const fb = fallbackData.find(f => f.destination === dest.name)
                        return fb || { destination: dest.name, temp: 28, condition: 'sunny' }
                    })
                )
                setWeatherData(results)
            } catch (e) {
                console.warn('Weather fetch failed', e)
                // Keep fallback data
            }
        }

        fetchWeather()
        // Refresh weather every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    // Double the array for seamless infinite scroll
    const tickerItems = [...weatherData, ...weatherData]

    return (
        <div className="bg-black/40 backdrop-blur-md py-2.5 border-b border-white/10 overflow-hidden relative group">
            <motion.div
                className="flex gap-8"
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: 30,
                        ease: 'linear'
                    }
                }}
            >
                {tickerItems.map((item, index) => (
                    <div
                        key={`${item.destination}-${index}`}
                        className="flex items-center gap-2 text-white whitespace-nowrap px-4 cursor-pointer hover:text-emerald-400 transition-colors"
                        onClick={onOpenMap}
                    >
                        {getWeatherIcon(item.condition)}
                        <span className="font-medium">{item.destination}</span>
                        <span className="text-white/80">{item.temp}°C</span>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}
