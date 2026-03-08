import content from '@/data/content.json'
import destinationsData from '@/data/destinations-data.json'
import pool from '@/lib/db'
import { Tour } from '@/lib/content'

// Read functions for original content using DB
export async function getToursDB(): Promise<Tour[]> {
    try {
        const [rows] = await pool.query('SELECT * FROM tours');
        return (rows as any[]).map(t => ({
            ...t,
            highlights: typeof t.highlights === 'string' ? JSON.parse(t.highlights) : (t.highlights || []),
            itinerary: typeof t.itinerary === 'string' ? JSON.parse(t.itinerary) : (t.itinerary || [])
        }));
    } catch (e) {
        console.error("DB Fetch Error getTours:", e)
        return content.tours as Tour[]
    }
}

export async function getTourBySlugDB(slug: string): Promise<Tour | undefined> {
    try {
        const [rows] = await pool.query('SELECT * FROM tours WHERE slug = ?', [slug]);
        const records = rows as any[];
        if (records.length === 0) return (content.tours as Tour[]).find(t => t.slug === slug);
        const t = records[0];
        return {
            ...t,
            highlights: typeof t.highlights === 'string' ? JSON.parse(t.highlights) : (t.highlights || []),
            itinerary: typeof t.itinerary === 'string' ? JSON.parse(t.itinerary) : (t.itinerary || [])
        } as Tour
    } catch (e) {
        console.error("DB Fetch Error getTourBySlug:", e)
        return (content.tours as Tour[]).find(t => t.slug === slug)
    }
}
