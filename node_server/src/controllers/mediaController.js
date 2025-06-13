// import * as model from '../models/mediaModel.js';
// import * as aiService from '../services/aiService.js';
// import { createClient } from "@supabase/supabase-js";

// // ----- Initialize Supabase client -----
// const supabase = createClient(
//   process.env.DB_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY, 
//   {
//     auth: {
//       autoRefreshToken: false,
//       persistSession: false
//     }
//   }
// );

// // convert text prompts to image using Google GenAI
// export const convertTextToImage = async (req, res, next) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: 'Prompt is missing!' });
//     }

//     const response = await aiService.textToImage(prompt);
//     if (!response) {
//       return res.status(500).json({ error: 'Failed to generate image' });
//     }

//     res.locals.imageResponse = response;
//     next();
//   } catch (error) {
//     console.error('Error in mediaController:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// // convert text to prompts to video using runway ai
// export const convertTextToVideo = async (req, res, next) => {
//   try {
//     const { prompt } = req.body;
//     const imageUrl = res.locals.imageUrl;
//     if (!prompt) {
//       console.log('IMAGE URL NOT FOUND!!!!!');
//       return res.status(400).json({ error: 'Prompt is missing!' });
//     }

//     const response = await aiService.textToVideo(prompt, imageUrl);
//     if (!response) {
//       return res.status(500).json({ error: 'Failed to generate video' });
//     }
//     console.log('Video URL:', response);

//     res.locals.video_url = response;
//     next();
//   } catch (error) {
//     console.error('Error in convertTextToVideo Controller:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }


// // Function to upload image in supabase
// export const uploadImage = async (req, res) => {
//   try {
//     const { imageResponse } = res.locals;
//     const { prompt } = req.body;

//     let response;

//     for (const part of imageResponse.candidates[0].content.parts) {
//       if(part.text) {
//         console.log('Text found:', part.text);
//       } 
//       else if (part.inlineData) {
//         const imageData = part.inlineData.data;
//         const buffer = Buffer.from(imageData, 'base64');
//         const fileName = `image-${Date.now()}.png`;

//         // Use supabase client to for storage upload
//         const { data, error } = await supabase.storage
//           .from('generated-media')
//           .upload(fileName, buffer, {
//             contentType: 'image/png',
//             cacheControl: '3600'
//           });

//         if (error) {
//           throw new Error (`Upload failed: ${error.message}`);
//         }

//         // Get public URL
//         const { data: urlData } = supabase.storage
//           .from('generated-media')
//           .getPublicUrl(fileName);

//         const image_url = urlData.publicUrl;
//         console.log('Image uploaded successfully:', image_url);
//         const media_type = 'image';
//         const tag_id = 1;
//         response = await model.saveImage(image_url, prompt, fileName, media_type, tag_id);
//       }
//     }

//     if(response) {
//       res.status(200).json({
//         message: 'Image uploaded successfully',
//         imageUrl: response.media_url,  // Updated to use correct property name
//         prompt: response.prompt,
//         fileName: response.filename     // Updated to use correct property name
//       })
//     } else {
//       res.status(500).json({ error: 'Failed to save image data' });
//     }

//   } catch (error) {
//     console.error('Error in uploadMedia:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// // Function to upload video in supabase
// export const uploadVideo = async (req, res) => {
//   try {
//     const { video_url } = res.locals;
//     const { prompt } = req.body;

//     const fileName = `video-${Date.now()}`;
//     const media_type = 'video';
//     const tag_id = 1;

//     const response = await model.saveVideo(video_url, prompt, fileName, media_type, tag_id);

//     if(response) {
//       res.status(200).json({
//         message: 'Video uploaded successfully',
//         imageUrl: response.media_url,  // Updated to use correct property name
//         prompt: response.prompt,
//         fileName: response.filename     // Updated to use correct property name
//       })
//     } else {
//       res.status(500).json({ error: 'Failed to save video data' });
//     }
//   } catch (error) {
//     console.error('Error in uploadVideo:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// // Function to get all the images
// export const fetchALlImages = async (req, res) => {
//   try {
//     const response = await model.getAllImages();
//     if (response && response.rows.length > 0) {
//       res.status(200).json({
//         message: 'Images fetched successfully',
//         images: response.rows
//       });
//     } else {
//       res.status(404).json({ message: 'No images found' });
//     }
//   } catch (error) {
//     console.error('Error in fetchImages:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// // Function to get all the videos
// export const fetchAllVideos = async (req, res) => {
//   try {
//     const response = await model.getAllVideos();
//     if (response && response.rows.length > 0) {
//       res.status(200).json({
//         message: 'Videos fetched successfully',
//         videos: response.rows
//       });
//     } else {
//       res.status(404).json({ message: 'No videos found' });
//     }
//   } catch (error) {
//     console.error('Error in fetchVideos:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// export const fetchMediaUrlById = async (req, res, next) => {
//   try {
//     const { imageId } = req.body;
//     if (!imageId) {
//       return res.status(400).json({ error: 'Media ID is required' });
//     }

//     const imageUrl = await model.getMediaUrlById(imageId);
//     if (imageUrl) {
//       res.locals.imageUrl = imageUrl
//       next();
//     } else {
//       res.status(404).json({ message: 'Media not found' });
//     }
//   } catch (error) {
//     console.error('Error in fetchMediaUrlById:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

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

    // Create progress callback for image generation
    const onProgress = (message) => {
      console.log('Image generation progress:', message);
    };

    const response = await aiService.textToImage(prompt, onProgress);
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

