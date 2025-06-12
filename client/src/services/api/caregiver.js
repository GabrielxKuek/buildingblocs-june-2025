// src/services/api/caregiver.js - UPDATED to send simple item names

import API_CONFIG, { 
    getApiUrl, 
    createRequestOptions, 
    handleApiResponse, 
    fetchWithTimeout,
    createProgressTracker,
    getTimeoutForOperation 
} from '@/lib/apiConfig';

// DUMMY DATA for requests (until you add request endpoints)
const DUMMY_REQUESTS = [
    {
        id: 1,
        item: {
            id: 1,
            name: "Coffee",
            imageUrl: "https://www.fairprice.com.sg/wp-content/uploads/2019/10/pour-over-coffee-970x526.jpg",
            type: "image"
        },
        patientName: "John Doe",
        message: "I would like some coffee please",
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
];

// ✅ REAL BACKEND CALL - Create caregiver item using Gemini AI
export const createCaregiverItem = async (itemData, onProgress = null) => {
    try {
        const progressTracker = createProgressTracker(onProgress, API_CONFIG.GENERATION_TYPES.IMAGE);
        progressTracker.updateProgress('start', 5);

        console.log('🎨 Calling REAL backend to generate image:', itemData.name);

        const response = await fetchWithTimeout(
            getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_IMAGE), 
            createRequestOptions('POST', { prompt: itemData.name }), // ← Just send the item name directly
            getTimeoutForOperation(API_CONFIG.GENERATION_TYPES.IMAGE)
        );

        progressTracker.updateProgress('processing', 70);
        const data = await handleApiResponse(response);
        
        progressTracker.updateProgress('uploading', 90);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        progressTracker.updateProgress('complete', 100);
        
        console.log('✅ Backend returned image data:', data);
        
        return {
            id: `image_${Date.now()}`,
            name: itemData.name,
            imageUrl: data.imageUrl, 
            type: itemData.type || "image",
            createdAt: new Date().toISOString(),
            filename: data.fileName
        };
    } catch (error) {
        console.error('❌ Error calling backend for image:', error);
        if (error.message.includes('timeout')) {
            throw new Error('Image generation timed out. Please try again.');
        }
        throw new Error('Failed to generate image. Please try again.');
    }
};

// ✅ REAL BACKEND CALL - Create caregiver video using Stable Diffusion  
export const createCaregiverVideo = async (itemData, onProgress = null) => {
    try {
        const progressTracker = createProgressTracker(onProgress, API_CONFIG.GENERATION_TYPES.VIDEO);
        progressTracker.updateProgress('start', 2);

        console.log('🎬 Calling REAL backend to generate video:', itemData.name);

        const response = await fetchWithTimeout(
            getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_VIDEO),
            createRequestOptions('POST', {
                prompt: itemData.name, // ← Just send the item name directly
                imageUrl: itemData.imageUrl || null
            }),
            getTimeoutForOperation(API_CONFIG.GENERATION_TYPES.VIDEO)
        );

        progressTracker.updateProgress('processing', 80);
        const data = await handleApiResponse(response);
        
        progressTracker.updateProgress('uploading', 95);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        progressTracker.updateProgress('complete', 100);
        
        console.log('✅ Backend returned video data:', data);
        
        return {
            id: `video_${Date.now()}`,
            name: itemData.name,
            imageUrl: data.imageUrl,
            type: "video",
            createdAt: new Date().toISOString(),
            filename: data.fileName
        };
    } catch (error) {
        console.error('❌ Error calling backend for video:', error);
        if (error.message.includes('timeout')) {
            throw new Error('Video generation timed out. This can take up to 5 minutes.');
        }
        throw new Error('Failed to generate video. Please try again.');
    }
};

// ✅ REAL BACKEND CALL - Generate new image for existing item
export const generateImageForItem = async (itemName, onProgress = null) => {
    try {
        const progressTracker = createProgressTracker(onProgress, API_CONFIG.GENERATION_TYPES.IMAGE);
        progressTracker.updateProgress('start', 5);
        
        console.log('🎨 Regenerating image via backend:', itemName);
        
        const response = await fetchWithTimeout(
            getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_IMAGE),
            createRequestOptions('POST', { prompt: itemName }), // ← Just send the item name directly
            getTimeoutForOperation(API_CONFIG.GENERATION_TYPES.IMAGE)
        );

        progressTracker.updateProgress('processing', 70);
        const data = await handleApiResponse(response);
        
        progressTracker.updateProgress('complete', 100);
        
        console.log('✅ Regenerated image URL:', data.imageUrl);
        
        return data.imageUrl;
    } catch (error) {
        console.error('❌ Error regenerating image:', error);
        if (error.message.includes('timeout')) {
            throw new Error('Image generation timed out. Please try again.');
        }
        throw new Error('Failed to generate new image. Please try again.');
    }
};

// ⚠️ DUMMY DATA - Get caregiver requests (until you add request endpoints)
export const getCaregiverRequests = async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log('⚠️ Using dummy request data - add backend endpoint later');
    return [...DUMMY_REQUESTS];
};

// ⚠️ DUMMY DATA - Update/delete operations (until you add these endpoints)
export const updateCaregiverItem = async (itemId, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('⚠️ Simulated update:', itemId, updateData);
    return { success: true, updatedItem: { id: itemId, ...updateData } };
};

export const deleteCaregiverItem = async (itemId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('⚠️ Simulated delete:', itemId);
    return { success: true };
};

export const approveRequest = async (requestId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('⚠️ Simulated approve:', requestId);
    return { success: true, message: "Request approved successfully", updatedStatus: "approved" };
};

export const rejectRequest = async (requestId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('⚠️ Simulated reject:', requestId);
    return { success: true, message: "Request rejected", updatedStatus: "rejected" };
};