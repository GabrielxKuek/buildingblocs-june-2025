import express from "express";
import aiRoute from "./aiRoute.js";

// setup the router
const router = express.Router();

router.use('/ai', aiRoute);

export default router;