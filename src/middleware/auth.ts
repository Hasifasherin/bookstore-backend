import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

/* ---------------- AUTH PROTECT ---------------- */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    // Fetch fresh user from DB (IMPORTANT)
    const user = await User.findById(decoded.id).select("role isBlocked");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      isBlocked: user.isBlocked,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ---------------- ADMIN ONLY ---------------- */
export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

/* ---------------- ADMIN OR SELLER ---------------- */
export const adminOrSeller = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "admin" || req.user?.role === "seller") {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};

/* ---------------- NOT BLOCKED SELLER ---------------- */
export const notBlockedSeller = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "seller" && req.user.isBlocked) {
    return res.status(403).json({
      message: "Your account has been blocked by admin",
    });
  }
  next();
};
