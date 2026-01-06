import { Router } from "express";
import {
  getAllUsers,
  getBooksCount,
  getBooksByCategory,
  getBuyersCount,
  getSellersCount,
} from "../controllers/adminController";
import { protect, adminOnly } from "../middleware/auth";

const router = Router();

// Analytics endpoints
router.get("/analytics/books/count", protect, adminOnly, getBooksCount);
router.get("/analytics/books", protect, adminOnly, getBooksByCategory);
router.get("/analytics/buyers", protect, adminOnly, getBuyersCount);
router.get("/analytics/sellers", protect, adminOnly, getSellersCount);

// Users endpoint with optional role filter
router.get("/users", protect, adminOnly, getAllUsers);

export default router;
