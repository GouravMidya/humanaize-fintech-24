import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

function PortfolioTable({ portfolio, onUpdateStock, onDeleteStock }) {
  const [currentPrices, setCurrentPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState("");
  const [editedBuyPrice, setEditedBuyPrice] = useState("");

  useEffect(() => {
    const fetchCurrentPrices = async () => {
      setLoading(true);
      const prices = {};
      for (const stock of portfolio) {
        try {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${API_KEY}`
          );
          prices[stock.symbol] = parseFloat(
            response.data["Global Quote"]["05. price"]
          );
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
    const totalCost = stocks.reduce(
      (sum, stock) => sum + stock.buyPrice * stock.quantity,
      0
    );
    const totalQuantity = stocks.reduce(
      (sum, stock) => sum + stock.quantity,
      0
    );
    return totalCost / totalQuantity;
  };

  const aggregatePortfolio = (portfolio) => {
    const aggregated = {};
    portfolio.forEach((stock) => {
      if (aggregated[stock.symbol]) {
        aggregated[stock.symbol].quantity += stock.quantity;
        aggregated[stock.symbol].stocks.push(stock);
      } else {
        aggregated[stock.symbol] = {
          symbol: stock.symbol,
          name: stock.name,
          quantity: stock.quantity,
          stocks: [stock],
        };
      }
    });
    return Object.values(aggregated);
  };

  const calculateTotal = (aggregatedPortfolio) => {
    return aggregatedPortfolio.reduce((total, stock) => {
      const currentPrice =
        currentPrices[stock.symbol] || calculateAverageBuyPrice(stock.stocks);
      return total + currentPrice * stock.quantity;
    }, 0);
  };

  const calculateProfitLoss = (avgBuyPrice, currentPrice, quantity) => {
    return (currentPrice.toFixed(2) - avgBuyPrice.toFixed(2)) * quantity;
  };

  const handleEdit = (stock) => {
    setEditingId(stock.stocks[0]._id);
    setEditedQuantity(stock.quantity.toString());
    setEditedBuyPrice(calculateAverageBuyPrice(stock.stocks).toFixed(2));
  };

  const handleSave = (stockId) => {
    onUpdateStock(stockId, {
      quantity: editedQuantity,
      buyPrice: editedBuyPrice,
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
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
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {aggregatedPortfolio.map((stock) => {
            const avgBuyPrice = calculateAverageBuyPrice(stock.stocks);
            const currentPrice = currentPrices[stock.symbol] || avgBuyPrice;
            const totalValue = currentPrice * stock.quantity;
            const profitLoss = calculateProfitLoss(
              avgBuyPrice,
              currentPrice,
              stock.quantity
            );
            return (
              <TableRow key={stock.symbol}>
                <TableCell>{stock.symbol}</TableCell>
                <TableCell>{stock.name}</TableCell>
                <TableCell align="right">
                  {editingId === stock.stocks[0]._id ? (
                    <TextField
                      value={editedQuantity}
                      onChange={(e) => setEditedQuantity(e.target.value)}
                      type="number"
                    />
                  ) : (
                    stock.quantity
                  )}
                </TableCell>
                <TableCell align="right">
                  {editingId === stock.stocks[0]._id ? (
                    <TextField
                      value={editedBuyPrice}
                      onChange={(e) => setEditedBuyPrice(e.target.value)}
                      type="number"
                    />
                  ) : (
                    `₹${avgBuyPrice.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell align="right">₹{currentPrice.toFixed(2)}</TableCell>
                <TableCell align="right">₹{totalValue.toFixed(2)}</TableCell>
                <TableCell
                  align="right"
                  style={{ color: profitLoss >= 0 ? "green" : "red" }}
                >
                  ₹{profitLoss.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {editingId === stock.stocks[0]._id ? (
                    <>
                      <Button onClick={() => handleSave(stock.stocks[0]._id)}>
                        Save
                      </Button>
                      <Button onClick={handleCancel}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEdit(stock)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => onDeleteStock(stock.stocks[0]._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell colSpan={5} align="right">
              Total Portfolio Value:
            </TableCell>
            <TableCell align="right">
              ₹{calculateTotal(aggregatedPortfolio).toFixed(2)}
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PortfolioTable;
