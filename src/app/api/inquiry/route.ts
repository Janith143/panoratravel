import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, destinations, vehicle, passengers, contact, addons, startDate } = body

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const id = `inq-${Date.now()}`
        const date = new Date()

        await pool.query(
            'INSERT INTO inquiries (id, email, date, status, destinations, vehicleType, vehicleCount, passengers, startDate, contact, addons) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                id,
                email,
                date,
                'pending',
                JSON.stringify(destinations || []),
                vehicle || 'Sedan',
                1, // Default vehicle count
                passengers || 2,
                startDate || null,
                JSON.stringify(contact || {}),
                JSON.stringify(addons || [])
            ]
        )

        return NextResponse.json({ success: true, inquiryId: id })

    } catch (error) {
        console.error('Inquiry Error:', error)
        return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
    }
}
