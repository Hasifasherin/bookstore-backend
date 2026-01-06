
import { Request, Response } from "express";
import Slider from "../models/Slider";

export const getSliders = async (_req: Request, res: Response) => {
  const sliders = await Slider.find();
  res.json(sliders);
};

export const createSlider = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: "Image is required" });
  const slider = await Slider.create({ imageUrl: req.file.path, createdBy: req.user!.id });
  res.status(201).json(slider);
};

export const updateSlider = async (req: Request, res: Response) => {
  const slider = await Slider.findById(req.params.id);
  if (!slider) return res.status(404).json({ message: "Slider not found" });
  if (req.file) slider.imageUrl = req.file.path;
  await slider.save();
  res.json(slider);
};

export const deleteSlider = async (req: Request, res: Response) => {
  await Slider.findByIdAndDelete(req.params.id);
  res.json({ message: "Slider deleted" });
};