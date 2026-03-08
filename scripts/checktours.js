const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function check() {
    let connection;
    try {
        console.log("Connecting to the database at " + process.env.DB_HOST);
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        const [rows] = await connection.query('SELECT id, slug, title FROM tours ORDER BY created_at DESC');
        console.log("Tours in DB:");
        console.log(rows);

    } catch (e) {
        console.error(e);
    } finally {
        if (connection) await connection.end();
    }
}

check();