// convert text prompts to video using runway ai
export const convertTextToVideo = async (req, res, next) => {
  try {
    const { prompt, imageId } = req.body; // Now expect imageId instead of getting from locals
    const imageUrl = res.locals.imageUrl;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is missing!' });
    }

    // Simple progress callback for logging
    const onProgress = (message, attempts, maxAttempts) => {
      console.log(`Video progress: ${message} (${attempts}/${maxAttempts})`);
    };

    const response = await aiService.textToVideo(prompt, imageUrl, onProgress);
    if (!response) {
      return res.status(500).json({ error: 'Failed to generate video' });
    }
    console.log('Video URL:', response);

    res.locals.video_url = response;
    res.locals.parent_media_id = imageId; // Store parent ID for saving
    next();
  } catch (error) {
    console.error('Error in mediaController:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// NEW: convert text to video with SSE progress tracking
export const convertTextToVideoWithProgress = async (req, res) => {
  try {
    const { prompt, imageId } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is missing!' });
    }

    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Progress callback that sends updates to client
    const onProgress = (message, attempts = 0, maxAttempts = 300) => {
      const progress = Math.min(Math.round((attempts / maxAttempts) * 100), 99);
      const progressData = {
        message,
        progress,
        attempts,
        maxAttempts,
        stage: attempts === 0 ? 'start' : attempts >= maxAttempts ? 'complete' : 'processing'
      };
      
      res.write(`data: ${JSON.stringify(progressData)}\n\n`);
      console.log('Video generation progress:', progressData);
    };

    try {
      // Get image URL if imageId provided
      let imageUrl = null;
      if (imageId) {
        imageUrl = await model.getMediaUrlById(imageId);
        if (!imageUrl) {
          throw new Error('Base image not found');
        }
        console.log('Using base image URL:', imageUrl);
      }

      // Start video generation with progress tracking
      onProgress('🎬 Starting video generation...', 0);
      
      const videoUrl = await aiService.textToVideo(prompt, imageUrl, onProgress);
      
      // Save to database with parent relationship
      const fileName = `video-${Date.now()}`;
      const media_type = 'video';
      const tag_id = 1;

      const dbResponse = await model.saveVideo(videoUrl, prompt, fileName, media_type, tag_id, imageId);

      // Send completion event
      const completionData = {
        message: '✅ Video generated successfully!',
        progress: 100,
        stage: 'complete',
        result: {
          imageUrl: dbResponse.media_url,
          prompt: dbResponse.prompt,
          fileName: dbResponse.filename,
          parentId: imageId
        }
      };
      
      res.write(`data: ${JSON.stringify(completionData)}\n\n`);
      res.write(`event: complete\ndata: ${JSON.stringify(completionData.result)}\n\n`);
      
    } catch (error) {
      console.error('Error in video generation:', error);
      const errorData = {
        message: `❌ Error: ${error.message}`,
        progress: 0,
        stage: 'error',
        error: error.message
      };
      res.write(`data: ${JSON.stringify(errorData)}\n\n`);
      res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('Error in convertTextToVideoWithProgress:', error);
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
        imageUrl: response.media_url,
        prompt: response.prompt,
        fileName: response.filename,
        mediaId: response.media_id // Include media_id for future video generation
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
    const { video_url, parent_media_id } = res.locals;
    const { prompt } = req.body;

    const fileName = `video-${Date.now()}`;
    const media_type = 'video';
    const tag_id = 1;

    const response = await model.saveVideo(video_url, prompt, fileName, media_type, tag_id, parent_media_id);

    if(response) {
      res.status(200).json({
        message: 'Video uploaded successfully',
        imageUrl: response.media_url,
        prompt: response.prompt,
        fileName: response.filename,
        parentId: parent_media_id
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

// NEW: Function to get videos by parent image ID
export const fetchVideosByParentId = async (req, res) => {
  try {
    const { parentId } = req.params;
    
    if (!parentId) {
      return res.status(400).json({ error: 'Parent ID is required' });
    }

    const videos = await model.getVideosByParentId(parentId);
    
    res.status(200).json({
      message: 'Videos fetched successfully',
      videos: videos,
      parentId: parentId
    });
  } catch (error) {
    console.error('Error in fetchVideosByParentId:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// NEW: Function to get media hierarchy (images with their videos)
export const fetchMediaHierarchy = async (req, res) => {
  try {
    const response = await model.getMediaHierarchy();
    if (response && response.rows.length > 0) {
      res.status(200).json({
        message: 'Media hierarchy fetched successfully',
        hierarchy: response.rows
      });
    } else {
      res.status(404).json({ message: 'No media found' });
    }
  } catch (error) {
    console.error('Error in fetchMediaHierarchy:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const fetchMediaUrlById = async (req, res, next) => {
  try {
    const { imageId } = req.body;
    if (!imageId) {
      return res.status(400).json({ error: 'Media ID is required' });
    }

    const imageUrl = await model.getMediaUrlById(imageId);
    if (imageUrl) {
      res.locals.imageUrl = imageUrl
      next();
    } else {
      res.status(404).json({ message: 'Media not found' });
    }
  } catch (error) {
    console.error('Error in fetchMediaUrlById:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}