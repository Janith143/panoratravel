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
            // Only search string columns
            if (col.Type.includes('varchar') || col.Type.includes('text') || col.Type.includes('json')) {
                const [rows] = await connection.query(`SELECT * FROM ?? WHERE ?? LIKE ?`, [tableName, col.Field, '%driver.jpg%']);
                if (rows.length > 0) {
                    console.log(`Found in table ${tableName}, column ${col.Field}:`, rows.length, 'rows');
                }
            }
        }
    }

    // Also search simply for any .jpg
    let jpgCount = 0;
    for (const t of tables) {
        const tableName = Object.values(t)[0];
        const [columns] = await connection.query(`SHOW COLUMNS FROM ??`, [tableName]);
        for (const col of columns) {
            if (col.Type.includes('varchar') || col.Type.includes('text') || col.Type.includes('json')) {
                const [rows] = await connection.query(`SELECT * FROM ?? WHERE ?? LIKE ?`, [tableName, col.Field, '%.jpg%']);
                if (rows.length > 0) {
                    jpgCount++;
                    console.log(`There are still .jpg files in table ${tableName}, column ${col.Field}`);
                }
            }
        }
    }

    if (jpgCount === 0) console.log('No .jpg files remaining in the database!');
    await connection.end();
}

search().catch(console.error);
