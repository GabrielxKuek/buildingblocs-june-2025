import express from "express";
import * as mediaController from "../controllers/mediaController.js";

const router = express.Router();

// --- Generation ---
router.post('/generateImage', mediaController.convertTextToImage, mediaController.uploadImage);
router.post('/generateVideo', mediaController.convertTextToVideo, mediaController.uploadVideo);

// --- Retrieval ---

export default router;