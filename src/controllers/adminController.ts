import { Request, Response } from "express";
import Book from "../models/Book";
import User from "../models/User";
import Category from "../models/Category";

/* ---------------- TOTAL BOOKS ---------------- */
export const getBooksCount = async (_req: Request, res: Response) => {
  try {
    const total = await Book.countDocuments({ isDeleted: false });
    res.json({ total });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- BOOKS BY CATEGORY ---------------- */
export const getBooksByCategory = async (_req: Request, res: Response) => {
  try {
    const books = await Book.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = await Promise.all(
      books.map(async (b) => {
        const category = await Category.findById(b._id);
        return {
          category: category ? category.name : "Unknown",
          count: b.count,
        };
      })
    );

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- TOTAL BUYERS ---------------- */
export const getBuyersCount = async (_req: Request, res: Response) => {
  try {
    const total = await User.countDocuments({ role: "buyer" });
    res.json({ total });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- TOTAL SELLERS ---------------- */
export const getSellersCount = async (_req: Request, res: Response) => {
  try {
    const total = await User.countDocuments({ role: "seller" });
    res.json({ total });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- SELLER STATUS STATS ---------------- */
export const getSellerStatusStats = async (_req: Request, res: Response) => {
  try {
    const active = await User.countDocuments({
      role: "seller",
      isBlocked: false,
    });

    const blocked = await User.countDocuments({
      role: "seller",
      isBlocked: true,
    });

    res.json({ active, blocked });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- GET ALL USERS ---------------- */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, isBlocked } = req.query;

    const filter: any = {};
    if (role) filter.role = role;
    if (isBlocked !== undefined)
      filter.isBlocked = isBlocked === "true";

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- BLOCK SELLER ---------------- */
export const blockSeller = async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.params;

    const seller = await User.findById(sellerId);

    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.isBlocked = true;
    await seller.save();

    res.json({ message: "Seller blocked successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- UNBLOCK SELLER ---------------- */
export const unblockSeller = async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.params;

    const seller = await User.findById(sellerId);

    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.isBlocked = false;
    await seller.save();

    res.json({ message: "Seller unblocked successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
