import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
    try {
        const data = await request.json()

        // Path to destinations-data.json
        const filePath = path.join(process.cwd(), 'src', 'data', 'destinations-data.json')

        // Write file with pretty print
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')

        return NextResponse.json({ success: true, message: 'Destinations data saved successfully' })
    } catch (error) {
        console.error('Save Destinations Error:', error)
        return NextResponse.json({ success: false, message: 'Failed to save destinations data' }, { status: 500 })
    }
}
