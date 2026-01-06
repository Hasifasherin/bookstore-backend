import { Request, Response } from "express";
import Book from "../models/Book";
import User from "../models/User";
import Category from "../models/Category";

/* ---------------- Total Books ---------------- */
export const getBooksCount = async (_req: Request, res: Response) => {
  try {
    const total = await Book.countDocuments();
    res.json({ total });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- Books by Category ---------------- */
export const getBooksByCategory = async (_req: Request, res: Response) => {
  try {
    // Aggregate books by categoryId (ObjectId)
    const books = await Book.aggregate([
      { $group: { _id: "$categoryId", count: { $sum: 1 } } },
    ]);

    // Replace ObjectId with actual category name
    const result = await Promise.all(
      books.map(async (b) => {
        const category = await Category.findById(b._id);
        return {
          category: category?.name || "Unknown",
          count: b.count,
        };
      })
    );

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- Total Buyers ---------------- */
export const getBuyersCount = async (_req: Request, res: Response) => {
  try {
    const totalBuyers = await User.countDocuments({ role: "buyer" });
    res.json({ total: totalBuyers });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- Total Sellers ---------------- */
export const getSellersCount = async (_req: Request, res: Response) => {
  try {
    const totalSellers = await User.countDocuments({ role: "seller" });
    res.json({ total: totalSellers });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- Get All Users ---------------- */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.query; // optional filter ?role=buyer or ?role=seller
    const filter: any = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select("-password") // don't send password
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
