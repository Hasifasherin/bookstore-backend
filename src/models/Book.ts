import { Schema, model, Types, Document } from "mongoose";

export interface IBook extends Document {
  title: string;
  authorName: string;
  categoryId: Types.ObjectId;
  description?: string;
  publisher?: string;
  price: number;
  discount: number;
  coverImage: string;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    authorName: { type: String, required: true },

    // ✅ STANDARDIZED FIELD NAME
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
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
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

export default model<IBook>("Book", bookSchema);
