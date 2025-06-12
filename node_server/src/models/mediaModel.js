import pool from '../services/db.js';

// Function to save image in the database
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

// Function to save video in the database
export const saveVideo = async (video_url, prompt, fileName, media_type, tag_id) => {
  try {
    const query = `INSERT INTO generated_media (media_url, prompt, filename, media_type, tag_id)
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *;`;

    const values = [video_url, prompt, fileName, media_type, tag_id];
    
    const result = await pool.query(query, values);
    return result.rows[0];  
  } catch (error) {
    console.error('Error saving video:', error);
    throw error;
  }
}

export const getAllImages = async () => {
  try {
    const query = `SELECT media_id, media_url, media_name FROM generated_media 
                  WHERE media_type = 'image' 
                  ORDER BY created_at DESC;`;

    const result = await pool.query(query);
    return result;
  } catch (error) {
    console.error('Error fetching all images:', error);
    throw error;
  }
}


// Function to get all videos
export const getAllVideos = async () => {
  try {
    const query = `SELECT media_id, media_url, media_name FROM generated_media 
                  WHERE media_type = 'video' 
                  ORDER BY created_at DESC;`;

    const result = await pool.query(query);
    return result;
  }
  catch (error) {
    console.error('Error fetching all videos:', error);
    throw error;
  }
}

export const getMediaUrlById = async (id) => {
  try {
    const query = `SELECT media_url FROM generated_media WHERE media_id = $1;`;
    const values = [id];
    
    const result  = await pool.query(query, values);
    if (result.rows.length > 0) {
      return result.rows[0].media_url;
    } else {
      throw new Error('Media not found');
    }
  }
  catch (error) {
    console.error('Error fetching media URL by ID:', error);
    throw error;
  }
}