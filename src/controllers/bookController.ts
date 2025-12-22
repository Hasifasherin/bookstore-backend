import { Request, Response } from "express";
import Book from "../models/Book";

export const createBook = async (req: Request, res: Response) => {
  try {
    const {
      title,
      authorName,
      categoryId,
      price,
      discount,
      description,
      publisher,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    const book = await Book.create({
      title,
      authorName,
      categoryId,
      price,
      discount,
      description,
      publisher,
      coverImage: req.file.path, // Cloudinary URL
      createdBy: req.user!.id,
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: "Book creation failed" });
  }
};

export const getAllBooks = async (_: Request, res: Response) => {
  const books = await Book.find().populate("categoryId", "name");
  res.json(books);
};

export const getBookById = async (req: Request, res: Response) => {
  const book = await Book.findById(req.params.id).populate("categoryId", "name");
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};
