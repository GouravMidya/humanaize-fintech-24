import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

function StockDetails({ symbol, onStockDataUpdate }) {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
        );
        setStockData(response.data['Global Quote']);
        onStockDataUpdate(response.data['Global Quote']); // Add this line
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      }
    };

    if (symbol) {
      fetchStockData();
    }
  }, [symbol]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!stockData) {
    return <Typography>No data available</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {stockData['01. symbol']}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Latest Trading Day: {stockData['07. latest trading day']}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Open: ₹{parseFloat(stockData['02. open']).toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              High: ₹{parseFloat(stockData['03. high']).toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Low: ₹{parseFloat(stockData['04. low']).toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Price: ₹{parseFloat(stockData['05. price']).toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Volume: {stockData['06. volume']}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Previous Close: ₹{parseFloat(stockData['08. previous close']).toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Change: {stockData['09. change']} ({stockData['10. change percent']})
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default StockDetails;
