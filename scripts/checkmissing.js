const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function search() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    });

    const [tables] = await connection.query('SHOW TABLES');

    for (const t of tables) {
        const tableName = Object.values(t)[0];
        const [columns] = await connection.query(`SHOW COLUMNS FROM ??`, [tableName]);

        for (const col of columns) {
            if (col.Type.includes('varchar') || col.Type.includes('text') || col.Type.includes('json')) {
                const [rows] = await connection.query(`SELECT * FROM ?? WHERE ?? LIKE ?`, [tableName, col.Field, '%Generate_a_bright_2k_202602222236__2_%']);
                if (rows.length > 0) {
                    console.log(`Found image in table ${tableName}, column ${col.Field}:`, rows.length, 'rows');
                    console.log(rows);
                }
            }
        }
    }
    await connection.end();
}

search().catch(console.error);
