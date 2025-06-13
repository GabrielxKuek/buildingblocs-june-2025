import express from "express";
import * as mediaController from "../controllers/mediaController.js";

const router = express.Router();

router.post('/generateImage', mediaController.convertTextToImage, mediaController.uploadImage);
router.post('/generateVideo', mediaController.fetchMediaUrlById, mediaController.convertTextToVideo, mediaController.uploadVideo);

router.post('/generateVideoWithProgress', mediaController.convertTextToVideoWithProgress);

router.get('/fetchAllImages', mediaController.fetchALlImages);
router.get('/fetchAllVideos', mediaController.fetchAllVideos);

router.get('/fetchVideosByParent/:parentId', mediaController.fetchVideosByParentId);

router.get('/fetchMediaHierarchy', mediaController.fetchMediaHierarchy);

export default router;