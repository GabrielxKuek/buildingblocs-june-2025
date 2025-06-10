import dotenv from 'dotenv';
import pkg from 'pg';

const { Pool } = pkg;

// config the dotenv
dotenv.config();

// Configure PostgreSQL connection from environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});


// Export the pool for use in other modules
export default pool;
