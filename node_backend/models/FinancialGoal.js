import mongoose from 'mongoose';

const financialGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goalName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  targetDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('FinancialGoal', financialGoalSchema);