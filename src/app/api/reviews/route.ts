import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const featured = searchParams.get('featured')

        let query = 'SELECT * FROM reviews ORDER BY created_at DESC'
        const params: any[] = []

        if (featured === 'true') {
            query = 'SELECT * FROM reviews WHERE isFeatured = 1 ORDER BY created_at DESC'
        }

        const [rows] = await pool.query(query, params)

        // Parse JSON fields and map to frontend key names
        const reviews = (rows as any[]).map(row => {
            const photosArray = typeof row.photos === 'string' ? JSON.parse(row.photos) : row.photos || []
            // Fallback to single image if photos array is empty
            if (photosArray.length === 0 && row.image) {
                photosArray.push(row.image)
            }

            return {
                id: row.id,
                userName: row.name,
                userImage: row.avatar,
                rating: row.rating,
                text: row.text,
                date: row.created_at,
                photos: photosArray,
                categories: typeof row.categories === 'string' ? JSON.parse(row.categories) : row.categories || [],
                isFeatured: !!row.isFeatured
            }
        })

        return NextResponse.json({ reviews })
    } catch (error: any) {
        console.error('Database Error:', error)
        return NextResponse.json({
            error: 'Failed to load reviews',
            details: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { rating, text, photos, userId, userName, userImage, userContact, categories } = body

        if (!text || !rating) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const id = `rev_${Date.now()}`
        const date = new Date()

        const primaryPhoto = photos && photos.length > 0 ? photos[0] : null
        const photosJson = JSON.stringify(photos || [])

        await pool.query(
            'INSERT INTO reviews (id, name, rating, text, avatar, categories, created_at, isFeatured, image, photos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                id,
                userName || 'Guest',
                rating,
                text,
                userImage || '',
                JSON.stringify(categories || []),
                date,
                false,
                primaryPhoto,
                photosJson
            ]
        )

        const newReview = {
            id,
            userName: userName || 'Guest',
            rating,
            text,
            avatar: userImage,
            categories: categories || [],
            date: date.toISOString()
        }

        return NextResponse.json({ success: true, review: newReview })

    } catch (error) {
        console.error('Review Save Error:', error)
        return NextResponse.json({ error: 'Failed to save review' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Review ID required' }, { status: 400 })
        }

        await pool.query('DELETE FROM reviews WHERE id = ?', [id])

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete Error:', error)
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, rating, text, isFeatured } = body

        if (!id) {
            return NextResponse.json({ error: 'Review ID required' }, { status: 400 })
        }

        await pool.query(
            'UPDATE reviews SET rating = ?, text = ?, isFeatured = ? WHERE id = ?',
            [rating, text, isFeatured ? 1 : 0, id]
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Update Error:', error)
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
    }
}
