import { Schema, model, Types } from "mongoose";

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    authorName: { type: String, required: true },

    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: { type: String },
    publisher: { type: String },

    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },

    coverImage: { type: String, required: true },

    createdBy: {
      type: Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Book", bookSchema);
