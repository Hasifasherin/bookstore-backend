
 import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "bookstore/books",
    format: "webp",
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

export const upload = multer({ storage });
