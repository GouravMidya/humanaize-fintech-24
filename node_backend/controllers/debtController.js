import Debt from '../models/debtModel.js';
import User from '../models/userModel.js';

export const createDebt = async (req, res) => {
  try {
    const { name, amount, interestRate, monthlyPayment, userId } = req.body;

    const newDebt = new Debt({
      user: userId,
      name,
      amount,
      interestRate,
      monthlyPayment
    });

    const savedDebt = await newDebt.save();

    await User.findByIdAndUpdate(userId, { $push: { debts: savedDebt._id } });

    res.status(201).json(savedDebt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDebts = async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from request body
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const debts = await Debt.find({ user: userId });
    res.status(200).json(debts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDebtById = async (req, res) => {
  try {
    const debt = await Debt.findOne({ _id: req.params.id, user: req.user.id });
    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }
    res.status(200).json(debt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDebt = async (req, res) => {
  try {
    const { name, amount, interestRate, monthlyPayment } = req.body;
    const updatedDebt = await Debt.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, amount, interestRate, monthlyPayment },
      { new: true }
    );
    if (!updatedDebt) {
      return res.status(404).json({ message: 'Debt not found' });
    }
    res.status(200).json(updatedDebt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDebt = async (req, res) => {
  try {
    const deletedDebt = await Debt.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedDebt) {
      return res.status(404).json({ message: 'Debt not found' });
    }
    await User.findByIdAndUpdate(req.user.id, { $pull: { debts: req.params.id } });
    res.status(200).json({ message: 'Debt deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};