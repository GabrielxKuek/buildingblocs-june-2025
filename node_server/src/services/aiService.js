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
        
        const contents = `Create a clear, photorealistic image representing "${text}" suitable for healthcare communication. The image should be clean, minimalist, and easily recognizable.`;

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


// Text to Video
export const textToVideo = async (prompt, imageUrl, onProgress = null) => {
  try {
    onProgress?.('🎬 Initializing video generation...');

    let task = await client.imageToVideo.create({
      model: 'gen4_turbo',
      promptImage: imageUrl,
      promptText: prompt,
      ratio: '1280:720',
    });
    

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 300; // 5 minutes max (300 seconds)
    
    do {
      attempts++;
      onProgress?.(`🔄 Checking status... (${attempts}/${maxAttempts}) - Status: ${task.status}`);
      
      // Wait for 1 second before polling
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // FIXED: Retrieve the task status
      task = await client.tasks.retrieve(task.id);
      
      console.log(`Poll ${attempts}:`, {
        id: task.id,
        status: task.status,
        progress: task.progress
      });
      
      // Check for timeout
      if (attempts >= maxAttempts) {
        throw new Error('Video generation timed out');
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