import mongoose, { model } from "mongoose";
import { IUser } from "../types/user";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.passwordMatch = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

const User = model<IUser>("User", userSchema);
export default User;
