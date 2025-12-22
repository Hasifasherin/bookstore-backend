import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string; role: "admin" | "seller" | "buyer" };

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ ADMIN ONLY
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

// ✅ ADMIN OR SELLER
export const adminOrSeller = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.user?.role === "admin" ||
    req.user?.role === "seller"
  ) {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};
