import Portfolio from "../models/Portfolio.js";

export const getPortfolio = async (req, res) => {
  const { userId } = req.query;
  const portfolio = await Portfolio.findOne({ userId: userId });
  res.json(portfolio ? portfolio.stocks : []);
};

export const addToPortfolio = async (req, res) => {
  const { userId, symbol, name, quantity, buyPrice } = req.body;
  let portfolio = await Portfolio.findOne({ userId: userId });

  if (!portfolio) {
    portfolio = new Portfolio({ userId: userId, stocks: [] });
  }

  portfolio.stocks.push({ symbol, name, quantity, buyPrice });
  await portfolio.save();

  res.status(201).json(portfolio.stocks);
};

// We don't need the updateStockPrices function anymore

export const updateStock = async (req, res) => {
  const { userId, stockId, quantity, buyPrice } = req.body;

  try {
    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const stockIndex = portfolio.stocks.findIndex(
      (stock) => stock._id.toString() === stockId
    );

    if (stockIndex === -1) {
      return res.status(404).json({ message: "Stock not found in portfolio" });
    }

    portfolio.stocks[stockIndex].quantity = quantity;
    portfolio.stocks[stockIndex].buyPrice = buyPrice;

    await portfolio.save();

    res.json(portfolio.stocks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating stock", error: error.message });
  }
};

export const deleteStock = async (req, res) => {
  const { userId, stockId } = req.body;

  try {
    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    portfolio.stocks = portfolio.stocks.filter(
      (stock) => stock._id.toString() !== stockId
    );

    await portfolio.save();

    res.json(portfolio.stocks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting stock", error: error.message });
  }
};
