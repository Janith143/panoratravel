'use client'

import { useState, useEffect } from 'react'
import { Sun, Cloud, CloudRain, Wind, Thermometer, CloudFog, CloudLightning, Snowflake, Loader2 } from 'lucide-react'

interface WeatherWidgetProps {
    destination: string
}

interface WeatherData {
    temp: number
    condition: string
    humidity: number
}

// Destination coordinates for Open-Meteo API
const destinationCoords: { [key: string]: { lat: number, lon: number } } = {
    'Colombo': { lat: 6.9271, lon: 79.8612 },
    'Kandy': { lat: 7.2906, lon: 80.6337 },
    'Ella': { lat: 6.8667, lon: 81.0466 },
    'Galle': { lat: 6.0535, lon: 80.2210 },
    'Sigiriya': { lat: 7.9570, lon: 80.7603 },
    'Yala': { lat: 6.3728, lon: 81.5169 },
    'Nuwara Eliya': { lat: 6.9497, lon: 80.7891 },
    'Mirissa': { lat: 5.9483, lon: 80.4716 },
    'Trincomalee': { lat: 8.5874, lon: 81.2152 },
    'Jaffna': { lat: 9.6615, lon: 80.0255 },
    'Anuradhapura': { lat: 8.3114, lon: 80.4037 },
    'Polonnaruwa': { lat: 7.9395, lon: 81.0039 },
}

// Fallback static data
const fallbackData: { [key: string]: WeatherData } = {
    'Colombo': { temp: 30, condition: 'sunny', humidity: 75 },
    'Kandy': { temp: 25, condition: 'cloudy', humidity: 80 },
    'Ella': { temp: 22, condition: 'foggy', humidity: 70 },
    'Galle': { temp: 29, condition: 'sunny', humidity: 78 },
    'Sigiriya': { temp: 32, condition: 'sunny', humidity: 65 },
    'Yala': { temp: 33, condition: 'sunny', humidity: 60 },
    'Nuwara Eliya': { temp: 16, condition: 'foggy', humidity: 85 },
    'Mirissa': { temp: 28, condition: 'sunny', humidity: 80 }
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

const getWeatherIcon = (condition: string) => {
    switch (condition) {
        case 'sunny':
            return <Sun className="h-8 w-8 text-amber-500" />
        case 'cloudy':
            return <Cloud className="h-8 w-8 text-slate-400" />
        case 'rainy':
            return <CloudRain className="h-8 w-8 text-blue-500" />
        case 'foggy':
            return <CloudFog className="h-8 w-8 text-slate-300" />
        case 'stormy':
            return <CloudLightning className="h-8 w-8 text-purple-500" />
        case 'snowy':
            return <Snowflake className="h-8 w-8 text-cyan-300" />
        default:
            return <Sun className="h-8 w-8 text-amber-500" />
    }
}

export default function WeatherWidget({ destination }: WeatherWidgetProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWeather = async () => {
            const coords = destinationCoords[destination]

            if (!coords) {
                // Use fallback for unknown destinations
                setWeather(fallbackData[destination] || fallbackData['Colombo'])
                setLoading(false)
                return
            }

            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code,relative_humidity_2m`,
                    { cache: 'no-store' }
                )

                if (response.ok) {
                    const data = await response.json()
                    setWeather({
                        temp: Math.round(data.current.temperature_2m),
                        condition: getConditionFromCode(data.current.weather_code),
                        humidity: data.current.relative_humidity_2m || 70
                    })
                } else {
                    throw new Error('Failed to fetch')
                }
            } catch {
                // Use fallback data
                setWeather(fallbackData[destination] || fallbackData['Colombo'])
            } finally {
                setLoading(false)
            }
        }

        fetchWeather()
    }, [destination])

    const displayWeather = weather || fallbackData[destination] || fallbackData['Colombo']

    return (
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm opacity-80">{destination}</p>
                    {loading ? (
                        <div className="flex items-center gap-2 mt-1">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-lg">Loading...</span>
                        </div>
                    ) : (
                        <p className="text-3xl font-bold">{displayWeather.temp}°C</p>
                    )}
                </div>
                {!loading && getWeatherIcon(displayWeather.condition)}
            </div>
            {!loading && (
                <div className="flex items-center gap-4 mt-3 text-xs opacity-80">
                    <span className="flex items-center gap-1">
                        <Wind className="h-3 w-3" /> {displayWeather.condition}
                    </span>
                    <span className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3" /> {displayWeather.humidity}% humidity
                    </span>
                </div>
            )}
        </div>
    )
}
