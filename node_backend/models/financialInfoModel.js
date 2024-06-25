import mongoose from "mongoose";

const financialInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  monthlyIncome: {
    type: String,
  },
  monthlyExpenses: {
    type: String,
  },
  financialGoals: {
    shortTerm: {
      type: String,
    },
    longTerm: {
      type: String,
    },
  },
  riskTolerance: {
    type: String,
    enum: ["low", "moderate", "high", "Low", "Moderate", "High"],
  },
  age: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const FinancialInfo = mongoose.model("FinancialInfo", financialInfoSchema);

export default FinancialInfo;
