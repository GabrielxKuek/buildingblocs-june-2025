import express from "express";
import * as smojiController from "../controllers/smojiController.js";

const router = express.Router();

router.post('/translate', smojiController.convertSpeechToText, smojiController.convertTextToEmoji);

export default router;