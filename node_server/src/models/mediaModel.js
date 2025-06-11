import pool from '../services/db.js';

export const saveImage = async (image_url, prompt, fileName, media_type, tag_id) => {
  try {
    const query = `INSERT INTO generated_media (media_url, prompt, filename, media_type, tag_id)
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *;`;

    const values = [image_url, prompt, fileName, media_type, tag_id];
    
    const result = await pool.query(query, values);
    return result;  
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }

}