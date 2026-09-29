import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// A pool (not a single connection) so multiple requests can query
// concurrently without blocking each other.
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'habit_tracker',
  waitForConnections: true,
  connectionLimit: 10
});
