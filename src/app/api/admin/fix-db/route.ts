import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
    try {
        const queries = [
            "ALTER TABLE fleet ADD COLUMN additionalKmRate INT DEFAULT 0;",
            "ALTER TABLE destinations ADD COLUMN mapData JSON;",
            "ALTER TABLE destinations ADD COLUMN categories JSON;",
            "ALTER TABLE gallery_images ADD COLUMN category VARCHAR(50);",
            "ALTER TABLE gallery_images ADD COLUMN width INT;",
            "ALTER TABLE gallery_images ADD COLUMN height INT;",
            "ALTER TABLE gallery_images ADD COLUMN featured BOOLEAN DEFAULT FALSE;",
            "ALTER TABLE reviews ADD COLUMN source VARCHAR(50) DEFAULT 'website';",
            "ALTER TABLE reviews ADD COLUMN isFeatured BOOLEAN DEFAULT FALSE;",
            "ALTER TABLE reviews ADD COLUMN image VARCHAR(255);",
            "ALTER TABLE reviews ADD COLUMN photos JSON;",
            "ALTER TABLE reviews ADD COLUMN categories JSON;",
            "ALTER TABLE faq ADD COLUMN category VARCHAR(50);"
        ];

        let results = [];
        for (const q of queries) {
            try {
                await pool.query(q);
                results.push(`Success: ${q}`);
            } catch (err: any) {
                // Ignore Duplicate column name errors
                if (err.code === 'ER_DUP_FIELDNAME') {
                    results.push(`Already exists (skipped): ${q}`);
                } else {
                    results.push(`Error on ${q}: ${err.message}`);
                }
            }
        }

        // Let's also enforce table creation just in case
        const createFormsTable = `
        CREATE TABLE IF NOT EXISTS inquiries (
            id VARCHAR(50) PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(50) DEFAULT 'pending',
            destinations JSON,
            vehicleType VARCHAR(50),
            vehicleCount INT DEFAULT 1,
            passengers INT DEFAULT 1,
            startDate VARCHAR(50),
            contact JSON,
            addons JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        try {
            await pool.query(createFormsTable);
            results.push('Checked inquiries table structure.');
        } catch (e: any) {
            results.push(`Error creating inquiries table: ${e.message}`);
        }

        return NextResponse.json({
            success: true,
            message: 'Database structure verified and successfully synced with Panther AI updates.',
            log: results
        });
    } catch (e: any) {
        return NextResponse.json({
            success: false,
            error: e.message
        }, { status: 500 });
    }
}
