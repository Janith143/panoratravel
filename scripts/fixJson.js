const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function fixJSON() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    });

    try {
        const [rows] = await connection.query('SELECT id, value FROM site_config WHERE section_key="main_config"');
        if (rows.length > 0) {
            let row = rows[0];
            let valueStr = typeof row.value === 'string' ? row.value : JSON.stringify(row.value);

            // Do a simple string replace on the JSON string representation
            valueStr = valueStr.replace(/\.jpg/g, '.webp');
            valueStr = valueStr.replace(/\.jpeg/g, '.webp');
            valueStr = valueStr.replace(/\.png/g, '.webp');

            // Update back
            console.log("Saving back updated JSON...");
            await connection.query('UPDATE site_config SET value = ? WHERE id = ?', [valueStr, row.id]);
            console.log("Updated site_config successfully!");
        }
    } catch (e) {
        console.error(e);
    } finally {
        await connection.end();
    }
}

fixJSON();
