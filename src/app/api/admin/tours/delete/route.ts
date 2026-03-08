import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(request: Request) {
    try {
        const { id } = await request.json()

        if (!id) {
            return NextResponse.json({ success: false, message: 'Tour ID is required' }, { status: 400 })
        }

        await pool.query('DELETE FROM tours WHERE id = ?', [id])

        return NextResponse.json({ success: true, message: 'Tour deleted successfully' })
    } catch (error: any) {
        console.error('API Error (Delete Tour):', error)
        return NextResponse.json({ success: false, message: 'Failed to delete tour', error: error.message }, { status: 500 })
    }
}
