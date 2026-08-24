import User from "../models/user.model.js";
import tokenBlacklistModel from "../models/blacklist.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import OtpModel from "../models/otp.model.js";
import { sendOtpEmail } from "../services/email.service.js";

/**
 * @name sendOtpController
 * @description Generates and sends OTP for registration verification
 * @route POST /api/auth/send-otp
 * @access Public
 */
export async function sendOtpController(req, res) {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        message: "Please provide both email and username",
      });
    }

    const isUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (isUser) {
      return res.status(400).json({
        message: "User already exists with this username or email",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpModel.deleteMany({ email: email.toLowerCase() });
    await OtpModel.create({
      email: email.toLowerCase(),
      otp,
      createdAt: new Date(),
    });

    const emailResult = await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${email}`,
      mode: emailResult.mode,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to send OTP",
    });
  }
}

/**
 * @name registerWithOtpController
 * @description Verifies OTP and registers the user
 * @route POST /api/auth/register-with-otp
 * @access Public
 */
export async function registerWithOtpController(req, res) {
  try {
    const { username, email, password, otp } = req.body;

    if (!username || !email || !password || !otp) {
      return res.status(400).json({
        message: "Please provide username, email, password, and OTP code",
      });
    }

    const isUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (isUser) {
      return res.status(400).json({
        message: "User already exists with this username or email",
      });
    }

    const otpRecord = await OtpModel.findOne({
      email: email.toLowerCase(),
      otp: otp.trim(),
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid or expired OTP verification code",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await OtpModel.deleteMany({ email: email.toLowerCase() });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Account verified and created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Registration failed",
    });
  }
}

/**
 * @name registerUserController
 * @description Controller to handle user registration
 * @route POST /api/auth/register
 * @access Public
 */
export async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const isUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (isUser) {
      return res.status(400).json({
        message: "User already exists with this username or email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 * @name loginUserController
 * @description Controller to handle user login
 * @route POST /api/auth/login
 * @access Public
 */
export async function loginUserController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or Password",
    });
  }



  const isPasswordVaild = await bcrypt.compare(password, user.password);

  if (!isPasswordVaild) {
    return res.status(400).json({
      message: "Invalid email or Password",
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json({
    message: "User loggedIn successfully.",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}
/**
 * @name logoutUserController
 * @description Controller to handle user logout
 * @route GET /api/auth/logout
 * @access Public
 */

export async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (token) {
    const blacklist = new tokenBlacklistModel({ token });
    await blacklist.save();
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.status(200).json({
    message: "user logout successfully",
  });
}
/**
 * @name getmeController
 * @description Controller to get the logged in user details
 * @route GET /api/auth/getme
 * @access Private
 */
export async function getmeController(req, res) {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    message: "user details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

