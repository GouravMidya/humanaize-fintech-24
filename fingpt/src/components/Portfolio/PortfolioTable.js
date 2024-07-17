import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell,Typography, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

function PortfolioTable({ portfolio }) {
  const [currentPrices, setCurrentPrices] = useState({});
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchCurrentPrices = async () => {
      setLoading(true);
      const prices = {};
      for (const stock of portfolio) {
        try {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${API_KEY}`
          );
          prices[stock.symbol] = parseFloat(response.data['Global Quote']['05. price']);
        } catch (error) {
          console.error(`Error fetching price for ${stock.symbol}:`, error);
          prices[stock.symbol] = null;
        }
      }
      setCurrentPrices(prices);
      setLoading(false);
    };

    if (portfolio.length > 0) {
      fetchCurrentPrices();
    } else {
      setLoading(false);
    }
  }, [portfolio]);


  const calculateAverageBuyPrice = (stocks) => {
    const totalCost = stocks.reduce((sum, stock) => sum + stock.buyPrice * stock.quantity, 0);
    const totalQuantity = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
    return totalCost / totalQuantity;
  };

  const aggregatePortfolio = (portfolio) => {
    const aggregated = {};
    portfolio.forEach(stock => {
      if (aggregated[stock.symbol]) {
        aggregated[stock.symbol].quantity += stock.quantity;
        aggregated[stock.symbol].stocks.push(stock);
      } else {
        aggregated[stock.symbol] = {
          symbol: stock.symbol,
          name: stock.name,
          quantity: stock.quantity,
          stocks: [stock]
        };
      }
    });
    return Object.values(aggregated);
  };

  const calculateTotal = (aggregatedPortfolio) => {
    return aggregatedPortfolio.reduce((total, stock) => {
      const currentPrice = currentPrices[stock.symbol] || calculateAverageBuyPrice(stock.stocks);
      return total + currentPrice * stock.quantity;
    }, 0);
  };

  const calculateProfitLoss = (avgBuyPrice, currentPrice, quantity) => {
    return (currentPrice.toFixed(2) - avgBuyPrice.toFixed(2)) * quantity;
  };

  if (loading) {
    return <CircularProgress />;
  }
  const aggregatedPortfolio = aggregatePortfolio(portfolio);

  if (aggregatedPortfolio.length === 0) {
    return (
      <Typography variant="body1" align="center">
        Your portfolio is empty. Add stocks to see them here.
      </Typography>
    );
  }


  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Avg. Buy Price</TableCell>
            <TableCell align="right">Current Price</TableCell>
            <TableCell align="right">Total Value</TableCell>
            <TableCell align="right">Profit/Loss</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {aggregatedPortfolio.map((stock) => {
            const avgBuyPrice = calculateAverageBuyPrice(stock.stocks);
            const currentPrice = currentPrices[stock.symbol] || avgBuyPrice;
            const totalValue = currentPrice * stock.quantity;
            const profitLoss = calculateProfitLoss(avgBuyPrice, currentPrice, stock.quantity);
            return (
              <TableRow key={stock.symbol}>
                <TableCell>{stock.symbol}</TableCell>
                <TableCell>{stock.name}</TableCell>
                <TableCell align="right">{stock.quantity}</TableCell>
                <TableCell align="right">₹{avgBuyPrice.toFixed(2)}</TableCell>
                <TableCell align="right">₹{currentPrice.toFixed(2)}</TableCell>
                <TableCell align="right">₹{totalValue.toFixed(2)}</TableCell>
                <TableCell align="right" style={{ color: profitLoss >= 0 ? 'green' : 'red' }}>
                  ₹{profitLoss.toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell colSpan={5} align="right">Total Portfolio Value:</TableCell>
            <TableCell align="right">₹{calculateTotal(aggregatedPortfolio).toFixed(2)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PortfolioTable;