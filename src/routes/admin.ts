import { Router } from "express";
import {
  getAllUsers,
  getBooksCount,
  getBooksByCategory,
  getBuyersCount,
  getSellersCount,
  getSellerStatusStats,
  blockSeller,
  unblockSeller,
} from "../controllers/adminController";
import { protect, adminOnly } from "../middleware/auth";

const router = Router();

/* ---------------- ANALYTICS ---------------- */
router.get("/analytics/books/count", protect, adminOnly, getBooksCount);
router.get("/analytics/books", protect, adminOnly, getBooksByCategory);
router.get("/analytics/buyers", protect, adminOnly, getBuyersCount);
router.get("/analytics/sellers", protect, adminOnly, getSellersCount);
router.get("/analytics/sellers/status", protect, adminOnly, getSellerStatusStats);

/* ---------------- USERS ---------------- */
router.get("/users", protect, adminOnly, getAllUsers);

/* ---------------- SELLER MANAGEMENT ---------------- */
router.patch("/sellers/:sellerId/block", protect, adminOnly, blockSeller);
router.patch("/sellers/:sellerId/unblock", protect, adminOnly, unblockSeller);

export default router;
