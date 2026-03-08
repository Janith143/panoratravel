const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function fixServerDatabase() {
    console.log("Connecting to the database...");
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        console.log("1. Updating 'tours' table image paths to .webp...");
        // Tours: 'image' column
        await connection.query("UPDATE tours SET image = REPLACE(image, '.jpg', '.webp') WHERE image LIKE '%.jpg'");
        await connection.query("UPDATE tours SET image = REPLACE(image, '.jpeg', '.webp') WHERE image LIKE '%.jpeg'");
        await connection.query("UPDATE tours SET image = REPLACE(image, '.png', '.webp') WHERE image LIKE '%.png'");

        // Tours: 'image_gallery' column
        try {
            await connection.query("UPDATE tours SET image_gallery = REPLACE(image_gallery, '.jpg', '.webp') WHERE image_gallery LIKE '%.jpg%'");
            await connection.query("UPDATE tours SET image_gallery = REPLACE(image_gallery, '.jpeg', '.webp') WHERE image_gallery LIKE '%.jpeg%'");
            await connection.query("UPDATE tours SET image_gallery = REPLACE(image_gallery, '.png', '.webp') WHERE image_gallery LIKE '%.png%'");
        } catch (e) {
            console.log("-> Checked image_gallery column.");
        }

        console.log("2. Updating 'site_config' table JSON values to .webp...");
        // Site Config contains stringified JSON, SQL REPLACE struggles with this in MySQL 5.7, so we do it via JS
        const [rows] = await connection.query('SELECT id, value FROM site_config');
        let configUpdates = 0;

        for (const row of rows) {
            if (row.value) {
                let valueStr = typeof row.value === 'string' ? row.value : JSON.stringify(row.value);

                if (valueStr.match(/\.(jpg|jpeg|png)/i)) {
                    // Do a string replace on the JSON string representation
                    valueStr = valueStr.replace(/\.jpg/gi, '.webp');
                    valueStr = valueStr.replace(/\.jpeg/gi, '.webp');
                    valueStr = valueStr.replace(/\.png/gi, '.webp');

                    // Save back
                    await connection.query('UPDATE site_config SET value = ? WHERE id = ?', [valueStr, row.id]);
                    configUpdates++;
                }
            }
        }
        console.log(`-> Updated ${configUpdates} row(s) in site_config successfully!`);

        console.log("All .jpg, .jpeg, and .png database references have been successfully converted to .webp!");

    } catch (error) {
        console.error("Error executing database updates:", error);
    } finally {
        if (connection) {
            await connection.end();
            console.log("Database connection closed.");
        }
    }
}

fixServerDatabase();
