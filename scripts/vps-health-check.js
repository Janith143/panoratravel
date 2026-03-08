const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function healthCheck() {
    console.log("--- Panora-Paths VPS Health Check ---");
    const rootDir = process.cwd();
    console.log(`Current Working Directory: ${rootDir}`);

    // 1. Environment Check
    const envPath = fs.existsSync(path.join(rootDir, '.env.local')) ? '.env.local' : '.env.production';
    console.log(`Using environment file: ${envPath}`);
    require('dotenv').config({ path: path.join(rootDir, envPath) });

    // 2. Database Connection Check
    console.log(`Attempting Local DB Connection (${process.env.DB_USER}@${process.env.DB_HOST})...`);
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });
        console.log("✅ DB Connection: OK");

        const [tables] = await connection.query('SHOW TABLES');
        const tableList = tables.map(t => Object.values(t)[0]);
        console.log(`Found ${tableList.length} tables: ${tableList.join(', ')}`);

        if (tableList.includes('tours')) {
            const [columns] = await connection.query('DESCRIBE tours');
            console.log("Table 'tours' schema found.");
            // Check for specific columns we added/expect
            const hasItinerary = columns.some(c => c.Field === 'itinerary');
            const hasHighlights = columns.some(c => c.Field === 'highlights');
            console.log(`- itinerary column: ${hasItinerary ? 'PRESENT' : 'MISSING'}`);
            console.log(`- highlights column: ${hasHighlights ? 'PRESENT' : 'MISSING'}`);
        } else {
            console.log("❌ Table 'tours' is MISSING in DB.");
        }
        await connection.end();
    } catch (e) {
        console.error(`❌ DB Connection FAILED: ${e.message}`);
    }

    // 3. File Permissions Check
    const contentPath = path.join(rootDir, 'src', 'data', 'content.json');
    try {
        fs.accessSync(contentPath, fs.constants.W_OK);
        console.log(`✅ File Write Permissions (content.json): OK`);
    } catch (e) {
        console.error(`❌ File Write Permissions (content.json): FAILED - ${e.message}`);
    }

    // 4. Code Version Check (Checking if dynamic fixes are applied)
    const toursPagePath = path.join(rootDir, 'src', 'app', 'tours', 'page.tsx');
    if (fs.existsSync(toursPagePath)) {
        const content = fs.readFileSync(toursPagePath, 'utf-8');
        const isDynamic = content.includes("force-dynamic");
        console.log(`✅ Code Sync Check (/tours/page.tsx): ${isDynamic ? 'DYNAMIC (FIXED)' : 'STATIC (OUTDATED)'}`);
    } else {
        console.log("❌ Tours page file not found in src/app/tours/page.tsx");
    }

    console.log("--- Health Check Complete ---");
}

healthCheck();
