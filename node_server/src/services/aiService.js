// node_server/src/services/aiService.js - Fixed version

import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
import fetch, { Headers } from "node-fetch"; // Add this import

dotenv.config();

// Add Headers to global scope for older Node versions
if (!global.Headers) {
    global.Headers = Headers;
}

// Add fetch to global scope if needed (Node.js < 18)
if (!global.fetch) {
    global.fetch = fetch;
}

// Initialize Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Text to Image
export const textToImage = async (text) => {
    try {
        console.log('🎨 Starting Gemini image generation for:', text);
        
        const contents = `Create a clear, simple icon-style image representing "${text}" suitable for healthcare communication. The image should be clean, minimalist, and easily recognizable.`;

        // Set responseModalities to include "Image" so the model can generate an image
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: contents,
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        console.log('✅ Gemini API response received');
        return response;
        
    } catch (error) {
        console.error('❌ Error in textToImage:', error);
        throw new Error(`Gemini AI Error: ${error.message}`);
    }
};

// Text to Video (using external API)
export const textToVideo = async (text, onProgress = null) => {
  try {
    onProgress?.('🎬 Initializing video generation...');

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestBody = {
      key: process.env.STABLE_DIFFUSION_API_KEY,
      model_id: "cogvideox",
      prompt: text,
      negative_prompt: "blurry, low quality, pixelated, deformed, mutated, disfigured, bad anatomy, extra limbs, missing limbs, unrealistic motion, glitch, noisy, oversaturated, underexposed, overexposed, poor lighting, low contrast, unnatural colors, jpeg artifacts, watermark, text, signature, cut off, cropped, stretched, distorted face, bad proportions, duplicated limbs, broken body, grain, flickering, frame skipping, motion blur, unrealistic shadows, low detail, low resolution, compression artifacts, out of frame",
      height: 512,
      width: 512,
      num_frames: 81,
      num_inference_steps: 25,
      resolution: 480,
      guidance_scale: 7,
      sample_shift: 5,
      upscale_height: 640,
      upscale_width: 1024,
      upscale_strength: 0.6,
      upscale_guidance_scale: 12,
      upscale_num_inference_steps: 20,
      output_type: "mp4",
      webhook: null,
      track_id: null,
    };

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
      redirect: "follow",
    };

    onProgress?.('🚀 Sending request to Stable Diffusion...');

    console.log("Generating video with Stable Diffusion...");
    const response = await fetch(
      "https://modelslab.com/api/v6/video/text2video",
      requestOptions
    );
    const result = await response.json();

    console.log("Full API Response:", JSON.stringify(result, null, 2));
    if (!response.ok) {
      throw new Error(`API Error: ${result.message || "Unknown error"}`);
    }

    // If video is ready immediately
    if (result.status === 'success' && result.output && result.output.length > 0) {
      onProgress?.('✅ Video generated successfully!');
      return {
        videoUrl: result.output[0],
        generationTime: result.generationTime,
        metadata: result.meta
      };
    }

    // If video needs processing time, poll for result
    if (result.id) {
      onProgress?.('⏳ Video is processing, waiting for completion...');
      const videoUrl = await pollForResult(result.id, onProgress);
      
      return {
        videoUrl: videoUrl,
        generationTime: null, // Will be available in the final result
        taskId: result.id
      };
    }

    return result;
  } catch (error) {
    console.error("Error in textToVideo:", error);
    throw new Error("Failed to generate video");
  }
};

// Helper function to poll for results with progress updates
const pollForResult = async (taskId, onProgress = null, maxAttempts = 60) => {
  let attempt = 0;
  
  while (attempt < maxAttempts) {
    try {
      attempt++;
      onProgress?.(`⏳ Checking progress... (${attempt}/${maxAttempts})`);
      
      // Use POST method instead of GET
      const response = await fetch(`https://modelslab.com/api/v6/video/fetch/${taskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: process.env.STABLE_DIFFUSION_API_KEY
        })
      });
      
      const result = await response.json();
      console.log(`Poll attempt ${attempt}:`, JSON.stringify(result, null, 2));
      
      // Success - video is ready
      if (result.status === 'success' && result.output && result.output.length > 0) {
        onProgress?.(`✅ Video ready! Generated in ${result.generationTime || 'unknown'}s`);
        return result.output[0];
      }
      
      // Failed
      if (result.status === 'failed' || result.status === 'error') {
        throw new Error(`Video generation failed: ${result.message || 'Unknown error'}`);
      }
      
      // Still processing - update progress message
      if (result.status === 'processing') {
        const progress = result.progress || 'In progress';
        onProgress?.(`🔄 Processing... ${progress} (${attempt}/${maxAttempts})`);
      } else if (result.status === 'queued') {
        onProgress?.(`⏳ Queued for processing... (${attempt}/${maxAttempts})`);
      }
      
      // Wait before next poll (start with 3s, increase gradually)
      const waitTime = Math.min(3000 + (attempt * 1000), 15000); // Max 15s between polls
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
    } catch (error) {
      console.error(`Polling attempt ${attempt} failed:`, error);
      
      // If it's a network error, continue trying
      if (attempt < maxAttempts) {
        onProgress?.(`⚠️ Network error, retrying... (${attempt}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        continue;
      }
      
      throw error;
    }
  }
  
  throw new Error('Video generation timed out after maximum attempts');
};