import { Request, Response } from "express";
import Book from "../models/Book";
import Category from "../models/Category";

/* ---------------- CREATE BOOK ---------------- */
export const createBook = async (req: Request, res: Response) => {
  try {
    // Blocked seller check
    if (req.user?.role === "seller" && req.user.isBlocked) {
      return res
        .status(403)
        .json({ message: "Your account is blocked. You cannot add books." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    if (!req.body.categoryId) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Validate category exists
    const categoryExists = await Category.findById(req.body.categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const book = await Book.create({
      title: req.body.title,
      authorName: req.body.authorName,

      // ✅ FIXED (category → categoryId)
      categoryId: req.body.categoryId,

      description: req.body.description,
      publisher: req.body.publisher,
      price: req.body.price,
      discount: req.body.discount || 0,
      coverImage: req.file.path,
      createdBy: req.user!.id,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Book creation failed" });
  }
};

/* ---------------- READ ALL BOOKS ---------------- */
export const getAllBooks = async (_req: Request, res: Response) => {
  const books = await Book.find({ isDeleted: false })
    // ✅ FIXED populate field
    .populate("categoryId", "name")
    .populate("createdBy", "firstName lastName");

  res.json(books);
};

/* ---------------- READ ONE BOOK ---------------- */
export const getBookById = async (req: Request, res: Response) => {
  const book = await Book.findOne({
    _id: req.params.id,
    isDeleted: false,
  }).populate("categoryId", "name");

  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

/* ---------------- UPDATE BOOK ---------------- */
export const updateBook = async (req: Request, res: Response) => {
  // Blocked seller check
  if (req.user?.role === "seller" && req.user.isBlocked) {
    return res
      .status(403)
      .json({ message: "Your account is blocked. You cannot update books." });
  }

  const book = await Book.findById(req.params.id);
  if (!book || book.isDeleted) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Seller ownership check
  if (
    req.user!.role === "seller" &&
    book.createdBy.toString() !== req.user!.id
  ) {
    return res.status(403).json({ message: "Not allowed" });
  }

  // Category validation if changed
  if (req.body.categoryId) {
    const categoryExists = await Category.findById(req.body.categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // ✅ FIXED
    book.categoryId = req.body.categoryId;
  }

  book.title = req.body.title ?? book.title;
  book.authorName = req.body.authorName ?? book.authorName;
  book.price = req.body.price ?? book.price;
  book.discount = req.body.discount ?? book.discount;
  book.description = req.body.description ?? book.description;
  book.publisher = req.body.publisher ?? book.publisher;

  if (req.file) book.coverImage = req.file.path;

  await book.save();
  res.json(book);
};

/* ---------------- DELETE BOOK (SOFT DELETE) ---------------- */
export const deleteBook = async (req: Request, res: Response) => {
  // Blocked seller check
  if (req.user?.role === "seller" && req.user.isBlocked) {
    return res
      .status(403)
      .json({ message: "Your account is blocked. You cannot delete books." });
  }

  const book = await Book.findById(req.params.id);
  if (!book || book.isDeleted) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Seller ownership check
  if (
    req.user!.role === "seller" &&
    book.createdBy.toString() !== req.user!.id
  ) {
    return res.status(403).json({ message: "Not allowed" });
  }

  book.isDeleted = true;
  await book.save();

  res.json({ message: "Book deleted successfully" });
};
