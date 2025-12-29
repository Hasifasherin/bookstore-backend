import { Request, Response } from "express";
import Book from "../models/Book";
// CREATE
export const createBook = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    if (!req.body.categoryId) {
      return res.status(400).json({ message: "Category is required" });
    }

    const book = await Book.create({
      title: req.body.title,
      authorName: req.body.authorName,
      categoryId: req.body.categoryId,
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

// READ ALL
export const getAllBooks = async (_: Request, res: Response) => {
  const books = await Book.find();
  res.json(books);
};

// READ ONE
export const getBookById = async (req: Request, res: Response) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

// UPDATE
export const updateBook = async (req: Request, res: Response) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  // seller can edit only own books
  if (
    req.user!.role === "seller" &&
    book.createdBy.toString() !== req.user!.id
  ) {
    return res.status(403).json({ message: "Not allowed" });
  }

  book.title = req.body.title ?? book.title;
  book.authorName = req.body.authorName ?? book.authorName;
  book.price = req.body.price ?? book.price;
  book.discount = req.body.discount ?? book.discount;

  if (req.file) book.coverImage = req.file.path;

  await book.save();
  res.json(book);
};

// DELETE
export const deleteBook = async (req: Request, res: Response) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  // seller can delete only own books
  if (
    req.user!.role === "seller" &&
    book.createdBy.toString() !== req.user!.id
  ) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await book.deleteOne();
  res.json({ message: "Book deleted" });
};
