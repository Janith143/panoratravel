import mysql from 'mysql2/promise';

// Hardcoded for Hostinger
const dbUrl = 'mysql://u117517986_panoratravels:Ican123++@localhost:3306/u117517986_panoratravels';

const pool = mysql.createPool(dbUrl as any);

export default pool;
