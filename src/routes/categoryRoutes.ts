import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { protect, adminOnly } from "../middleware/auth";

const router = Router();

/* ---------------- ADMIN ONLY ---------------- */
// Create category
router.post("/", protect, adminOnly, createCategory);

// Update category
router.put("/:id", protect, adminOnly, updateCategory);

// Delete category
router.delete("/:id", protect, adminOnly, deleteCategory);

/* ---------------- PUBLIC ---------------- */
// Get all categories
router.get("/", getAllCategories);

export default router;
