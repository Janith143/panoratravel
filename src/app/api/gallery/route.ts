import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
    try {
        const [rows] = await pool.query('SELECT * FROM gallery_images ORDER BY created_at DESC LIMIT 12')
        return NextResponse.json({ images: rows })
    } catch (error) {
        console.error('Gallery Fetch Error:', error)
        return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
    }
}
