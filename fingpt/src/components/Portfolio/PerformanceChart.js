import React, { useState, useEffect } from 'react';
import { Typography, Select, MenuItem,ListSubheader, FormControl, InputLabel, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

function PerformanceChart({ portfolio = [] }) {
  const [selectedStock, setSelectedStock] = useState('');
  const [timeRange, setTimeRange] = useState(30);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedStock) {
        console.log(`API Request: Fetching EOD data for ${selectedStock}`);
        try {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=${selectedStock}&apikey=${API_KEY}&datatype=csv`,
            { responseType: 'text' }
          );
          
          const rows = response.data.trim().split('\n');
          const headers = rows.shift().split(',');
          
          const data = rows
            .map(row => {
              const values = row.split(',');
              return headers.reduce((obj, header, index) => {
                obj[header] = values[index];
                return obj;
              }, {});
            })
            .slice(0, timeRange)
            .map(item => ({
              date: item.timestamp,
              price: parseFloat(item.close)
            }))
            .reverse();

          console.log("Parsed Chart Data:", data);
          setChartData(data);
        } catch (error) {
          console.error('Error fetching stock data:', error);
          setChartData([]);
        }
      } else {
        // Fetch data for all stocks in the portfolio
        try {
          const allStockData = await Promise.all(
            portfolio.map(async (stock) => {
              const response = await axios.get(
                `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=${stock.symbol}&apikey=${API_KEY}&datatype=csv`,
                { responseType: 'text' }
              );
              
              const rows = response.data.trim().split('\n');
              const headers = rows.shift().split(',');
              
              return rows
                .map(row => {
                  const values = row.split(',');
                  return headers.reduce((obj, header, index) => {
                    obj[header] = values[index];
                    return obj;
                  }, {});
                })
                .slice(0, timeRange)
                .map(item => ({
                  date: item.timestamp,
                  [stock.symbol]: parseFloat(item.close) * stock.quantity
                }))
                .reverse();
            })
          );

          // Combine data from all stocks
          const combinedData = allStockData.reduce((acc, stockData) => {
            stockData.forEach((dataPoint, index) => {
              if (!acc[index]) {
                acc[index] = { date: dataPoint.date, totalValue: 0 };
              }
              acc[index].totalValue += Object.values(dataPoint)[1];
            });
            return acc;
          }, []);

          setChartData(combinedData);
        } catch (error) {
          console.error('Error fetching portfolio data:', error);
          setChartData([]);
        }
      }
    };

    fetchData();
  }, [selectedStock, timeRange, portfolio]);

  const getExplanation = () => {
    if (selectedStock) {
      return `This chart shows the daily closing price of ${selectedStock} over the selected time period. It reflects the stock's price performance and can help you understand its recent trends.`;
    } else {
      return `This chart displays the total value of your entire portfolio over the selected time period. It combines the performance of all stocks in your portfolio, weighted by the number of shares you own of each stock. This gives you a comprehensive view of how your entire investment portfolio has performed over time.`;
    }
  };

  const groupedStocks = portfolio.reduce((acc, stock) => {
    if (!acc[stock.name]) {
      acc[stock.name] = [];
    }
    acc[stock.name].push(stock);
    return acc;
  }, {});

  // Create a list of unique stocks, combining those with the same name
  const uniqueStocks = Object.entries(groupedStocks).map(([name, stocks]) => ({
    name,
    symbol: stocks.map(s => s.symbol).join(', '),
    quantity: stocks.reduce((sum, s) => sum + s.quantity, 0)
  }));

  // Sort the unique stocks alphabetically by name
  uniqueStocks.sort((a, b) => a.name.localeCompare(b.name));

  // Group unique stocks by first letter of name
  const groupedUniqueStocks = uniqueStocks.reduce((acc, stock) => {
    const firstLetter = stock.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(stock);
    return acc;
  }, {});

  // Sort the groups alphabetically
  const sortedGroups = Object.keys(groupedUniqueStocks).sort();

  if (portfolio.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        Your portfolio is empty. Add stocks to see performance data.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" color="primary" gutterBottom>
        Performance Chart
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {getExplanation()}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <FormControl sx={{ minWidth: '250px' }}>
          <InputLabel>Portfolio</InputLabel>
          <Select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            label="All Portfolio"
          >
            <MenuItem value="">All Portfolio</MenuItem>
            {sortedGroups.map((group) => [
              ...groupedUniqueStocks[group].map((stock) => (
                <MenuItem key={stock.symbol} value={stock.symbol} style={{paddingLeft: '30px'}}>
                  {stock.name}
                </MenuItem>
              ))
            ])}
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
          <YAxis 
            allowDecimals={true} 
            domain={['auto', 'auto']} 
            tickFormatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          />
          <Tooltip 
            formatter={(value) => [`₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, selectedStock ? "Price" : "Portfolio Value"]}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={selectedStock ? "price" : "totalValue"} 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            name={selectedStock || "Portfolio Value"} 
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default PerformanceChart;