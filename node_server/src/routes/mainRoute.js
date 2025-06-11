import express from "express";
import mediaRoute from "./mediaRoute.js";

// setup the router
const router = express.Router();

router.use('/media', mediaRoute);

export default router;