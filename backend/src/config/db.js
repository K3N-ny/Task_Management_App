import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'task_management',
  password: process.env.DB_PASSWORD || 'postgres', // Change this to your PostgreSQL password
  port: process.env.DB_PORT || 5432,
});

export default pool; 