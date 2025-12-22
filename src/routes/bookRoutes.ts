import { Router } from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController";
import { protect, adminOrSeller } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// PUBLIC
router.get("/", getAllBooks);
router.get("/:id", getBookById);

// ADMIN / SELLER
router.post(
  "/",
  protect,
  adminOrSeller,
  upload.single("coverImage"),
  createBook
);

router.put(
  "/:id",
  protect,
  adminOrSeller,
  upload.single("coverImage"),
  updateBook
);

router.delete(
  "/:id",
  protect,
  adminOrSeller,
  deleteBook
);

export default router;
