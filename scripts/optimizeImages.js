const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const mysql = require('mysql2/promise');

const envPath = require('fs').existsSync(path.join(__dirname, '../.env.local'))
    ? path.join(__dirname, '../.env.local')
    : path.join(__dirname, '../.env.production');
require('dotenv').config({ path: envPath });

async function processImageDirectory(conn, baseDir, publicPathPrefix) {
    let convertedCount = 0;

    async function scan(currentDir) {
        let entries;
        try {
            entries = await fs.readdir(currentDir, { withFileTypes: true });
        } catch (e) {
            console.log(`Could not read dir: ${currentDir}`);
            return;
        }

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                await scan(fullPath);
            } else {
                const ext = path.extname(entry.name).toLowerCase();
                if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                    // It's a target image
                    const newName = entry.name.replace(new RegExp(`\\${ext}$`, 'i'), '.webp');
                    const newPath = path.join(currentDir, newName);

                    let needsConversion = true;
                    try {
                        await fs.access(newPath);
                        needsConversion = false;
                    } catch (e) { }

                    if (needsConversion) {
                        try {
                            console.log(`Converting ${fullPath} ...`);
                            await sharp(fullPath).webp({ quality: 80 }).toFile(newPath);
                            convertedCount++;
                        } catch (err) {
                            console.error(`Failed to convert ${fullPath}:`, err.message);
                        }
                    }
                }
            }
        }
    }
    await scan(baseDir);
    return convertedCount;
}

async function updateDatabaseRecords(conn) {
    let updatedCount = 0;

    // List of tables and columns to check (e.g., gallery_images.url)
    const tablesToUpdate = [
        { table: 'gallery_images', column: 'url' },
        { table: 'vehicles', column: 'image' },
        { table: 'blogs', column: 'banner' } // Add other tables if they have images, but these are most common
    ];

    for (const { table, column } of tablesToUpdate) {
        try {
            const [rows] = await conn.query(`SELECT id, ${column} FROM ?? WHERE ${column} LIKE '%.jpg' OR ${column} LIKE '%.jpeg' OR ${column} LIKE '%.png'`, [table]);
            for (const row of rows) {
                const oldUrl = row[column];
                if (!oldUrl) continue;

                // Replace extension with .webp
                const extMatch = oldUrl.match(/\.(jpg|jpeg|png)$/i);
                if (extMatch) {
                    const newUrl = oldUrl.replace(new RegExp(`\\${extMatch[0]}$`, 'i'), '.webp');
                    // Update in DB
                    await conn.query(`UPDATE ?? SET ?? = ? WHERE id = ?`, [table, column, newUrl, row.id]);
                    updatedCount++;
                }
            }
            console.log(`Updated ${rows.length} records in ${table}.${column}`);
        } catch (e) {
            console.log(`Skipping DB update for ${table}.${column} (might not exist): ${e.message}`);
        }
    }

    return updatedCount;
}

async function main() {
    console.log("Starting batch optimization...");

    let conn;
    try {
        console.log("Connecting to database at", process.env.DB_HOST);
        conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        const publicDir = path.join(__dirname, '../public');
        const converted = await processImageDirectory(conn, publicDir, '/');
        console.log(`File conversion complete. Processed ${converted} new images.`);

        const dbUpdated = await updateDatabaseRecords(conn);
        console.log(`Database update complete. Updated ${dbUpdated} records.`);
    } catch (e) {
        console.error("Critical error in script:", e);
    } finally {
        if (conn) await conn.end();
    }
}

main().catch(console.error);
