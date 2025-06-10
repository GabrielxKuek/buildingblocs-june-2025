import express from "express";
import * as aiController from "../controllers/aiController.js";

const router = express.Router();

router.get('/test', aiController.testController);

export default router;