// // src/lib/apiConfig.js

// // API Configuration
// const API_CONFIG = {
//     // Base URL for the API - can be overridden by environment variables
//     BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    
//     // Backend service configuration
//     BACKEND: {
//         HOST: import.meta.env.VITE_BACKEND_HOST || 'localhost',
//         PORT: import.meta.env.VITE_BACKEND_PORT || '8080',
//         PROTOCOL: import.meta.env.VITE_BACKEND_PROTOCOL || 'http'
//     },
    
//     // Database configuration (for direct access if needed)
//     DATABASE: {
//         URL: import.meta.env.VITE_DB_URL || null,
//         SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || null,
//         SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || null,
//     },
    
//     // Timeout settings
//     REQUEST_TIMEOUT: 30000, // 30 seconds for regular requests
//     IMAGE_GENERATION_TIMEOUT: 60000, // 1 minute for image generation
//     VIDEO_GENERATION_TIMEOUT: 300000, // 5 minutes for video generation (Stable Diffusion can be slow)
    
//     // Endpoints
//     ENDPOINTS: {
//         // Media endpoints
//         GENERATE_IMAGE: '/media/generateImage',
//         GENERATE_VIDEO: '/media/generateVideo',
//         FETCH_IMAGES: '/media/fetchAllImages',
//         FETCH_VIDEOS: '/media/fetchAllVideos',
        
//         // Future endpoints (to be implemented)
//         REQUESTS: '/requests',
//         ITEMS: '/items',
//         STATS: '/stats',
//         USERS: '/users',
//     },
    
//     // Default headers
//     DEFAULT_HEADERS: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//     },
    
//     // Generation service types
//     GENERATION_TYPES: {
//         IMAGE: 'image',
//         VIDEO: 'video'
//     }
// };

// // Helper function to get full URL with dynamic backend URL construction
// export const getApiUrl = (endpoint) => {
//     const { PROTOCOL, HOST, PORT } = API_CONFIG.BACKEND;
//     const baseUrl = `${PROTOCOL}://${HOST}:${PORT}/api`;
//     return `${baseUrl}${endpoint}`;
// };

// // Helper function to get timeout based on operation type
// export const getTimeoutForOperation = (operationType) => {
//     switch (operationType) {
//         case API_CONFIG.GENERATION_TYPES.IMAGE:
//             return API_CONFIG.IMAGE_GENERATION_TIMEOUT;
//         case API_CONFIG.GENERATION_TYPES.VIDEO:
//             return API_CONFIG.VIDEO_GENERATION_TIMEOUT;
//         default:
//             return API_CONFIG.REQUEST_TIMEOUT;
//     }
// };

// // Helper function to create request options
// export const createRequestOptions = (method = 'GET', body = null, customHeaders = {}) => {
//     const options = {
//         method,
//         headers: {
//             ...API_CONFIG.DEFAULT_HEADERS,
//             ...customHeaders
//         }
//     };
    
//     if (body) {
//         options.body = typeof body === 'string' ? body : JSON.stringify(body);
//     }
    
//     return options;
// };

// // Helper function to handle API responses with better error handling
// export const handleApiResponse = async (response) => {
//     const contentType = response.headers.get('content-type');
    
//     if (!response.ok) {
//         let errorMessage = `HTTP error! status: ${response.status}`;
        
//         try {
//             if (contentType && contentType.includes('application/json')) {
//                 const errorData = await response.json();
//                 errorMessage = errorData.error || errorData.message || errorMessage;
//             } else {
//                 const textError = await response.text();
//                 errorMessage = textError || errorMessage;
//             }
//         } catch (parseError) {
//             console.warn('Failed to parse error response:', parseError);
//         }
        
//         throw new Error(errorMessage);
//     }
    
//     // Handle successful responses
//     if (contentType && contentType.includes('application/json')) {
//         return response.json();
//     } else {
//         return response.text();
//     }
// };

// // Helper function for requests with timeout
// export const fetchWithTimeout = async (url, options = {}, timeout = API_CONFIG.REQUEST_TIMEOUT) => {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), timeout);
    
//     try {
//         const response = await fetch(url, {
//             ...options,
//             signal: controller.signal
//         });
//         clearTimeout(timeoutId);
//         return response;
//     } catch (error) {
//         clearTimeout(timeoutId);
//         if (error.name === 'AbortError') {
//             throw new Error('Request timed out');
//         }
//         throw error;
//     }
// };

// // Progress tracking for long-running requests with specific messages for your services
// export const createProgressTracker = (onProgress, operationType = 'default') => {
//     const getProgressMessages = (type, stage) => {
//         const messages = {
//             image: {
//                 start: '🎨 Initializing Gemini AI for image generation...',
//                 processing: '🤖 Gemini AI is creating your image...',
//                 uploading: '☁️ Uploading to Supabase storage...',
//                 complete: '✅ Image generated and saved successfully!'
//             },
//             video: {
//                 start: '🎬 Initializing Stable Diffusion for video generation...',
//                 processing: '🎥 Generating video frames (this may take 2-5 minutes)...',
//                 uploading: '☁️ Processing and saving video...',
//                 complete: '✅ Video generated and saved successfully!'
//             },
//             default: {
//                 start: '⏳ Processing request...',
//                 processing: '🔄 Working on it...',
//                 uploading: '☁️ Saving data...',
//                 complete: '✅ Complete!'
//             }
//         };
        
//         return messages[type] || messages.default;
//     };

//     return {
//         updateProgress: (stage, percentage = null) => {
//             if (onProgress) {
//                 const messages = getProgressMessages(operationType, stage);
//                 onProgress({
//                     message: messages[stage] || messages.processing,
//                     percentage,
//                     timestamp: new Date().toISOString(),
//                     stage,
//                     operationType
//                 });
//             }
//         }
//     };
// };

