import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
        type: String,
        required: true,
      },
      chat_name: {
        type: String,
      },
    },
  ],
  financialInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FinancialInfo",
  },
  debts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Debt",
    },
  ],
  goals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinancialGoal",
    },
  ],
},{ 
  versionKey: false 
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

export default mongoose.model("User", userSchema);
