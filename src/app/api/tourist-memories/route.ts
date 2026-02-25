import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import fs from 'fs'
import path from 'path'
import { writeFile } from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM gallery_images WHERE category = 'tourist_memories' ORDER BY created_at DESC"
        )
        return NextResponse.json({ images: rows })
    } catch (error) {
        console.error('Tourist Memories Fetch Error:', error)
        return NextResponse.json({ error: 'Failed to fetch tourist memories' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create directory if not exists
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'tourist-memories')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        // Sanitize filename and append unique ID to handle duplicates
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const uniqueId = uuidv4()
        // Extract extension 
        const extMatch = originalName.match(/\.[0-9a-z]+$/i)
        const ext = extMatch ? extMatch[0] : ''
        const baseName = originalName.replace(ext, '')
        const filename = `${baseName}_${uniqueId.substring(0, 8)}${ext}`

        const filePath = path.join(uploadDir, filename)
        await writeFile(filePath, buffer)

        const publicPath = `/images/tourist-memories/${filename}`

        // Save to DB
        const id = uuidv4()
        const title = formData.get('title') as string || ''

        await pool.query(
            'INSERT INTO gallery_images (id, url, title, category) VALUES (?, ?, ?, ?)',
            [id, publicPath, title, 'tourist_memories']
        )

        return NextResponse.json({ success: true, id, url: publicPath })
    } catch (error) {
        console.error('Upload Error:', error)
        return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 })
        }

        // Get file path from DB
        const [rows]: any = await pool.query('SELECT url FROM gallery_images WHERE id = ? AND category = ?', [id, 'tourist_memories'])

        if (rows.length > 0) {
            const fileUrl = rows[0].url
            // Extract filename from URL
            const filename = path.basename(fileUrl)
            const filePath = path.join(process.cwd(), 'public', 'images', 'tourist-memories', filename)

            // Delete file if exists
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }

            // Delete from DB
            await pool.query('DELETE FROM gallery_images WHERE id = ?', [id])
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete Error:', error)
        return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 500 })
    }
}
