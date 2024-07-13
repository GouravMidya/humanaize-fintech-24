// controllers/expenseController.js

import Expense from "../models/expenseModel.js";

export const getExpenses = async (req, res) => {
    try {
      const userId = req.body;
      console.log('Fetching expenses for userId:', userId.userId);
      const expenses = await Expense.find({ userId: userId.userId });
      console.log('Fetched expenses:', expenses);
      res.json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

export const addExpense = async (req, res) => {
  try {
    const { userId, amount, category, date, description } = req.body;
    console.log("REACHED HERE",userId);
    const newExpense = new Expense({ userId, amount, category, date, description });
    await newExpense.save();
    res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, date, description } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(id, { amount, category, date, description }, { new: true });
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense updated successfully', expense: updatedExpense });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted successfully', expense: deletedExpense });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getExpensesByDateRange = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.body;
    const expenses = await Expense.find({
      userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses by date range:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};