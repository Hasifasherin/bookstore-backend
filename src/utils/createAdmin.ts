import User from "../models/User";
import bcrypt from "bcryptjs";

export const createAdmin = async () => {
  const adminEmail = "admin@bookstore.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin@123", 8);
    await User.create({
      firstName: "Admin",
      lastName: "Bookstore",
      email: adminEmail,
      phone: "0000000000",
      gender: "m",
      dob: new Date("1990-01-01"),
      password: hashedPassword,
      role: "admin"
    });
    console.log("Predefined admin created");
  } else {
    console.log("Admin already exists");
  }
};
