import { Request, Response } from "express";
import User from "../models/User";

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select("-password");
  res.json(users);
};
