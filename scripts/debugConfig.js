const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function debug() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    });

    const [rows] = await connection.query('SELECT value FROM site_config WHERE section_key="main_config"');
    if (rows.length > 0) {
        console.log("Raw DB Value:", rows[0].value);
    }
    await connection.end();
}

debug().catch(console.error);
