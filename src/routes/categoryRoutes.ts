
import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { protect, adminOrSeller } from "../middleware/auth";

const router = Router();


// Create category
router.post("/", protect, adminOrSeller, createCategory);

// Update category
router.put("/:id", protect, adminOrSeller, updateCategory);

// Delete category
router.delete("/:id", protect, adminOrSeller, deleteCategory);



// Get all categories
router.get("/", getAllCategories);

export default router;