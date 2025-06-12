// const DUMMY_REQUESTS = [
//     {
//         id: 1,
//         item: {
//             id: 1,
//             name: "Coffee",
//             imageUrl: "https://www.fairprice.com.sg/wp-content/uploads/2019/10/pour-over-coffee-970x526.jpg",
//             type: "image"
//         },
//         patientName: "John Doe",
//         message: "I would like some coffee please",
//         status: "pending",
//         createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
//     },
//     {
//         id: 2,
//         item: {
//             id: 2,
//             name: "Water",
//             imageUrl: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=500",
//             type: "image"
//         },
//         patientName: "Jane Smith",
//         message: "Need water urgently",
//         status: "pending",
//         createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
//     },
//     {
//         id: 3,
//         item: {
//             id: 3,
//             name: "Medicine",
//             imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
//             type: "image"
//         },
//         patientName: "Bob Johnson",
//         message: "Time for my medication",
//         status: "approved",
//         createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
//     },
//     {
//         id: 4,
//         item: {
//             id: 6,
//             name: "Bathroom",
//             imageUrl: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500",
//             type: "image"
//         },
//         patientName: "Alice Brown",
//         message: "Urgent assistance needed",
//         status: "rejected",
//         createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
//     },
//     {
//         id: 5,
//         item: {
//             id: 4,
//             name: "Food",
//             imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500",
//             type: "image"
//         },
//         patientName: "Charlie Wilson",
//         status: "approved",
//         createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
//     }
// ];

// export const getCaregiverRequests = async () => {
//     // simulate api call
//     await new Promise(resolve => setTimeout(resolve, 600));
    
//     // Return copy of dummy data to prevent mutations
//     return [...DUMMY_REQUESTS];
// };

// export const approveRequest = async (requestId) => {
//     // simulate api call
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     console.log('Approved request:', requestId);
    
//     return { 
//         success: true, 
//         message: "Request approved successfully",
//         updatedStatus: "approved"
//     };
// };

// export const rejectRequest = async (requestId) => {
//     // simulate api call
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     console.log('Rejected request:', requestId);
    
//     return { 
//         success: true, 
//         message: "Request rejected",
//         updatedStatus: "rejected"
//     };
// };

// export const createCaregiverItem = async (itemData) => {
//     // simulate api call
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     const newItem = {
//         id: Date.now(), // Simple ID generation
//         name: itemData.name,
//         imageUrl: itemData.imageUrl || generatePlaceholderImage(itemData.name),
//         type: itemData.type || "image"
//     };
    
//     console.log('Caregiver created new item:', newItem);
//     return newItem;
// };

// export const updateCaregiverItem = async (itemId, updateData) => {
//     // simulate api call
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     console.log('Caregiver updated item:', itemId, updateData);
//     return { 
//         success: true,
//         updatedItem: { id: itemId, ...updateData }
//     };
// };

// export const deleteCaregiverItem = async (itemId) => {
//     // simulate api call
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     console.log('Caregiver deleted item:', itemId);
//     return { success: true };
// };

// export const generateImageForItem = async (itemName, prompt = null) => {
//     await new Promise(resolve => setTimeout(resolve, 2500));
    
//     const timestamp = Date.now();
//     const enhancedPrompt = prompt || `A clear, simple icon representing ${itemName} for healthcare communication`;
    
//     const imageServices = [
//         `https://via.placeholder.com/400x400/3b82f6/ffffff?text=${encodeURIComponent(itemName)}`,
//         `https://via.placeholder.com/400x400/10b981/ffffff?text=${encodeURIComponent(itemName)}`,
//         `https://via.placeholder.com/400x400/f59e0b/ffffff?text=${encodeURIComponent(itemName)}`,
//         `https://via.placeholder.com/400x400/ef4444/ffffff?text=${encodeURIComponent(itemName)}`
//     ];
    
//     const randomService = imageServices[Math.floor(Math.random() * imageServices.length)];
//     const imageUrl = `${randomService}&t=${timestamp}`;
    
//     console.log('Generated new image for:', itemName, 'with prompt:', enhancedPrompt);
//     return imageUrl;
// };

// export const getCaregiverStats = async () => {
//     // simulate api call
//     await new Promise(resolve => setTimeout(resolve, 400));
    
//     const stats = {
//         totalRequests: DUMMY_REQUESTS.length,
//         pendingRequests: DUMMY_REQUESTS.filter(r => r.status === 'pending').length,
//         approvedRequests: DUMMY_REQUESTS.filter(r => r.status === 'approved').length,
//         rejectedRequests: DUMMY_REQUESTS.filter(r => r.status === 'rejected').length,
//         activePatients: [...new Set(DUMMY_REQUESTS.map(r => r.patientName))].length
//     };
    
//     console.log('Caregiver stats:', stats);
//     return stats;
// };

// export const getRequestHistory = async (limit = 10) => {
//     // simulate api call
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     const history = [...DUMMY_REQUESTS]
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         .slice(0, limit);
    
//     console.log('Request history retrieved:', history.length, 'items');
//     return history;
// };

// export const searchRequests = async (searchTerm, status = null) => {
//     // simulate api call
//     await new Promise(resolve => setTimeout(resolve, 300));
    
//     let filteredRequests = [...DUMMY_REQUESTS];
    
//     if (status) {
//         filteredRequests = filteredRequests.filter(r => r.status === status);
//     }
    
//     if (searchTerm) {
//         const term = searchTerm.toLowerCase();
//         filteredRequests = filteredRequests.filter(r => 
//             r.item.name.toLowerCase().includes(term) ||
//             r.patientName.toLowerCase().includes(term) ||
//             (r.message && r.message.toLowerCase().includes(term))
//         );
//     }
    
//     console.log('Search results:', filteredRequests.length, 'requests found');
//     return filteredRequests;
// };

// const generatePlaceholderImage = (itemName) => {
//     return `https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(itemName)}`;
// };

// src/services/api/caregiver.js - UPDATED to call real backend

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
            getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_VIDEO), // → http://localhost:8080/api/media/generateVideo
            createRequestOptions('POST', {
                prompt: itemData.name,
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
            imageUrl: data.imageUrl, // ← REAL video URL from your backend!
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
export const generateImageForItem = async (itemName, prompt = null, onProgress = null) => {
    try {
        const enhancedPrompt = prompt || `A clear, simple icon representing ${itemName} for healthcare communication`;
        
        const progressTracker = createProgressTracker(onProgress, API_CONFIG.GENERATION_TYPES.IMAGE);
        progressTracker.updateProgress('start', 5);
        
        console.log('🎨 Regenerating image via backend:', enhancedPrompt);
        
        const response = await fetchWithTimeout(
            getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_IMAGE),
            createRequestOptions('POST', { prompt: enhancedPrompt }),
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
    // simulate api call
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