import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary";

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "bookstore/books",
    format: "webp",
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

// File type filter
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: any) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

// Multer upload
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
