// const mongoose=require('mongoose');
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "username already taken"],
    required: true,
  },
  email: {
    type: String,
    unique: [true, "Account already exsits with this email address"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },

  otpExpiry: {
    type: Date,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
