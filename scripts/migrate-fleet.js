const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Connected to database.');

        // Create Table
        const schema = `
        CREATE TABLE IF NOT EXISTS fleet (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255),
            type VARCHAR(50),
            passengers INT,
            price INT,
            image VARCHAR(255),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        await connection.query(schema);
        console.log('Fleet table created.');

        // Load Content
        const contentPath = path.join(__dirname, '../src/data/content.json');
        const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

        if (content.fleet && content.fleet.length > 0) {
            console.log(`Migrating ${content.fleet.length} vehicles...`);
            for (const v of content.fleet) {
                await connection.query(
                    `INSERT INTO fleet (id, name, type, passengers, price, image, description)
                     VALUES (?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE name=VALUES(name)`,
                    [v.id, v.name, v.type, v.passengers, v.price, v.image, v.description || '']
                );
            }
            console.log('Migration complete.');
        } else {
            console.log('No fleet data to migrate.');
        }

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await connection.end();
    }
}

migrate();
