import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "m" | "f";
  dob: Date;
  password: string;
  role: "buyer" | "seller" | "admin";
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ["m", "f"], required: true },
    dob: { type: Date, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
