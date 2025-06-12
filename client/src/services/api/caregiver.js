// src/services/api/caregiver.js - Updated to use your API config

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

// ✅ REAL BACKEND CALL - Create caregiver item (Image or Video)
export const createCaregiverItem = async (itemData, onProgress = null) => {
    if (itemData.type === 'video') {
        return await createCaregiverVideo(itemData, onProgress);
    } else {
        return await createCaregiverImage(itemData, onProgress);
    }
};

// ✅ REAL BACKEND CALL - Create caregiver image using Gemini AI
export const createCaregiverImage = async (itemData, onProgress = null) => {
    try {
        const progressTracker = createProgressTracker(onProgress, API_CONFIG.GENERATION_TYPES.IMAGE);
        progressTracker.updateProgress('start', 5);

        console.log('🎨 Calling REAL backend to generate image:', itemData.name);

        const response = await fetchWithTimeout(
            getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_IMAGE), // → http://localhost:8080/api/media/generateImage
            createRequestOptions('POST', { prompt: itemData.name }),
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
            type: "image",
            createdAt: new Date().toISOString(),
            filename: data.fileName
        };
    } catch (error) {
        console.error('❌ Error calling backend for image:', error);
        if (error.message.includes('timeout') || error.message.includes('timed out')) {
            throw new Error('Image generation timed out. Please try again.');
        }
        throw new Error(`Failed to generate image: ${error.message}`);
    }
};

// ✅ REAL BACKEND CALL - Create caregiver video using Stable Diffusion  
export const createCaregiverVideo = async (itemData, onProgress = null) => {
    try {
        const progressTracker = createProgressTracker(onProgress, API_CONFIG.GENERATION_TYPES.VIDEO);
        progressTracker.updateProgress('start', 2);

        console.log('🎬 Calling REAL backend to generate video:', itemData.name);
        console.log('🖼️ Using base image:', itemData.imageUrl);

        // Debug: Log the exact request being sent
        const requestBody = {
            prompt: itemData.name,
            imageUrl: itemData.imageUrl || null
        };
        console.log('📤 Video generation request body:', requestBody);

        const response = await fetchWithTimeout(
            getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_VIDEO), // → http://localhost:8080/api/media/generateVideo
            createRequestOptions('POST', requestBody),
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
            imageUrl: data.imageUrl, // ← Video URL from backend
            type: "video",
            createdAt: new Date().toISOString(),
            filename: data.fileName
        };
    } catch (error) {
        console.error('❌ Error calling backend for video:', error);
        
        // More detailed error logging for video generation debugging
        console.error('Video generation error details:', {
            message: error.message,
            itemName: itemData.name,
            imageUrl: itemData.imageUrl,
            timestamp: new Date().toISOString()
        });
        
        if (error.message.includes('timeout') || error.message.includes('timed out')) {
            throw new Error('Video generation timed out. Stable Diffusion can take up to 5 minutes.');
        }
        throw new Error(`Failed to generate video: ${error.message}`);
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
            createRequestOptions('POST', { prompt: itemName }),
            getTimeoutForOperation(API_CONFIG.GENERATION_TYPES.IMAGE)
        );

        progressTracker.updateProgress('processing', 70);
        const data = await handleApiResponse(response);
        
        progressTracker.updateProgress('complete', 100);
        
        console.log('✅ Regenerated image URL:', data.imageUrl);
        
        return data.imageUrl;
    } catch (error) {
        console.error('❌ Error regenerating image:', error);
        if (error.message.includes('timeout') || error.message.includes('timed out')) {
            throw new Error('Image generation timed out. Please try again.');
        }
        throw new Error(`Failed to generate new image: ${error.message}`);
    }
};

// ✅ REAL BACKEND CALL - Fetch all images
export const fetchAllImages = async () => {
    try {
        console.log('📥 Fetching all images from backend...');
        
        const response = await fetchWithTimeout(
            getApiUrl(API_CONFIG.ENDPOINTS.FETCH_IMAGES),
            createRequestOptions('GET'),
            getTimeoutForOperation('default')
        );

        const data = await handleApiResponse(response);
        console.log('✅ Fetched images:', data);
        
        return data.images || [];
    } catch (error) {
        console.error('❌ Error fetching images:', error);
        throw new Error(`Failed to fetch images: ${error.message}`);
    }
};

// ✅ REAL BACKEND CALL - Fetch all videos
export const fetchAllVideos = async () => {
    try {
        console.log('📥 Fetching all videos from backend...');
        
        const response = await fetchWithTimeout(
            getApiUrl(API_CONFIG.ENDPOINTS.FETCH_VIDEOS),
            createRequestOptions('GET'),
            getTimeoutForOperation('default')
        );

        const data = await handleApiResponse(response);
        console.log('✅ Fetched videos:', data);
        
        return data.videos || [];
    } catch (error) {
        console.error('❌ Error fetching videos:', error);
        throw new Error(`Failed to fetch videos: ${error.message}`);
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

// 🔧 DEBUG HELPER - Test video generation endpoint
export const debugVideoGeneration = async (itemName, imageUrl = null) => {
    try {
        console.log('🔍 DEBUG: Testing video generation endpoint...');
        console.log('🔍 Item name:', itemName);
        console.log('🔍 Image URL:', imageUrl);
        console.log('🔍 Full URL:', getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_VIDEO));
        
        const requestBody = {
            prompt: itemName,
            imageUrl: imageUrl
        };
        
        console.log('🔍 Request body:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_VIDEO), {
            method: 'POST',
            headers: API_CONFIG.DEFAULT_HEADERS,
            body: JSON.stringify(requestBody)
        });
        
        console.log('🔍 Response status:', response.status);
        console.log('🔍 Response headers:', Object.fromEntries(response.headers.entries()));
        
        const responseText = await response.text();
        console.log('🔍 Raw response:', responseText);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${responseText}`);
        }
        
        const data = JSON.parse(responseText);
        console.log('🔍 Parsed response data:', data);
        
        return data;
    } catch (error) {
        console.error('🔍 DEBUG: Video generation test failed:', error);
        throw error;
    }
};