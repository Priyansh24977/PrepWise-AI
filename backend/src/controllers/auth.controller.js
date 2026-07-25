import User from "../models/user.model.js";
import tokenBlacklistModel from "../models/blacklist.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/mail.js";

/**
 * @name registerUserController
 * @description Controller to handle user registration
 * @route POST /api/auth/register
 * @access Public
 */
export async function registerUserController(req, res) {
  let { username, email, password } = req.body;

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

  const user = new User({
    username,
    email,
    password: hashedPassword,
  });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;

  user.otpExpiry = Date.now() + 5 * 60 * 1000;

  await user.save();
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: user.email,

    subject: "Verify your Email",

    html: `
        <h2>Your OTP</h2>

        <h1>${otp}</h1>

        <p>OTP expires in 5 minutes.</p>
    `,
  });
 return res.status(201).json({
  success: true,
  message: "OTP sent successfully.",
});
 
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

  if (!user.isVerified) {
  return res.status(403).json({
    message: "Please verify your email first.",
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

export async function verifyOtpController(req, res) {

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "Email and OTP are required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (user.otp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  if (user.otpExpiry < Date.now()) {
    return res.status(400).json({
      message: "OTP expired",
    });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Email verified successfully.",
  });

}

//  default registerUserController;
