import pool from '../services/db.js';

export const testModel = async (username) => {
  try {
    const query = 'SELECT * FROM "users" WHERE username = $1';
    const values = [username];
    
    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }

}