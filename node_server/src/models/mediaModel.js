import pool from '../services/db.js';

export const saveImage = async (image_url, prompt, fileName, media_type, tag_id) => {
  try {
    // Create a unique media_name using prompt and timestamp to avoid duplicates
    const timestamp = Date.now();
    const media_name = `${prompt}_${timestamp}`;
    
    const query = `INSERT INTO generated_media (media_url, media_name, prompt, filename, media_type, tag_id)
                   VALUES ($1, $2, $3, $4, $5, $6)
                   RETURNING *;`;

    const values = [image_url, media_name, prompt, fileName, media_type, tag_id];
    
    console.log('Saving image with values:', {
      image_url,
      media_name,
      prompt,
      fileName,
      media_type,
      tag_id
    });
    
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}

export const saveVideo = async (video_url, prompt, fileName, media_type, tag_id, parent_media_id = null) => {
  try {
    const timestamp = Date.now();
    const media_name = `${prompt}_${timestamp}`;
    
    const query = `INSERT INTO generated_media (media_url, media_name, prompt, filename, media_type, tag_id, parent_media_id)
                   VALUES ($1, $2, $3, $4, $5, $6, $7)
                   RETURNING *;`;

    const values = [video_url, media_name, prompt, fileName, media_type, tag_id, parent_media_id];
    
    console.log('Saving video with values:', {
      video_url,
      media_name,
      prompt,
      fileName,
      media_type,
      tag_id,
      parent_media_id
    });
    
    const result = await pool.query(query, values);
    return result.rows[0];  
  } catch (error) {
    console.error('Error saving video:', error);
    throw error;
  }
}

export const getMediaUrlById = async (mediaId) => {
  try {
    const query = `SELECT media_url FROM generated_media WHERE media_id = $1;`;
    const result = await pool.query(query, [mediaId]);
    
    if (result.rows.length > 0) {
      return result.rows[0].media_url;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching media URL by ID:', error);
    throw error;
  }
}

export const getAllImages = async () => {
  try {
    const query = `SELECT * FROM generated_media 
                  WHERE media_type = 'image' 
                  ORDER BY created_at DESC;`;

    const result = await pool.query(query);
    return result;
  } catch (error) {
    console.error('Error fetching all images:', error);
    throw error;
  }
}

export const getAllVideos = async () => {
  try {
    const query = `SELECT * FROM generated_media 
                  WHERE media_type = 'video' 
                  ORDER BY created_at DESC;`;

    const result = await pool.query(query);
    return result;
  } catch (error) {
    console.error('Error fetching all videos:', error);
    throw error;
  }
}

export const getVideosByParentId = async (parentMediaId) => {
  try {
    const query = `SELECT * FROM generated_media 
                  WHERE media_type = 'video' 
                  AND parent_media_id = $1 
                  ORDER BY created_at DESC;`;

    const result = await pool.query(query, [parentMediaId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching videos by parent ID:', error);
    throw error;
  }
}

export const getImagesWithVideoCount = async () => {
  try {
    const query = `
      SELECT 
        i.*,
        COALESCE(v.video_count, 0) as video_count
      FROM generated_media i
      LEFT JOIN (
        SELECT 
          parent_media_id, 
          COUNT(*) as video_count
        FROM generated_media 
        WHERE media_type = 'video' 
        AND parent_media_id IS NOT NULL
        GROUP BY parent_media_id
      ) v ON i.media_id = v.parent_media_id
      WHERE i.media_type = 'image'
      ORDER BY i.created_at DESC;
    `;

    const result = await pool.query(query);
    return result;
  } catch (error) {
    console.error('Error fetching images with video count:', error);
    throw error;
  }
}

export const getMediaHierarchy = async () => {
  try {
    const query = `
      SELECT 
        i.media_id,
        i.media_name,
        i.media_url,
        i.filename,
        i.created_at,
        i.prompt,
        i.media_type,
        JSON_AGG(
          CASE 
            WHEN v.media_id IS NOT NULL THEN
              JSON_BUILD_OBJECT(
                'media_id', v.media_id,
                'media_name', v.media_name,
                'media_url', v.media_url,
                'filename', v.filename,
                'created_at', v.created_at,
                'prompt', v.prompt,
                'media_type', v.media_type
              )
            ELSE NULL
          END
        ) FILTER (WHERE v.media_id IS NOT NULL) as videos
      FROM generated_media i
      LEFT JOIN generated_media v ON i.media_id = v.parent_media_id AND v.media_type = 'video'
      WHERE i.media_type = 'image'
      GROUP BY i.media_id, i.media_name, i.media_url, i.filename, i.created_at, i.prompt, i.media_type
      ORDER BY i.created_at DESC;
    `;

    const result = await pool.query(query);
    return result;
  } catch (error) {
    console.error('Error fetching media hierarchy:', error);
    throw error;
  }
}
