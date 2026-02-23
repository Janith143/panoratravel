const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateSchema() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: 'panora_paths',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
    });

    try {
        console.log('🔌 Connected to MySQL server.');

        // Add mapData column if it doesn't exist
        try {
            await connection.query(`
        ALTER TABLE destinations
        ADD COLUMN mapData JSON
      `);
            console.log('✅ Added `mapData` column to `destinations`.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ `mapData` column already exists.');
            } else {
                console.error('❌ Error adding `mapData`:', err.message);
            }
        }

        // Add categories column if it doesn't exist
        try {
            await connection.query(`
        ALTER TABLE destinations
        ADD COLUMN categories JSON
      `);
            console.log('✅ Added `categories` column to `destinations`.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ `categories` column already exists.');
            } else {
                console.error('❌ Error adding `categories`:', err.message);
            }
        }

        // Create Fleet Table
        try {
            await connection.query(`
        CREATE TABLE IF NOT EXISTS fleet (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(255),
          type VARCHAR(50),
          passengers INT,
          price INT,
          image VARCHAR(255),
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
            console.log('✅ Table `fleet` created/checked.');
        } catch (err) {
            console.error('❌ Error creating `fleet` table:', err.message);
        }

        console.log('🎉 Schema update complete!');
    } catch (err) {
        console.error('❌ Connection error:', err);
    } finally {
        await connection.end();
    }
}

updateSchema();
