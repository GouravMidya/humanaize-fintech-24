import React, { useState, useEffect } from 'react';
import { Typography, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const API_KEY = 'VSOEVEZQ4OB4RC7D';

function PerformanceChart({ portfolio = [] }) {
  const [selectedStock, setSelectedStock] = useState('');
  const [timeRange, setTimeRange] = useState(30);
  const [chartData, setChartData] = useState([]);
  const [outputSize, setOutputSize] = useState('compact'); // Default to 'compact'

  useEffect(() => {
    const fetchData = async () => {
      if (selectedStock) {
        console.log(`API Request: Fetching daily adjusted data for ${selectedStock} with output size ${outputSize}`);
        try {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${selectedStock}&outputsize=${outputSize}&apikey=${API_KEY}`
          );
          console.log(response);

          if (response.data['Time Series (Daily)']) {
            const timeSeriesData = response.data['Time Series (Daily)'];
            const data = Object.entries(timeSeriesData)
              .slice(0, timeRange)
              .map(([date, values]) => ({
                date,
                price: parseFloat(values['4. close'])
              }))
              .reverse();
            setChartData(data);
          } else {
            console.error('Unexpected API response format:', response.data);
            setChartData([]);
          }
        } catch (error) {
          console.error('Error fetching stock data:', error);
          setChartData([]);
        }
      } else {
        // Placeholder for portfolio performance
        const data = Array.from({ length: timeRange }, (_, i) => ({
          date: new Date(Date.now() - (timeRange - 1 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          price: Math.random() * 1000 + 500
        }));
        setChartData(data);
      }
    };

    fetchData();
  }, [selectedStock, timeRange, outputSize, portfolio]);

  if (portfolio.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        Your portfolio is empty. Add stocks to see performance data.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        This chart shows the performance of {selectedStock ? `${selectedStock}` : 'your entire portfolio'} over time.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Stock</InputLabel>
          <Select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            label="Stock"
          >
            <MenuItem value="">All Portfolio</MenuItem>
            {portfolio.map((stock) => (
              <MenuItem key={stock.symbol} value={stock.symbol}>{stock.symbol}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
          >
            <MenuItem value={7}>1 Week</MenuItem>
            <MenuItem value={30}>1 Month</MenuItem>
            <MenuItem value={90}>3 Months</MenuItem>
            <MenuItem value={180}>6 Months</MenuItem>
            <MenuItem value={365}>1 Year</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Output Size</InputLabel>
          <Select
            value={outputSize}
            onChange={(e) => setOutputSize(e.target.value)}
            label="Output Size"
          >
            <MenuItem value="compact">Compact</MenuItem>
            <MenuItem value="full">Full</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" allowDuplicatedCategory={false} />
          <YAxis allowDecimals={true} domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} name={selectedStock || "Portfolio Value"} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default PerformanceChart;
