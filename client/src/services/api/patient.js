// const DUMMY_ITEMS = [
//     {
//         id: 1,
//         name: "Coffee",
//         imageUrl: "https://www.fairprice.com.sg/wp-content/uploads/2019/10/pour-over-coffee-970x526.jpg",
//         type: "image"
//     },
//     {
//         id: 2,
//         name: "Water",
//         imageUrl: "https://www.fairprice.com.sg/wp-content/uploads/2019/10/pour-over-coffee-970x526.jpg",
//         type: "image"
//     },
//     {
//         id: 3,
//         name: "Medicine",
//         imageUrl: "https://www.fairprice.com.sg/wp-content/uploads/2019/10/pour-over-coffee-970x526.jpg",
//         type: "image"
//     },
//     {
//         id: 4,
//         name: "Food",
//         imageUrl: "https://www.fairprice.com.sg/wp-content/uploads/2019/10/pour-over-coffee-970x526.jpg",
//         type: "image"
//     },
//     {
//         id: 5,
//         name: "Help",
//         imageUrl: "https://www.fairprice.com.sg/wp-content/uploads/2019/10/pour-over-coffee-970x526.jpg",
//         type: "image"
//     },
//     {
//         id: 6,
//         name: "Bathroom",
//         imageUrl: "https://www.fairprice.com.sg/wp-content/uploads/2019/10/pour-over-coffee-970x526.jpg",
//         type: "image"
//     }
// ];

// export const getPatientItems = async () => {
//     // simulate api call
//     await new Promise(resolve => setTimeout(resolve, 500));
//     return DUMMY_ITEMS;
// };

// export const sendItemToCaregiver = async (item) => {
//     // simulate api call
//     await new Promise(resolve => setTimeout(resolve, 800));
//     console.log('Sending to caregiver:', item.name);
//     return { success: true };
// };

import API_CONFIG, { 
    getApiUrl, 
    createRequestOptions, 
    handleApiResponse, 
    fetchWithTimeout,
    createProgressTracker,
    getTimeoutForOperation 
} from '@/lib/apiConfig';

// Get all patient items (images and videos)
export const getPatientItems = async () => {
    try {
        // Fetch both images and videos from the backend
        const [imagesResponse, videosResponse] = await Promise.all([
            fetchWithTimeout(getApiUrl(API_CONFIG.ENDPOINTS.FETCH_IMAGES)),
            fetchWithTimeout(getApiUrl(API_CONFIG.ENDPOINTS.FETCH_VIDEOS))
        ]);

        const imagesData = await handleApiResponse(imagesResponse);
        const videosData = await handleApiResponse(videosResponse);

        // Transform the data to match the expected format
        const items = [];
        
        // Add images
        if (imagesData.images && Array.isArray(imagesData.images)) {
            imagesData.images.forEach((image, index) => {
                items.push({
                    id: `image_${image.id || index + 1}`,
                    name: image.prompt || image.media_name || `Image ${index + 1}`,
                    imageUrl: image.media_url,
                    type: "image",
                    createdAt: image.created_at || new Date().toISOString(),
                    filename: image.filename
                });
            });
        }

        // Add videos
        if (videosData.videos && Array.isArray(videosData.videos)) {
            videosData.videos.forEach((video, index) => {
                items.push({
                    id: `video_${video.id || index + 1}`,
                    name: video.prompt || video.media_name || `Video ${index + 1}`,
                    imageUrl: video.media_url,
                    type: "video",
                    createdAt: video.created_at || new Date().toISOString(),
                    filename: video.filename
                });
            });
        }

        // Sort by creation date (newest first)
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return items;
    } catch (error) {
        console.error('Error fetching patient items:', error);
        // Return empty array if no items exist yet
        if (error.message.includes('404') || error.message.includes('No')) {
            return [];
        }
        throw error;
    }
};

// Create a new patient item by generating image using Gemini AI
export const createPatientItem = async (itemData, onProgress = null) => {
    try {
        const progressTracker = createProgressTracker(onProgress, API_CONFIG.GENERATION_TYPES.IMAGE);
        progressTracker.updateProgress('start', 5);

        const response = await fetchWithTimeout(
            getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_IMAGE),
            createRequestOptions('POST', { prompt: itemData.name }),
            getTimeoutForOperation(API_CONFIG.GENERATION_TYPES.IMAGE)
        );

        progressTracker.updateProgress('processing', 60);
        const data = await handleApiResponse(response);
        
        progressTracker.updateProgress('uploading', 90);
        
        // Small delay to show upload progress
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        progressTracker.updateProgress('complete', 100);
        
        // Return the created item in the expected format
        return {
            id: `image_${Date.now()}`,
            name: itemData.name,
            imageUrl: data.imageUrl,
            type: "image",
            createdAt: new Date().toISOString(),
            filename: data.fileName
        };
    } catch (error) {
        console.error('Error creating patient item:', error);
        if (error.message.includes('timeout')) {
            throw new Error('Image generation timed out. Please try again with a simpler description.');
        }
        throw new Error('Failed to generate image. Please check your connection and try again.');
    }
};

// Create video item using Stable Diffusion
export const createPatientVideo = async (itemData, onProgress = null) => {
    try {
        const progressTracker = createProgressTracker(onProgress, API_CONFIG.GENERATION_TYPES.VIDEO);
        progressTracker.updateProgress('start', 2);

        const response = await fetchWithTimeout(
            getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_VIDEO),
            createRequestOptions('POST', {
                prompt: itemData.name,
                imageUrl: itemData.imageUrl || null
            }),
            getTimeoutForOperation(API_CONFIG.GENERATION_TYPES.VIDEO)
        );

        progressTracker.updateProgress('processing', 50);
        const data = await handleApiResponse(response);
        
        progressTracker.updateProgress('uploading', 95);
        
        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        progressTracker.updateProgress('complete', 100);
        
        // Return the created video in the expected format
        return {
            id: `video_${Date.now()}`,
            name: itemData.name,
            imageUrl: data.imageUrl, // This will be the video URL
            type: "video",
            createdAt: new Date().toISOString(),
            filename: data.fileName
        };
    } catch (error) {
        console.error('Error creating patient video:', error);
        if (error.message.includes('timeout')) {
            throw new Error('Video generation timed out. Video generation can take up to 5 minutes. Please try again.');
        }
        throw new Error('Failed to generate video. Please check your connection and try again.');
    }
};

// Send item to caregiver (simulate for now since no backend endpoint exists)
export const sendItemToCaregiver = async (item) => {
    try {
        // This would need a backend endpoint to handle communication requests
        // For now, simulate the API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        console.log('Sending to caregiver:', item.name);
        
        // In a real implementation, this would create a request record
        // POST /api/requests or similar endpoint
        
        return { 
            success: true,
            message: `Request for "${item.name}" sent to caregiver`
        };
    } catch (error) {
        console.error('Error sending to caregiver:', error);
        throw error;
    }
};

// Upload image file (for patient uploaded images)
export const uploadPatientImage = async (imageFile, itemName) => {
    try {
        // For uploaded files, we could add a new endpoint to handle file uploads
        // For now, we'll generate an image based on the item name
        return await createPatientItem({ name: itemName });
    } catch (error) {
        console.error('Error uploading patient image:', error);
        throw error;
    }
};