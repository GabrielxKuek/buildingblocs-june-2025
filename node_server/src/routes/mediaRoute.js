// import express from "express";
// import * as mediaController from "../controllers/mediaController.js";

// const router = express.Router();

// // --- Generation ---
// router.post('/generateImage', mediaController.convertTextToImage, mediaController.uploadImage);
// router.post('/generateVideo', mediaController.fetchMediaUrlById, mediaController.convertTextToVideo, mediaController.uploadVideo);

// // --- Retrieval ---
// router.get('/fetchAllImages', mediaController.fetchALlImages);
// router.get('/fetchAllVideos', mediaController.fetchAllVideos);



// export default router;

import express from "express";
import * as mediaController from "../controllers/mediaController.js";

const router = express.Router();

// --- Generation ---
router.post('/generateImage', mediaController.convertTextToImage, mediaController.uploadImage);
router.post('/generateVideo', mediaController.fetchMediaUrlById, mediaController.convertTextToVideo, mediaController.uploadVideo);

// SSE endpoint for video generation with real-time progress
router.post('/generateVideoWithProgress', mediaController.convertTextToVideoWithProgress);

// --- Retrieval ---
router.get('/fetchAllImages', mediaController.fetchALlImages);
router.get('/fetchAllVideos', mediaController.fetchAllVideos);

// NEW: Get videos by parent image ID
router.get('/fetchVideosByParent/:parentId', mediaController.fetchVideosByParentId);

// NEW: Get complete media hierarchy (images with their videos)
router.get('/fetchMediaHierarchy', mediaController.fetchMediaHierarchy);

export default router;