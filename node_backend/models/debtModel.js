import mongoose from "mongoose";

const debtSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, "Debt name is required"]
  },
  amount: {
    type: Number,
    required: [true, "Debt amount is required"]
  },
  interestRate: {
    type: Number,
    required: [true, "Interest rate is required"]
  },
  monthlyPayment: {
    type: Number,
    required: [true, "Monthly payment is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Debt", debtSchema);