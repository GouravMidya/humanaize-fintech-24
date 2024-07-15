import FinancialGoal from '../models/FinancialGoal.js';

export const createGoal = async (req, res) => {
  try {
    const { goalName, amount, targetDate } = req.body;
    const newGoal = new FinancialGoal({
      userId: req.user.id,
      goalName,
      amount,
      targetDate
    });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getGoals = async (req, res) => {
  try {
    const goals = await FinancialGoal.find({ userId: req.user.id });
    res.json(goals);
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