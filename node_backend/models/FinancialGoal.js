import mongoose from 'mongoose';

const financialGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goalName: {
    type: String,
    required: [true, "Goal name is required"]
  },
  amount: {
    type: Number,
    required: [true, "Goal amount is required"]
  },
  targetDate: {
    type: Date,
    required: [true, "Target date is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('FinancialGoal', financialGoalSchema);