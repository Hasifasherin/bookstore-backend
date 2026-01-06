import { Request, Response } from "express";
import Book from "../models/Book";

/* ---------------- CREATE BOOK ---------------- */
export const createBook = async (req: Request, res: Response) => {
  try {
    // Validate required fields
    if (!req.file) {
      return res.status(400).json({ message: "Cover image is required" });
    }
    if (!req.body.categoryId) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Create book
    const book = await Book.create({
      title: req.body.title,
      authorName: req.body.authorName,
      category: req.body.categoryId, // map categoryId → category
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
  const books = await Book.find().populate("category", "name"); // populate category name
  res.json(books);
};

/* ---------------- READ ONE BOOK ---------------- */
export const getBookById = async (req: Request, res: Response) => {
  const book = await Book.findById(req.params.id).populate("category", "name");
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

/* ---------------- UPDATE BOOK ---------------- */
export const updateBook = async (req: Request, res: Response) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  // Only seller can edit own books
  if (req.user!.role === "seller" && book.createdBy.toString() !== req.user!.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  // Update fields
  book.title = req.body.title ?? book.title;
  book.authorName = req.body.authorName ?? book.authorName;
  book.price = req.body.price ?? book.price;
  book.discount = req.body.discount ?? book.discount;
  book.category = req.body.categoryId ?? book.category; // update category
  if (req.file) book.coverImage = req.file.path;

  await book.save();
  res.json(book);
};

/* ---------------- DELETE BOOK ---------------- */
export const deleteBook = async (req: Request, res: Response) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  // Only seller can delete own books
  if (req.user!.role === "seller" && book.createdBy.toString() !== req.user!.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await book.deleteOne();
  res.json({ message: "Book deleted" });
};
