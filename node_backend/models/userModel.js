import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import FinancialInfo from "./financialInfoModel.js";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  chat_sessions: [
    {
      chat_session_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatSession",
      },
      chat_name: {
        type: String,
        required: true,
      },
    },
  ],
  financialInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FinancialInfo",
  },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

export default mongoose.model("User", userSchema);
