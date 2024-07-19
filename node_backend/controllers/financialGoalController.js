import FinancialGoal from '../models/FinancialGoal.js';
import User from '../models/userModel.js';

export const createGoal = async (req, res) => {
  try {
    const { goalName, amount, targetDate, userId } = req.body;
    const newGoal = new FinancialGoal({
      user: userId,
      goalName,
      amount,
      targetDate
    });

    const savedGoal = await newGoal.save();

    await User.findByIdAndUpdate(userId, { $push: { goals: savedGoal._id } });
    
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getGoals = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const goals = await FinancialGoal.find({ user: userId });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { goalName, amount, targetDate } = req.body;
    const updatedGoal = await FinancialGoal.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { goalName, amount, targetDate, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGoal = await FinancialGoal.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deletedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};