import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import pool from '@/lib/db'

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'content.json')
        const fileBuffer = await fs.readFile(filePath, 'utf-8')
        const data = JSON.parse(fileBuffer)

        // 1. Fetch Fleet from DB
        try {
            const [fleetRows] = await pool.query('SELECT * FROM fleet')
            if ((fleetRows as any[]).length > 0) {
                data.fleet = fleetRows
            }
        } catch (dbErr) {
            console.error('DB Fetch Error (Fleet):', dbErr)
        }

        // 2. Fetch Destinations from Unified JSON (destinations-data.json)
        try {
            const destPath = path.join(process.cwd(), 'src', 'data', 'destinations-data.json')
            const destBuffer = await fs.readFile(destPath, 'utf-8')
            const destData = JSON.parse(destBuffer)

            if (destData.categories && destData.categories.length > 0) {
                // The new unified categories from destinations-data.json are objects: {id, name, icon}
                // The Home page expects an array of strings
                data.categories = destData.categories.map((c: any) => c.name)
            }

            // Build a lookup map from category ID -> display name
            const catIdToName: Record<string, string> = {}
            if (destData.categories) {
                destData.categories.forEach((c: any) => {
                    catIdToName[c.id] = c.name
                })
            }

            if (destData.attractions && destData.attractions.length > 0) {
                const unifiedDestinations = destData.attractions.map((d: any) => {
                    // Resolve category IDs (e.g. "heritage") to full display names (e.g. "Heritage & Culture")
                    const resolvedCategories = (d.categories || []).map((catId: string) => catIdToName[catId] || catId)
                    return {
                        ...d,
                        categories: resolvedCategories,
                        category: resolvedCategories.length > 0 ? resolvedCategories[0] : 'General',
                        map: d.map || { lat: 7.8731, lng: 80.7718 }
                    }
                })
                data.destinations = unifiedDestinations
            }
        } catch (jsonErr) {
            console.error('JSON Fetch Error (Destinations Unified):', jsonErr)
        }

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('API Error:', error)
        try {
            // Fallback if file doesn't exist
            return NextResponse.json({
                categories: ['Nature', 'Culture'],
                destinations: [],
                tours: [],
                inquiries: []
            })
        } catch (e) {
            return NextResponse.json({ error: 'Failed to load content' }, { status: 500 })
        }
    }
}
