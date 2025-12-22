import { Router } from "express";
import { getAllUsers } from "../controllers/adminController";
import { protect } from "../middleware/auth";
import { adminOnly } from "../middleware/admin"; 
const router = Router();

router.get("/users", protect, adminOnly, getAllUsers);

export default router;
