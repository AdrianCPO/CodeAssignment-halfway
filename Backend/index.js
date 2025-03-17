import express from "express";
import cors from "cors";
import { threadRoutes } from "./routes/threadRoutes.js";
import { commentRoutes } from "./routes/commentRoutes.js";
import { categoryRoutes } from "./routes/categoryRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/threads", threadRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);


app.use((err, req, res, next) => {
  console.error("Unexpected error:", err.message);
  res.status(500).json({ message: "An unexpected error occurred" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
