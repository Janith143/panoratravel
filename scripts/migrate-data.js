const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function migrateData() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'panora_paths'
    });

    try {
        console.log('🔌 Connected to Database.');

        // 1. Migrate Inquiries
        const contentPath = path.join(__dirname, '..', 'src', 'data', 'content.json');
        const contentData = JSON.parse(await fs.readFile(contentPath, 'utf8'));

        if (contentData.inquiries) {
            let inqCount = 0;
            for (const inq of contentData.inquiries) {
                // Check if exists
                const [rows] = await connection.execute('SELECT id FROM inquiries WHERE id = ?', [inq.id]);
                if (rows.length === 0) {
                    await connection.execute(
                        'INSERT INTO inquiries (id, email, date, status, destinations, vehicleType, vehicleCount, passengers, startDate, contact, addons) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [
                            inq.id,
                            inq.email,
                            new Date(inq.date), // Convert string to Date
                            inq.status || 'pending',
                            JSON.stringify(inq.destinations || []),
                            inq.vehicleType,
                            inq.vehicleCount || 1,
                            inq.passengers || 2,
                            inq.startDate || null,
                            JSON.stringify(inq.contact || {}),
                            JSON.stringify(inq.addons || [])
                        ]
                    );
                    inqCount++;
                }
            }
            console.log(`✅ Migrated ${inqCount} inquiries.`);
        }

        // 2. Migrate Reviews (from reviews.json)
        const reviewPath = path.join(__dirname, '..', 'src', 'data', 'reviews.json');
        try {
            const reviewData = JSON.parse(await fs.readFile(reviewPath, 'utf8'));
            let revCount = 0;
            for (const rev of reviewData.reviews) {
                const [rows] = await connection.execute('SELECT id FROM reviews WHERE id = ?', [rev.id]);
                if (rows.length === 0) {
                    await connection.execute(
                        'INSERT INTO reviews (id, name, location, rating, text, trip, avatar, categories, isFeatured, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [
                            rev.id,
                            rev.author,
                            rev.location || '',
                            rev.rating,
                            rev.content,
                            rev.tripType || '',
                            rev.image || '',
                            JSON.stringify(rev.categories || []),
                            false,
                            new Date(rev.date)
                        ]
                    );
                    revCount++;
                }
            }
            console.log(`✅ Migrated ${revCount} reviews.`);
        } catch (e) {
            console.warn('⚠️ reviews.json not found or empty.');
        }

        // 3. Migrate Destinations (from destinations-data.json)
        const destPath = path.join(__dirname, '..', 'src', 'data', 'destinations-data.json');
        try {
            const destData = JSON.parse(await fs.readFile(destPath, 'utf8'));
            let destCount = 0;
            if (destData.attractions) {
                for (const dest of destData.attractions) {
                    const [rows] = await connection.execute('SELECT id FROM destinations WHERE id = ?', [dest.id]);
                    if (rows.length === 0) {
                        await connection.execute(
                            'INSERT INTO destinations (id, slug, name, description, image, category, district, highlights, categories) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                            [
                                dest.id,
                                dest.id, // Using ID as slug initially
                                dest.name,
                                dest.description,
                                dest.image,
                                dest.categories?.[0] || 'General',
                                dest.district,
                                JSON.stringify(dest.highlights || []),
                                JSON.stringify(dest.categories || [])
                            ]
                        );
                        destCount++;
                    }
                }
                console.log(`✅ Migrated ${destCount} destinations.`);
            }
        } catch (e) {
            console.warn('⚠️ destinations-data.json not found.', e);
        }

        // 4. Migrate Tours
        if (contentData.tours) {
            let tourCount = 0;
            for (const tour of contentData.tours) {
                const [rows] = await connection.execute('SELECT id FROM tours WHERE id = ?', [tour.id]);
                if (rows.length === 0) {
                    await connection.execute(
                        'INSERT INTO tours (id, slug, title, duration, price, image, category, rating, reviews, description, highlights, itinerary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [
                            tour.id,
                            tour.slug || tour.id,
                            tour.title,
                            tour.duration,
                            tour.price,
                            tour.image,
                            tour.category,
                            tour.rating || 5.0,
                            tour.reviews || 0,
                            tour.description,
                            JSON.stringify(tour.highlights || []),
                            JSON.stringify(tour.itinerary || [])
                        ]
                    );
                    tourCount++;
                }
            }
            console.log(`✅ Migrated ${tourCount} tours.`);
        }

        // 5. Migrate Blog Posts
        if (contentData.posts) {
            let postCount = 0;
            for (const post of contentData.posts) {
                const [rows] = await connection.execute('SELECT id FROM posts WHERE id = ?', [post.id]);
                if (rows.length === 0) {
                    await connection.execute(
                        'INSERT INTO posts (id, slug, title, excerpt, content, image, author, date, category, readTime, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [
                            post.id,
                            post.slug || post.id,
                            post.title,
                            post.excerpt,
                            post.content,
                            post.image,
                            post.author,
                            new Date(post.date),
                            post.category,
                            post.readTime,
                            JSON.stringify(post.tags || [])
                        ]
                    );
                    postCount++;
                }
            }
            console.log(`✅ Migrated ${postCount} posts.`);
        }

        // 6. Migrate FAQ
        if (contentData.faq) {
            let faqCount = 0;
            for (const f of contentData.faq) {
                const [rows] = await connection.execute('SELECT id FROM faq WHERE id = ?', [f.id]);
                if (rows.length === 0) {
                    await connection.execute(
                        'INSERT INTO faq (id, question, answer, category) VALUES (?, ?, ?, ?)',
                        [
                            f.id,
                            f.question,
                            f.answer,
                            f.category || 'General'
                        ]
                    );
                    faqCount++;
                }
            }
            console.log(`✅ Migrated ${faqCount} FAQs.`);
        }

        // 7. Migrate Site Config
        if (contentData.siteConfig) {
            const [rows] = await connection.execute('SELECT id FROM site_config WHERE section_key = ?', ['main_config']);
            if (rows.length === 0) {
                await connection.execute(
                    'INSERT INTO site_config (id, section_key, value) VALUES (?, ?, ?)',
                    [
                        'config-main',
                        'main_config', // Using a generic key for the whole config object if easier, or split it
                        JSON.stringify(contentData.siteConfig)
                    ]
                );
                console.log('✅ Migrated Site Config.');
            }
        }

        if (contentData.siteConfig) {
            const [rows] = await connection.execute('SELECT id FROM site_config WHERE section_key = ?', ['main_config']);
            if (rows.length === 0) {
                await connection.execute(
                    'INSERT INTO site_config (id, section_key, value) VALUES (?, ?, ?)',
                    [
                        'config-main',
                        'main_config', // Using a generic key for the whole config object if easier, or split it
                        JSON.stringify(contentData.siteConfig)
                    ]
                );
                console.log('✅ Migrated Site Config.');
            }
        }

        // 8. Seed Gallery from Destinations & Tours
        let galleryCount = 0;
        const imageUrls = new Set();

        // Collect Images
        if (contentData.destinations) {
            contentData.destinations.forEach(d => {
                if (d.image) imageUrls.add({ url: d.image, title: d.name, category: d.category || 'Landscape' });
            });
        }
        if (contentData.attractions) { // Handle the other array if exists
            contentData.attractions.forEach(d => {
                if (d.image) imageUrls.add({ url: d.image, title: d.name, category: d.categories?.[0] || 'Landscape' });
            });
        }
        if (contentData.tours) {
            contentData.tours.forEach(t => {
                if (t.image) imageUrls.add({ url: t.image, title: t.title, category: 'Tour' });
            });
        }

        for (const img of imageUrls) {
            const [rows] = await connection.execute('SELECT id FROM gallery_images WHERE url = ?', [img.url]);
            if (rows.length === 0) {
                await connection.execute(
                    'INSERT INTO gallery_images (id, url, title, category, featured) VALUES (?, ?, ?, ?, ?)',
                    [
                        `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        img.url,
                        img.title,
                        img.category,
                        Math.random() < 0.2 // Randomly feature 20%
                    ]
                );
                galleryCount++;
            }
        }
        console.log(`✅ Seeded ${galleryCount} gallery images.`);

        console.log('🎉 Migration complete!');

    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await connection.end();
    }
}

migrateData();
