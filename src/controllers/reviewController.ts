import { Request, Response } from "express";
import Review from "../models/Review";
import Book from "../models/Book";

/* ================= GET REVIEWS ================= */
export const getBookReviews = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.find({ bookId })
      .populate("userId", "firstName lastName")
      .sort({ createdAt: -1 });

    const total = reviews.length;
    const averageRating =
      total === 0
        ? 0
        : Math.round(
            reviews.reduce((sum, r) => sum + r.rating, 0) / total
          );

    res.json({
      items: reviews,
      total,
      averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load reviews" });
  }
};

/* ================= ADD REVIEW ================= */
export const addBookReview = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can review books" });
    }

    const { bookId } = req.params;
    const { rating, comment } = req.body;

    const existing = await Review.findOne({
      bookId,
      userId: req.user.id,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You already reviewed this book" });
    }

    const review = await Review.create({
      bookId,
      userId: req.user.id,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Review failed" });
  }
};

