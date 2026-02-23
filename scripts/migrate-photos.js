const mysql = require('mysql2/promise');

async function migratePhotosColumn() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        database: 'panora_paths' // Explicitly select the database
    });

    try {
        console.log('🔌 Connected to MySQL server.');

        // Check if column exists first to avoid duplicates/errors
        const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'panora_paths' 
      AND TABLE_NAME = 'reviews' 
      AND COLUMN_NAME = 'photos';
    `);

        if (columns.length === 0) {
            console.log("⚠️ 'photos' column missing. Adding it now...");
            await connection.query(`ALTER TABLE reviews ADD COLUMN photos JSON;`);
            console.log("✅ 'photos' column added successfully!");
        } else {
            console.log("✅ 'photos' column already exists. No changes needed.");
        }

    } catch (err) {
        console.error('❌ Error updating table:', err);
    } finally {
        await connection.end();
    }
}

migratePhotosColumn();
