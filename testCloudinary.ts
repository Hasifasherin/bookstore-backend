import dotenv from "dotenv";
dotenv.config();

import { cloudinary } from "./src/config/cloudinary";

async function testUpload() {
  try {
    const result = await cloudinary.uploader.upload("./src/assets/test.jpg", {
  folder: "bookstore/test",
  format: "webp",
  public_id: `test-${Date.now()}`,
});

    console.log("Upload successful:", result.secure_url);
  } catch (err) {
    console.error("Upload failed:", err);
  }
}

testUpload();