// export default API_CONFIG;

// src/lib/apiConfig.js

// src/lib/apiConfig.js

// API Configuration
const API_CONFIG = {
    // Base URL for the API - can be overridden by environment variables
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    
    // Backend service configuration
    BACKEND: {
        HOST: import.meta.env.VITE_BACKEND_HOST || 'localhost',
        PORT: import.meta.env.VITE_BACKEND_PORT || '8080',
        PROTOCOL: import.meta.env.VITE_BACKEND_PROTOCOL || 'http'
    },
    
    // Database configuration (for direct access if needed)
    DATABASE: {
        URL: import.meta.env.VITE_DB_URL || null,
        SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || null,
        SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || null,
    },
    
    // Timeout settings
    REQUEST_TIMEOUT: 30000, // 30 seconds for regular requests
    IMAGE_GENERATION_TIMEOUT: 60000, // 1 minute for image generation
    VIDEO_GENERATION_TIMEOUT: 300000, // 5 minutes for video generation (Stable Diffusion can be slow)
    
    // Endpoints
    ENDPOINTS: {
        // Media endpoints
        GENERATE_IMAGE: '/media/generateImage',
        GENERATE_VIDEO: '/media/generateVideo',
        GENERATE_VIDEO_WITH_PROGRESS: '/media/generateVideoWithProgress',
        FETCH_IMAGES: '/media/fetchAllImages',
        FETCH_VIDEOS: '/media/fetchAllVideos',
        FETCH_VIDEOS_BY_PARENT: '/media/fetchVideosByParent', // New endpoint
        FETCH_MEDIA_HIERARCHY: '/media/fetchMediaHierarchy', // New endpoint
        
        // Speech to Emoji endpoints
        CONVERT_TEXT_TO_EMOJI: '/smoji/translate', // New endpoint for speech to emoji
        
        // Future endpoints (to be implemented)
        REQUESTS: '/requests',
        ITEMS: '/items',
        STATS: '/stats',
        USERS: '/users',
    },
    
    // Default headers
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    
    // SSE headers
    SSE_HEADERS: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
    },
    
    // Generation service types
    GENERATION_TYPES: {
        IMAGE: 'image',
        VIDEO: 'video'
    }
};

// Helper function to get full URL with dynamic backend URL construction
export const getApiUrl = (endpoint) => {
    const { PROTOCOL, HOST, PORT } = API_CONFIG.BACKEND;
    const baseUrl = `${PROTOCOL}://${HOST}:${PORT}/api`;
    return `${baseUrl}${endpoint}`;
};

// Helper function to get timeout based on operation type
export const getTimeoutForOperation = (operationType) => {
    switch (operationType) {
        case API_CONFIG.GENERATION_TYPES.IMAGE:
            return API_CONFIG.IMAGE_GENERATION_TIMEOUT;
        case API_CONFIG.GENERATION_TYPES.VIDEO:
            return API_CONFIG.VIDEO_GENERATION_TIMEOUT;
        default:
            return API_CONFIG.REQUEST_TIMEOUT;
    }
};

// Helper function to create request options
export const createRequestOptions = (method = 'GET', body = null, customHeaders = {}) => {
    const options = {
        method,
        headers: {
            ...API_CONFIG.DEFAULT_HEADERS,
            ...customHeaders
        }
    };
    
    if (body) {
        options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    return options;
};

// Helper function to create SSE request options
export const createSSERequestOptions = (method = 'POST', body = null) => {
    return {
        method,
        headers: {
            ...API_CONFIG.DEFAULT_HEADERS,
            ...API_CONFIG.SSE_HEADERS,
        },
        body: body ? JSON.stringify(body) : null
    };
};

// Helper function to handle API responses with better error handling
export const handleApiResponse = async (response) => {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.error || errorData.message || errorMessage;
            } else {
                const textError = await response.text();
                errorMessage = textError || errorMessage;
            }
        } catch (parseError) {
            console.warn('Failed to parse error response:', parseError);
        }
        
        throw new Error(errorMessage);
    }
    
    // Handle successful responses
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    } else {
        return response.text();
    }
};

// Helper function for requests with timeout
export const fetchWithTimeout = async (url, options = {}, timeout = API_CONFIG.REQUEST_TIMEOUT) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
};

// Progress tracking for long-running requests with specific messages for your services
export const createProgressTracker = (onProgress, operationType = 'default') => {
    const getProgressMessages = (type, stage) => {
        const messages = {
            image: {
                start: '🎨 Initializing Gemini AI for image generation...',
                processing: '🤖 Gemini AI is creating your image...',
                uploading: '☁️ Uploading to Supabase storage...',
                complete: '✅ Image generated and saved successfully!'
            },
            video: {
                start: '🎬 Initializing Runway AI for video generation...',
                processing: '🎥 Generating video frames (this may take 2-5 minutes)...',
                uploading: '☁️ Processing and saving video...',
                complete: '✅ Video generated and saved successfully!'
            },
            default: {
                start: '⏳ Processing request...',
                processing: '🔄 Working on it...',
                uploading: '☁️ Saving data...',
                complete: '✅ Complete!'
            }
        };
        
        return messages[type] || messages.default;
    };

    return {
        updateProgress: (stage, percentage = null) => {
            if (onProgress) {
                const messages = getProgressMessages(operationType, stage);
                onProgress({
                    message: messages[stage] || messages.processing,
                    percentage,
                    timestamp: new Date().toISOString(),
                    stage,
                    operationType
                });
            }
        }
    };
};

export default API_CONFIG;