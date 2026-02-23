import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { writeFile } from 'fs/promises'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const folder = formData.get('folder') as string || 'uploads'

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create directory if not exists
        const uploadDir = path.join(process.cwd(), 'public', 'images', folder)
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        // Save file
        // Sanitize filename
        const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filePath = path.join(uploadDir, filename)

        await writeFile(filePath, buffer)

        const publicPath = `/images/${folder}/${filename}`
        return NextResponse.json({ success: true, path: publicPath })
    } catch (error) {
        console.error('Upload Error:', error)
        return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 })
    }
}
