import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: Request) {
    try {
        const data = await request.json()

        // 0. Update content.json file with new siteConfig (since frontend relies on static JSON import instead of DB)
        if (data.siteConfig) {
            try {
                const filePath = path.join(process.cwd(), 'src', 'data', 'content.json')
                const fileBuffer = await fs.readFile(filePath, 'utf-8')
                const fileData = JSON.parse(fileBuffer)

                fileData.siteConfig = data.siteConfig

                await fs.writeFile(filePath, JSON.stringify(fileData, null, 4))
            } catch (err) {
                console.error("Failed to write to content.json:", err)
            }
        }

        // We assume 'data' is the full content object.
        // We need to decide what to save. 
        // Existing Admin saves the WHOLE content.json.
        // In DB world, we should save parts.

        // For now, let's update specific tables based on what's changed, 
        // OR simply update the 'siteConfig' blob if that's what is mostly edited in "Settings".
        // The Admin UI sends the *entire* content object. 

        // 1. Update Site Config
        if (data.siteConfig) {
            const [rows] = await pool.query('SELECT id FROM site_config WHERE section_key = ?', ['main_config']);
            if ((rows as any[]).length > 0) {
                await pool.query('UPDATE site_config SET value = ? WHERE section_key = ?', [JSON.stringify(data.siteConfig), 'main_config']);
            } else {
                await pool.query('INSERT INTO site_config (id, section_key, value) VALUES (?, ?, ?)', ['config-main', 'main_config', JSON.stringify(data.siteConfig)]);
            }
        }

        // 2. Update FAQ (Full replace strategy for simplicity or specific updates? 
        // The current Admin sends the whole array. A full sync is safest for this simple CMS.)
        if (data.faq) {
            // Delete items that are no longer in the array
            const currentIds = data.faq.filter((v: any) => v.id).map((v: any) => v.id);
            if (currentIds.length > 0) {
                const placeholders = currentIds.map(() => '?').join(',');
                await pool.query(`DELETE FROM faq WHERE id NOT IN (${placeholders})`, currentIds);
            } else {
                await pool.query('DELETE FROM faq');
            }

            // Let's iterate and Upsert based on ID
            for (const item of data.faq) {
                const id = item.id || randomUUID();
                await pool.query(
                    'INSERT INTO faq (id, question, answer, category) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE question = VALUES(question), answer = VALUES(answer), category = VALUES(category)',
                    [id, item.question, item.answer, item.category || 'General']
                );
            }
        }

        // Note: Destinations, Tours, etc are usually handled by specific APIs or this big JSON save.
        // If the Admin UI edits them inside the big object, we need to sync them too.
        // Given the Admin UI I saw earlier, it *does* edit Destinations/Tours in the big object.

        if (data.destinations) {
            // Delete destinations that are no longer in the array
            const currentIds = data.destinations.filter((v: any) => v.id).map((v: any) => v.id);
            if (currentIds.length > 0) {
                const placeholders = currentIds.map(() => '?').join(',');
                await pool.query(`DELETE FROM destinations WHERE id NOT IN (${placeholders})`, currentIds);
            } else {
                await pool.query('DELETE FROM destinations');
            }

            for (const dest of data.destinations) {
                const id = dest.id || randomUUID();
                await pool.query(
                    `INSERT INTO destinations (id, slug, name, description, image, category, district, highlights, mapData, categories) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                     ON DUPLICATE KEY UPDATE 
                     name = VALUES(name), description = VALUES(description), image = VALUES(image), 
                     category = VALUES(category), district = VALUES(district), highlights = VALUES(highlights), 
                     mapData = VALUES(mapData), categories = VALUES(categories)`,
                    [
                        id, dest.slug || id, dest.name, dest.description, dest.image,
                        dest.category, dest.district, JSON.stringify(dest.highlights || []),
                        JSON.stringify(dest.map || dest.mapData || {}), JSON.stringify(dest.categories || [])
                    ]
                );
            }
        }

        if (data.tours) {
            // Delete tours that are no longer in the array
            const currentIds = data.tours.filter((v: any) => v.id).map((v: any) => v.id);
            if (currentIds.length > 0) {
                const placeholders = currentIds.map(() => '?').join(',');
                await pool.query(`DELETE FROM tours WHERE id NOT IN (${placeholders})`, currentIds);
            } else {
                await pool.query('DELETE FROM tours');
            }

            for (const tour of data.tours) {
                const id = tour.id || randomUUID();
                await pool.query(
                    `INSERT INTO tours (id, slug, title, duration, price, image, category, rating, reviews, description, highlights, itinerary)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE
                     title = VALUES(title), duration = VALUES(duration), price = VALUES(price), image = VALUES(image),
                     category = VALUES(category), rating = VALUES(rating), reviews = VALUES(reviews), description = VALUES(description),
                     highlights = VALUES(highlights), itinerary = VALUES(itinerary)`,
                    [
                        id, tour.slug || id, tour.title, tour.duration, tour.price, tour.image,
                        tour.category, tour.rating || 5, tour.reviews || 0, tour.description,
                        JSON.stringify(tour.highlights || []), JSON.stringify(tour.itinerary || [])
                    ]
                );
            }

        }

        if (data.fleet) {
            try {
                // Delete vehicles that are no longer in the array
                const currentIds = data.fleet.filter((v: any) => v.id).map((v: any) => v.id);
                if (currentIds.length > 0) {
                    const placeholders = currentIds.map(() => '?').join(',');
                    await pool.query(`DELETE FROM fleet WHERE id NOT IN (${placeholders})`, currentIds);
                } else {
                    await pool.query('DELETE FROM fleet');
                }

                for (const vehicle of data.fleet) {
                    const id = vehicle.id || randomUUID();
                    await pool.query(
                        `INSERT INTO fleet (id, name, type, passengers, price, additionalKmRate, image, description)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE
                     name = VALUES(name), type = VALUES(type), passengers = VALUES(passengers),
                     price = VALUES(price), additionalKmRate = VALUES(additionalKmRate), image = VALUES(image), description = VALUES(description)`,
                        [
                            id, vehicle.name, vehicle.type, vehicle.passengers,
                            vehicle.price, vehicle.additionalKmRate || 0, vehicle.image, vehicle.description || ''
                        ]
                    );
                }
            } catch (fleetError: any) {
                console.error('Fleet Save Error:', fleetError)
                return NextResponse.json({ success: false, message: 'Failed to save fleet', error: fleetError.message }, { status: 500 })
            }
        }

        return NextResponse.json({ success: true, message: 'Content saved to Database' })
    } catch (error: any) {
        console.error('Save Error:', error)
        return NextResponse.json({ success: false, message: 'Failed to save content', error: error.message }, { status: 500 })
    }
}
