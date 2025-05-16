import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized! Please login." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized! Invalid Token." });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(`Error in protect middleware! ${err.message}`);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
