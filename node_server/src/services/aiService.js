import { GoogleGenAI, Modality } from "@google/genai";
import RunwayML from '@runwayml/sdk';
import dotenv from "dotenv";

dotenv.config();

// Initialize Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Initialize RunwayML client
const client = new RunwayML();

// Text to Image
export const textToImage = async (text) => {
  const contents = `Hi, can you create an image of ${text}?`;

  // Set responseModalities to include "Image" so the model can generate  an image
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: contents,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  return response;
};

// Text to Video
export const textToVideo = async (prompt, imageUrl, onProgress = null) => {
  try {
    onProgress?.('🎬 Starting Runway AI video generation...');
    console.log("image URL" + imageUrl)

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
      
    } while (!['SUCCEEDED', 'FAILED'].includes(task.status));

    if (task.status === 'SUCCEEDED') {
      onProgress?.('✅ Video generated successfully!');
      console.log('Task complete:', task);
      
      // FIXED: Return the video URL properly
      const videoUrl = task.output?.[0];
      if (!videoUrl) {
        throw new Error('No video URL in completed task');
      }
      
      console.log('Video URL:', videoUrl);
      return videoUrl;
    }
  } catch (error) {
    console.error("Error in textToVideo:", error);
    throw new Error("Failed to generate video");
  }
}