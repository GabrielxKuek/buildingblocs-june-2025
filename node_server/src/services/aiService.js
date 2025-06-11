
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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
// export const textToVideo = async (text) => {
//   const contents = `Hi, can you create a video of ${text}?`;

  
//   return response;
// };