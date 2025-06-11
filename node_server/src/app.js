// node_server/src/app.js - Update your app.js file

import express from "express";
import cors from "cors"; // Make sure you have this import
import mainRoutes from "./routes/mainRoute.js";

const app = express();

// CORS Configuration - ADD THIS BEFORE OTHER MIDDLEWARE
app.use(cors({
    origin: [
        'http://localhost:5173',  // Vite dev server
        'http://localhost:3000',  // Alternative React dev server
        'http://127.0.0.1:5173',  // Alternative localhost format
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Accept',
        'Origin',
        'X-Requested-With'
    ],
    credentials: true  // Allow cookies if needed
}));

// Alternative: Allow all origins for development (less secure)
// app.use(cors()); // This allows all origins

// Existing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api", mainRoutes);

app.use("/", express.static('public'));

// --- Export App ---
export default app;