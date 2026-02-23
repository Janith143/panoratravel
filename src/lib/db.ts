import mysql from 'mysql2/promise';

// Helper to strip quotes if the environment variable has them
const dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/^["']|["']$/g, '') : undefined;

const pool = mysql.createPool(
    (dbUrl || {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '', // Default XAMPP password
        database: process.env.DB_NAME || 'panora_paths',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }) as any
);

export default pool;
