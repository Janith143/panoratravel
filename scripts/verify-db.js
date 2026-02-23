const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('Testing MySQL Connection...');
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'panora_paths'
        });
        console.log('✅ Connected successfully!');

        const [rows] = await connection.execute('SELECT 1 as val');
        console.log('✅ Query executed:', rows);

        await connection.end();
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        console.error('Full Error:', error);
    }
}

testConnection();
