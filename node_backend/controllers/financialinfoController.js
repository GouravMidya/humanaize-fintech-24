import FinancialInfo from "../models/financialInfoModel.js";
import User from "../models/userModel.js";

export const addFinancialInfo = async (req, res, next) => {
  try {
    const {
      userId,
      monthlyIncome,
      monthlyExpenses,
      financialGoals,
      riskTolerance,
      age,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const financialInfo = new FinancialInfo({
      userId: user._id,
      monthlyIncome,
      monthlyExpenses,
      financialGoals,
      riskTolerance,
      age,
    });

    await financialInfo.save();

    // Update the user document with the financial info
    user.financialInfo = financialInfo;
    await user.save();

    res
      .status(201)
      .json({ message: "Financial info added successfully", financialInfo });
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};
