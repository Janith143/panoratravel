import { NextResponse } from 'next/server'

// Coordinates for Sri Lankan destinations
const coordinates: { [key: string]: { lat: number; lon: number } } = {
    'Colombo': { lat: 6.9271, lon: 79.8612 },
    'Kandy': { lat: 7.2906, lon: 80.6337 },
    'Ella': { lat: 6.8667, lon: 81.0466 },
    'Galle': { lat: 6.0535, lon: 80.2210 },
    'Sigiriya': { lat: 7.9570, lon: 80.7603 },
    'Yala': { lat: 6.3728, lon: 81.5169 },
    'Nuwara Eliya': { lat: 6.9497, lon: 80.7891 },
    'Mirissa': { lat: 5.9470, lon: 80.4586 }
}

// Fallback weather data
const fallbackWeather: { [key: string]: { temp: number; humidity: number; condition: string } } = {
    'Colombo': { temp: 30, condition: 'sunny', humidity: 75 },
    'Kandy': { temp: 25, condition: 'cloudy', humidity: 80 },
    'Ella': { temp: 22, condition: 'cloudy', humidity: 70 },
    'Galle': { temp: 29, condition: 'sunny', humidity: 78 },
    'Sigiriya': { temp: 32, condition: 'sunny', humidity: 65 },
    'Yala': { temp: 33, condition: 'sunny', humidity: 60 },
    'Nuwara Eliya': { temp: 16, condition: 'cloudy', humidity: 85 },
    'Mirissa': { temp: 28, condition: 'sunny', humidity: 80 }
}

// Map WMO weather codes to conditions
function getConditionFromCode(code: number): string {
    if (code === 0) return 'sunny'
    if (code >= 1 && code <= 3) return 'cloudy'
    if (code >= 45 && code <= 48) return 'foggy'
    if (code >= 51 && code <= 67) return 'rainy'
    if (code >= 71 && code <= 77) return 'snowy'
    if (code >= 80 && code <= 82) return 'rainy'
    if (code >= 95 && code <= 99) return 'stormy'
    return 'cloudy'
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const destination = searchParams.get('destination') || 'Colombo'

    const coords = coordinates[destination] || coordinates['Colombo']
    const fallback = fallbackWeather[destination] || fallbackWeather['Colombo']

    try {
        // Fetch live weather from Open-Meteo (free, no API key)
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code`

        const response = await fetch(apiUrl, {
            headers: { 'Accept': 'application/json' }
        })

        if (!response.ok) {
            throw new Error('API error')
        }

        const data = await response.json()

        if (!data?.current) {
            throw new Error('Invalid data')
        }

        return NextResponse.json({
            destination,
            temp: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            condition: getConditionFromCode(data.current.weather_code),
            live: true
        })
    } catch {
        // Fallback to static data
        return NextResponse.json({
            destination,
            temp: fallback.temp,
            humidity: fallback.humidity,
            condition: fallback.condition,
            live: false
        })
    }
}
