

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};

export const signUpUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, gender, dob, password, role } = req.body;

    if (!firstName || !lastName || !email || !phone || !gender || !dob || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      password: hashedPassword,
      role: role || "buyer"
    });

    res.status(201).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token: generateToken(user._id.toString(), user.role)
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    res.status(200).json({
      user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
      token: generateToken(user._id.toString(), user.role)
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};
