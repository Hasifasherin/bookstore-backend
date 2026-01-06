
import { Schema, model, Types } from "mongoose";

const sliderSchema = new Schema({
  imageUrl: { type: String, required: true },
  title: { type: String },
  createdBy: { type: Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default model("Slider", sliderSchema);