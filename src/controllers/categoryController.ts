import { Request, Response } from "express";
import Category from "../models/Category";
import Book from "../models/Book";

/* ---------------- SLUG HELPER ---------------- */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/* ---------------- CREATE CATEGORY ---------------- */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const slug = slugify(name);

    // Prevent duplicate slug
    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- GET ALL CATEGORIES ---------------- */
export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- UPDATE CATEGORY ---------------- */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const slug = slugify(name);

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- DELETE CATEGORY ---------------- */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Prevent deletion if books exist
    const booksUsingCategory = await Book.countDocuments({
      category: category._id,
      isDeleted: false,
    });

    if (booksUsingCategory > 0) {
      return res.status(400).json({
        message: "Cannot delete category. It is used by existing books.",
      });
    }

    await category.deleteOne();

    res.json({ message: "Category deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
