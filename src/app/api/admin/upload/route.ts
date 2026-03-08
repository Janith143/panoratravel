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
        let buffer = Buffer.from(new Uint8Array(bytes))

        // Create directory if not exists
        const uploadDir = path.join(process.cwd(), 'public', 'images', folder)
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        // Save file
        // Sanitize filename
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const extMatch = originalName.match(/\.[0-9a-z]+$/i)
        const originalExt = extMatch ? extMatch[0].toLowerCase() : ''

        let filename = originalName
        let finalBuffer: string | NodeJS.ArrayBufferView = buffer

        const isImage = file.type.startsWith('image/') && !file.type.includes('svg')
        if (isImage) {
            const sharp = (await import('sharp')).default
            const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer()
            finalBuffer = new Uint8Array(webpBuffer)
            const baseName = originalName.replace(new RegExp(`\\${originalExt}$`, 'i'), '')
            filename = `${baseName}.webp`
        } else {
            finalBuffer = new Uint8Array(buffer)
        }

        const filePath = path.join(uploadDir, filename)

        await writeFile(filePath, finalBuffer)

        const publicPath = `/images/${folder}/${filename}`
        return NextResponse.json({ success: true, path: publicPath })
    } catch (error) {
        console.error('Upload Error:', error)
        return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 })
    }
}
