import express from "express";
import mediaRoute from "./mediaRoute.js";
import smojiRoute from "./smojiRoute.js";

const router = express.Router();

router.use('/media', mediaRoute);
router.use('/smoji', smojiRoute);

export default router;