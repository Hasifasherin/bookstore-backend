import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

export default model<ICategory>("Category", categorySchema);
