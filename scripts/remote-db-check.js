const mysql = require('mysql2/promise');

async function checkProductionDb() {
    const host = '72.60.195.110';
    const user = 'root';
    const passwords = ['Ican123ZXC++', 'Ican123ZXC'];
    const dbName = 'panora_paths';

    for (const password of passwords) {
        console.log(`Attempting connection to ${host} with password: ${password.substring(0, 3)}...`);
        let connection;
        try {
            connection = await mysql.createConnection({
                host: host,
                user: user,
                password: password,
                database: dbName,
                port: 3306,
                connectTimeout: 10000
            });
            console.log("✅ SUCCESS! Connected to production database.");

            const [tables] = await connection.query('SHOW TABLES');
            console.log("Tables in DB:", tables.map(t => Object.values(t)[0]));

            if (tables.some(t => Object.values(t)[0] === 'tours')) {
                const [columns] = await connection.query('DESCRIBE tours');
                console.log("Schema for 'tours' table:");
                console.table(columns);

                const [rows] = await connection.query('SELECT id, slug, title, category FROM tours ORDER BY created_at DESC LIMIT 5');
                console.log("Latest 5 tours in production DB:");
                console.log(rows);
            } else {
                console.log("❌ Table 'tours' does NOT exist in production DB.");
            }

            await connection.end();
            return; // Exit after first success
        } catch (e) {
            console.error(`❌ FAILED with password ${password.substring(0, 3)}...: ${e.message}`);
        }
    }
}

checkProductionDb();
