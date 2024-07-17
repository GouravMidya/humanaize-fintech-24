import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userVerification = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ status: false, message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ status: false, message: "User not found" });
    }
    
    req.user = { id: user._id, username: user.username };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};