import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import connectDB from "./config/db";
import sliderRoutes from "./routes/sliderRoutes";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";
import bookRoutes from "./routes/bookRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import { createAdmin } from "./utils/createAdmin";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- CREATE PREDEFINED ADMIN ---------------- */
(async () => {
  try {
    await createAdmin();
  } catch (err) {
    console.error("Failed to create admin:", err);
  }
})();

/* ---------------- ROUTES ---------------- */
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/sliders", sliderRoutes);

app.get("/", (_req: Request, res: Response) => res.send("API is running..."));

/* ---------------- GLOBAL ERROR HANDLER ---------------- */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
