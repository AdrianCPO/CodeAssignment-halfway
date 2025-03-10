//Huvudfilen för att sätta upp och köra Express-servern samt importera och använda routes.
// index.js
import express from "express";
import cors from "cors";
import threadRoutes from "./routes/threadRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Använd threadRoutes
app.use("/api/threads", threadRoutes);
app.use("/api/comments", commentRoutes);

// Global felhantering
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err.message);
  res.status(500).json({ message: "An unexpected error occurred" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
