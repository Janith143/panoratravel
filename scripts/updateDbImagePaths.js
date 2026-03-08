const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function fixDatabaseImagePaths() {
    console.log("Connecting to the database...");
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    });

    try {
        console.log("Updating 'tours' table image paths to .webp...");
        // Tours: image column
        await db.query("UPDATE tours SET image = REPLACE(image, '.jpg', '.webp') WHERE image LIKE '%.jpg'");
        await db.query("UPDATE tours SET image = REPLACE(image, '.jpeg', '.webp') WHERE image LIKE '%.jpeg'");
        await db.query("UPDATE tours SET image = REPLACE(image, '.png', '.webp') WHERE image LIKE '%.png'");

        // Tours: image_gallery column (if exists, storing JSON or comma separated strings)
        // We do a simple REPLACE on the whole string for the gallery as well.
        try {
            await db.query("UPDATE tours SET image_gallery = REPLACE(image_gallery, '.jpg', '.webp') WHERE image_gallery LIKE '%.jpg%'");
            await db.query("UPDATE tours SET image_gallery = REPLACE(image_gallery, '.jpeg', '.webp') WHERE image_gallery LIKE '%.jpeg%'");
            await db.query("UPDATE tours SET image_gallery = REPLACE(image_gallery, '.png', '.webp') WHERE image_gallery LIKE '%.png%'");
        } catch (e) {
            console.log("No image_gallery column in tours or error updating it.");
        }

        console.log("Updating 'site_config' table values to .webp...");
        // Site Config: value column (often stores JSON containing image paths)
        await db.query("UPDATE site_config SET value = REPLACE(value, '.jpg', '.webp') WHERE value LIKE '%.jpg%'");
        await db.query("UPDATE site_config SET value = REPLACE(value, '.jpeg', '.webp') WHERE value LIKE '%.jpeg%'");
        await db.query("UPDATE site_config SET value = REPLACE(value, '.png', '.webp') WHERE value LIKE '%.png%'");

        console.log("Successfully updated all .jpg, .jpeg, and .png database references to .webp!");

    } catch (error) {
        console.error("Error executing database updates:", error);
    } finally {
        await db.end();
        console.log("Database connection closed.");
    }
}

fixDatabaseImagePaths();
