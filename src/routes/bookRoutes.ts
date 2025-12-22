import { Router } from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
} from "../controllers/bookController";
import { protect, adminOrSeller } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

//  get all books (for homepage)
router.get("/", getAllBooks);

// get single book (details page)
router.get("/:id", getBookById);

// create book
router.post(
  "/",
  protect,
  adminOrSeller,
  upload.single("coverImage"),
  createBook
);

export default router;
