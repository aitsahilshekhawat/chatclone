import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
// SIGNUP
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password too short",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error.message);
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",

      token,

      user,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const checkAuth = (req, res) => {
  res.status(200).json({
    message: "Protected route accessed",
    user: req.user,
  });
};
export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;

    const users = await User.find({
      _id: {
        $ne: loggedInUserId,
      },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.log("Get Users Error:", error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};