import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    bookId: {
      type: Types.ObjectId,
      ref: "Book",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Review", reviewSchema);