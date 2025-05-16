import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/util.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const newUser = await User.create({
      email: req.body.email,
      fullName: req.body.fullName,
      password: req.body.password,
      profilePic: req.body.profilePic,
    });

    if (newUser) {
      const token = generateToken(newUser._id, res);
      await newUser.save();
      newUser.password = undefined;
      res.status(201).json({
        message: "User Created Successfully!",
        token,
        user: { newUser },
      });
    } else {
      res.status(400).json({ message: "Invalid User Data!" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error!", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password!" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid Credintials!" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credintials!" });
    }
    const token = generateToken(user._id, res);
    user.password = undefined;
    res.status(200).json({
      message: "User Logged In Successfully!",
      token,
      user,
    });
  } catch (err) {
    console.log(`Error in login controller! ${err.message}`);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out Successfully!" });
  } catch (err) {
    console.log(`Error in logout controller! ${err.message}`);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res
        .status(400)
        .json({ message: "Please provide profile picture!" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json({
      message: "Profile Updated Successfully!",
      user: updatedUser,
    });
  } catch (err) {
    console.log(`Error in updateProfile controller! ${err}`);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({
      message: "User is authenticated!",
      user: req.user,
    });
  } catch (err) {
    console.log(`Error in checkAuth controller! ${err.message}`);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
