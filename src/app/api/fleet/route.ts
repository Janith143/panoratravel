import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
    try {
        const [rows] = await pool.query('SELECT * FROM fleet ORDER BY price ASC')
        return NextResponse.json(rows)
    } catch (error) {
        console.error('Fleet API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch fleet' }, { status: 500 })
    }
}
