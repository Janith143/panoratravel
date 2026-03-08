const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' }); // Or .env depending on server setup

async function syncToursToDb() {
    try {
        console.log("Connecting to database:", process.env.DB_HOST, "Database:", process.env.DB_NAME);
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // 1. Create the tours table if it doesn't exist or is missing columns
        console.log("Ensuring 'tours' table schema...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tours (
                id VARCHAR(50) PRIMARY KEY,
                slug VARCHAR(255) UNIQUE,
                title VARCHAR(255),
                duration VARCHAR(50),
                price VARCHAR(50),
                image VARCHAR(255),
                category VARCHAR(100),
                rating FLOAT DEFAULT 5.0,
                reviews INT DEFAULT 0,
                description TEXT,
                highlights JSON,
                itinerary JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check if slug column exists (in case it was an older schema)
        try {
            await pool.query('ALTER TABLE tours ADD COLUMN slug VARCHAR(255) UNIQUE');
            console.log("Added missing 'slug' column to tours table.");
        } catch (e) {
            // Error usually means column already exists, which is fine
        }

        // 2. Read content.json
        const contentPath = path.join(__dirname, '..', 'src', 'data', 'content.json');
        console.log("Reading content.json from:", contentPath);
        const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

        if (!content.tours || content.tours.length === 0) {
            console.log("No tours found in content.json to sync.");
            process.exit(0);
        }

        console.log(`Found ${content.tours.length} tours in content.json. Syncing to DB...`);

        // 3. Insert / Update Tours
        for (const tour of content.tours) {
            const id = tour.id;
            const slug = tour.slug || id;

            await pool.query(
                `INSERT INTO tours (id, slug, title, duration, price, image, category, rating, reviews, description, highlights, itinerary)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                 title = VALUES(title), duration = VALUES(duration), price = VALUES(price), image = VALUES(image),
                 category = VALUES(category), rating = VALUES(rating), reviews = VALUES(reviews), description = VALUES(description),
                 highlights = VALUES(highlights), itinerary = VALUES(itinerary)`,
                [
                    id, slug, tour.title, tour.duration, tour.price, tour.image,
                    tour.category, tour.rating || 5, tour.reviews || 0, tour.description,
                    JSON.stringify(tour.highlights || []), JSON.stringify(tour.itinerary || [])
                ]
            );
        }

        console.log("✅ Successfully synchronized all tours to the Database!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Sync Error:", error);
        process.exit(1);
    }
}

syncToursToDb();
