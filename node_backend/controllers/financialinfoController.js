import FinancialInfo from '../models/financialInfoModel.js';

export const addFinancialInfo = async (req, res) => {
  try {
    const { userId, monthlyIncome, monthlyExpenses, shortTermGoals, longTermGoals, riskTolerance, age } = req.body;

    const newFinancialInfo = new FinancialInfo({
      userId,
      monthlyIncome,
      monthlyExpenses,
      shortTermGoals,
      longTermGoals,
      riskTolerance,
      age
    });

    await newFinancialInfo.save();

    res.status(201).json({ message: 'Financial information added successfully' });
  } catch (error) {
    console.error('Error adding financial information:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const getFinancialInfoByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const financialInfo = await FinancialInfo.findOne({ userId });

    if (!financialInfo) {
      return res.status(404).json({ message: 'Financial information not found' });
    }

    res.status(200).json({ financialInfo });
  } catch (error) {
    console.error('Error fetching financial information:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const updateFinancialInfo = async (req, res) => {
  try {
    const updateData = req.body;
    const userId=updateData.userId;
    const updatedFinancialInfo = await FinancialInfo.findOneAndUpdate({ userId }, updateData, { new: true });

    if (!updatedFinancialInfo) {
      return res.status(404).json({ message: 'Financial information not found' });
    }

    res.status(200).json({ message: 'Financial information updated successfully', financialInfo: updatedFinancialInfo });
  } catch (error) {
    console.error('Error updating financial information:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const deleteFinancialInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedFinancialInfo = await FinancialInfo.findOneAndDelete({ userId });

    if (!deletedFinancialInfo) {
      return res.status(404).json({ message: 'Financial information not found' });
    }

    res.status(200).json({ message: 'Financial information deleted successfully', financialInfo: deletedFinancialInfo });
  } catch (error) {
    console.error('Error deleting financial information:', error);
    res.status(500).json({ message: 'Server error' });
  }
};