import Portfolio from '../models/Portfolio.js';

export const getPortfolio = async (req, res) => {
  
const { userId } = req.query;
  const portfolio = await Portfolio.findOne({ userId: userId });
  res.json(portfolio ? portfolio.stocks : []);
};

export const addToPortfolio = async (req, res) => {
  const { userId,symbol, name, quantity, buyPrice } = req.body;
  let portfolio = await Portfolio.findOne({ userId: userId });

  if (!portfolio) {
    portfolio = new Portfolio({ userId: userId, stocks: [] });
  }

  portfolio.stocks.push({ symbol, name, quantity, buyPrice });
  await portfolio.save();

  res.status(201).json(portfolio.stocks);
};

// We don't need the updateStockPrices function anymore