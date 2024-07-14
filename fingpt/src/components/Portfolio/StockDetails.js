import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

function StockDetails({ symbol, onStockDataUpdate }) {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
        console.log(`API Request: Fetching details for stock symbol "${symbol}"`);
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
        );
        setStockData(response.data['Global Quote']);
        onStockDataUpdate(response.data['Global Quote']);  // Add this line
        setLoading(false);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      }
    };

    if (symbol) {
      fetchStockData();
    }
  }, [symbol, onStockDataUpdate]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!stockData) {
    return <Typography>No data available</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {symbol}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: ${parseFloat(stockData['05. price']).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Change: {stockData['09. change']} ({stockData['10. change percent']})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Volume: {stockData['06. volume']}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default StockDetails;