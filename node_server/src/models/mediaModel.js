import pool from '../services/db.js';

// Function to save image in the database
export const saveImage = async (image_url, prompt, fileName, media_type, tag_id) => {
  try {
    // Updated to include media_name in the INSERT
    const query = `INSERT INTO generated_media (media_url, prompt, filename, media_type, tag_id, media_name)
                   VALUES ($1, $2, $3, $4, $5, $6)
                   RETURNING *;`;

    const values = [image_url, prompt, fileName, media_type, tag_id, prompt]; // Using prompt as media_name
    
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}

// Function to save video in the database
export const saveVideo = async (video_url, prompt, fileName, media_type, tag_id) => {
  try {
    // Updated to include media_name in the INSERT
    const query = `INSERT INTO generated_media (media_url, prompt, filename, media_type, tag_id, media_name)
                   VALUES ($1, $2, $3, $4, $5, $6)
                   RETURNING *;`;

    const values = [video_url, prompt, fileName, media_type, tag_id, prompt]; // Using prompt as media_name
    
    const result = await pool.query(query, values);
    return result.rows[0];  
  } catch (error) {
    console.error('Error saving video:', error);
    throw error;
  }
}

// Function to get all images - Updated to match actual table schema
export const getAllImages = async () => {
  try {
    // Using actual column names from your table
    const query = `SELECT media_id, media_name, media_url, prompt, filename, created_at 
                  FROM generated_media 
                  WHERE media_type = 'image' 
                  ORDER BY created_at DESC;`;

    const result = await pool.query(query);
    return result;
  } catch (error) {
    console.error('Error fetching all images:', error);
    throw error;
  }
}

// Function to get all videos - Updated to match actual table schema
export const getAllVideos = async () => {
  try {
    // Using actual column names from your table
    const query = `SELECT media_id, media_name, media_url, prompt, filename, created_at 
                  FROM generated_media 
                  WHERE media_type = 'video' 
                  ORDER BY created_at DESC;`;

    const result = await pool.query(query);
    return result;
  } catch (error) {
    console.error('Error fetching all videos:', error);
    throw error;
  }
}

// Additional helper function to get table schema info (for debugging)
export const getTableSchema = async () => {
  try {
    const query = `SELECT column_name, data_type, is_nullable 
                   FROM information_schema.columns 
                   WHERE table_name = 'generated_media' 
                   ORDER BY ordinal_position;`;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching table schema:', error);
    throw error;
  }
}