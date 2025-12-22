import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { getSliders, createSlider, updateSlider, deleteSlider } from "../controllers/sliderController";

const router = Router();

router.get("/", getSliders);
router.post("/", protect, adminOnly, upload.single("image"), createSlider);
router.put("/:id", protect, adminOnly, upload.single("image"), updateSlider);
router.delete("/:id", protect, adminOnly, deleteSlider);

export default router;
