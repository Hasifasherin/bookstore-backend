import { Router } from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController";
import {
  protect,
  adminOrSeller,
  notBlockedSeller,
} from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  getBookReviews,
  addBookReview,
  updateBookReview,
  deleteBookReview,
} from "../controllers/reviewController";

const router = Router();

/* ---------------- PUBLIC ---------------- */
router.get("/", getAllBooks);
router.get("/:id", getBookById);

/* ---------------- REVIEWS ---------------- */
router.get("/:bookId/reviews", getBookReviews);
router.post("/:bookId/reviews", protect, addBookReview);
router.put("/reviews/:reviewId", protect, updateBookReview);
router.delete("/reviews/:reviewId", protect, deleteBookReview);

/* ---------------- ADMIN / SELLER ---------------- */
router.post(
  "/",
  protect,
  adminOrSeller,
  notBlockedSeller,
  upload.single("coverImage"),
  createBook
);

router.put(
  "/:id",
  protect,
  adminOrSeller,
  notBlockedSeller,
  upload.single("coverImage"),
  updateBook
);

router.delete(
  "/:id",
  protect,
  adminOrSeller,
  notBlockedSeller,
  deleteBook
);

export default router;
