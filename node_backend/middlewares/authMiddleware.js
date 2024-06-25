import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//for protecting the chat route ie only logged in users can access it
export const userVerification = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      try {
        const user = await User.findById(data.id);
        if (user) {
          return res.json({ status: true, user: user.username });
        } else {
          return res.json({ status: false });
        }
      } catch (error) {
        console.error(error);
        return res.json({ status: false });
      }
    }
  });
};
