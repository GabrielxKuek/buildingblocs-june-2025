import express from "express";
import * as mediaController from "../controllers/mediaController.js";

const router = express.Router();

// --- Generation ---
router.post('/generateImage', mediaController.convertTextToImage, mediaController.uploadImage);
router.post('/generateVideo', mediaController.convertTextToVideo, mediaController.uploadVideo);

// --- Retrieval ---
router.get('/fetchAllImages', mediaController.fetchALlImages);
router.get('/fetchAllVideos', mediaController.fetchAllVideos);



export default router;