import express from "express";
import mainRoutes from "./routes/mainRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Server is running");
});


app.use("/api", mainRoutes);

app.use("/", express.static('public'));

// --- Export App ---
export default app;