import * as model from '../models/mediaModel.js';
import * as aiService from '../services/aiService.js';
import { createClient } from "@supabase/supabase-js";

// ----- Initialize Supabase client -----
const supabase = createClient(
  process.env.DB_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// convert text prompts to image using Google GenAI
export const convertTextToImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is missing!' });
    }

    const response = await aiService.textToImage(prompt);
    if (!response) {
      return res.status(500).json({ error: 'Failed to generate image' });
    }

    res.locals.imageResponse = response;
    next();
  } catch (error) {
    console.error('Error in mediaController:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// convert text to prompts to video using runway ai
export const convertTextToVideo = async (req, res, next) => {
  try {
    const { prompt, imageUrl } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is missing!' });
    }

    const response = await aiService.textToVideo(prompt, imageUrl);
    if (!response) {
      return res.status(500).json({ error: 'Failed to generate video' });
    }

    res.locals.video_url = response.videoUrl;
    next();
  } catch (error) {
    console.error('Error in mediaController:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Function to upload image in supabase
export const uploadImage = async (req, res) => {
  try {
    const { imageResponse } = res.locals;
    const { prompt } = req.body;

    let response;

    for (const part of imageResponse.candidates[0].content.parts) {
      if(part.text) {
        console.log('Text found:', part.text);
      } 
      else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, 'base64');
        const fileName = `image-${Date.now()}.png`;

        // Use supabase client to for storage upload
        const { data, error } = await supabase.storage
          .from('generated-media')
          .upload(fileName, buffer, {
            contentType: 'image/png',
            cacheControl: '3600'
          });

        if (error) {
          throw new Error (`Upload failed: ${error.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('generated-media')
          .getPublicUrl(fileName);

        const image_url = urlData.publicUrl;
        console.log('Image uploaded successfully:', image_url);
        const media_type = 'image';
        const tag_id = 1;
        response = await model.saveImage(image_url, prompt, fileName, media_type, tag_id);
      }
    }

    if(response) {
      res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: response.media_url,  // Updated to use correct property name
        prompt: response.prompt,
        fileName: response.filename     // Updated to use correct property name
      })
    } else {
      res.status(500).json({ error: 'Failed to save image data' });
    }

  } catch (error) {
    console.error('Error in uploadMedia:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Function to upload video in supabase
export const uploadVideo = async (req, res) => {
  try {
    const { video_url } = res.locals;
    const { prompt } = req.body;

    const fileName = `video-${Date.now()}`;
    const media_type = 'video';
    const tag_id = 1;

    const response = await model.saveVideo(video_url, prompt, fileName, media_type, tag_id);

    if(response) {
      res.status(200).json({
        message: 'Video uploaded successfully',
        imageUrl: response.media_url,  // Updated to use correct property name
        prompt: response.prompt,
        fileName: response.filename     // Updated to use correct property name
      })
    } else {
      res.status(500).json({ error: 'Failed to save video data' });
    }
  } catch (error) {
    console.error('Error in uploadVideo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Function to get all the images
export const fetchALlImages = async (req, res) => {
  try {
    const response = await model.getAllImages();
    if (response && response.rows.length > 0) {
      res.status(200).json({
        message: 'Images fetched successfully',
        images: response.rows
      });
    } else {
      res.status(404).json({ message: 'No images found' });
    }
  } catch (error) {
    console.error('Error in fetchImages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Function to get all the videos
export const fetchAllVideos = async (req, res) => {
  try {
    const response = await model.getAllVideos();
    if (response && response.rows.length > 0) {
      res.status(200).json({
        message: 'Videos fetched successfully',
        videos: response.rows
      });
    } else {
      res.status(404).json({ message: 'No videos found' });
    }
  } catch (error) {
    console.error('Error in fetchVideos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}