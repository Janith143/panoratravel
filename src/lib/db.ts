import mysql from 'mysql2/promise';

// Hardcoded for Hostinger
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'u117517986_panoratravels',
    password: 'Ican123++',
    database: 'u117517986_panoratravels',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
