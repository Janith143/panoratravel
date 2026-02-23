import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
    const diagnostics: any = {
        env: {
            NODE_ENV: process.env.NODE_ENV,
            HAS_DB_URL: !!process.env.DATABASE_URL,
            DB_HOST: process.env.DB_HOST,
            DB_USER: process.env.DB_USER,
            DB_NAME: process.env.DB_NAME,
            NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            HAS_NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
        },
        dbConnection: 'Pending'
    }

    try {
        // Test Database Connection
        const [rows] = await pool.query('SELECT 1 as result')
        diagnostics.dbConnection = 'Success'
        diagnostics.dbResult = rows
    } catch (error: any) {
        diagnostics.dbConnection = 'Failed'
        diagnostics.dbError = {
            message: error.message,
            code: error.code,
            errno: error.errno,
            state: error.sqlState
        }
    }

    return NextResponse.json(diagnostics)
}
