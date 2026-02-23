import pool from '@/lib/db'
import { getAttractions } from '@/lib/content'
import GalleryGrid, { GalleryItem } from '@/components/gallery/GalleryGrid'

// Force dynamic to ensure DB fetch
export const dynamic = 'force-dynamic'

async function getGalleryImages(): Promise<GalleryItem[]> {
    const images: GalleryItem[] = []

    // 1. Fetch images from Database (Existing logic)
    try {
        const [rows] = await pool.query('SELECT * FROM gallery_images ORDER BY created_at DESC')
        const dbImages = rows as any[]
        dbImages.forEach(img => {
            images.push({
                id: `db-${img.id}`,
                url: img.url,
                title: img.title || 'Sri Lanka',
                category: img.category || 'Landscape',
            })
        })
    } catch (e) {
        console.error('Failed to fetch DB images:', e)
    }

    // 2. Fetch images from all Attractions logic
    const attractions = getAttractions()
    attractions.forEach((attr, index) => {
        // Skip default placeholder image if possible to keep gallery high quality,
        // but for now we include everything that isn't explicitly the default.
        if (attr.image && !attr.image.includes('default.jpg')) {
            images.push({
                id: `attr-${attr.id}-${index}`,
                url: attr.image,
                title: attr.name,
                category: (attr.categories && attr.categories.join(', ')) || 'Attraction',
            })
        }
    })

    return images
}

export const metadata = {
    title: 'Visual Journey | Panora Travels',
    description: 'Explore the beauty of Sri Lanka through our lens.'
}

export default async function GalleryPage() {
    const images = await getGalleryImages()

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white pt-32 pb-24 px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Our Visual Journey</h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    Glimpses of the unforgettable moments and breathtaking landscapes awaiting you in Sri Lanka. Click any image to view it in full detail.
                </p>
            </div>

            <div className="container max-w-7xl mx-auto px-4 -mt-12 relative z-10">
                {images.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm text-slate-500 border border-slate-100">
                        No images in the gallery yet. Check back soon!
                    </div>
                ) : (
                    <GalleryGrid images={images} />
                )}
            </div>
        </div>
    )
}
