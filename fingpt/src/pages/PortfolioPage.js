import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
import StockSearch from '../components/Portfolio/StockSearch';
import StockDetails from '../components/Portfolio/StockDetails';
import AddToPortfolioForm from '../components/Portfolio/AddToPortfolioForm';
import PortfolioTable from '../components/Portfolio/PortfolioTable';
import NewsWidget from '../components/Portfolio/NewsWidget';
import AssetAllocation from '../components/Portfolio/AssetAllocation';
import PerformanceChart from '../components/Portfolio/PerformanceChart';

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

function PortfolioPage() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedStockData, setSelectedStockData] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      console.log('API Request: Fetching latest business news');
      try {
        const newsResponse = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${NEWS_API_KEY}`
        );
        setNewsData(newsResponse.data.articles.slice(0, 5));
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  const handleSelectStock = (symbol) => {
    setSelectedStock(symbol);
  };

  const handleStockDataUpdate = (data) => {
    setSelectedStockData(data);
  };


  const handleAddToPortfolio = (stock) => {
    setPortfolio((prevPortfolio) => {
      const existingStockIndex = prevPortfolio.findIndex((s) => s.symbol === stock.symbol);
      const newStock = {
        ...stock,
        price: parseFloat(stock.price),
        quantity: parseInt(stock.quantity),
        total: parseFloat(stock.price) * parseInt(stock.quantity)
      };
      
      if (existingStockIndex !== -1) {
        const updatedPortfolio = [...prevPortfolio];
        updatedPortfolio[existingStockIndex] = {
          ...updatedPortfolio[existingStockIndex],
          quantity: updatedPortfolio[existingStockIndex].quantity + newStock.quantity,
          total: updatedPortfolio[existingStockIndex].total + newStock.total
        };
        return updatedPortfolio;
      } else {
        return [...prevPortfolio, newStock];
      }
    });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Search Stocks
            </Typography>
            <StockSearch onSelectStock={handleSelectStock} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Stock Details
            </Typography>
            {selectedStock && (
              <>
                <StockDetails 
                  symbol={selectedStock} 
                  onStockDataUpdate={handleStockDataUpdate}
                />
                {selectedStockData && (
                  <AddToPortfolioForm
                    stockData={selectedStockData}
                    onAddToPortfolio={handleAddToPortfolio}
                  />
                )}
              </>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Your Portfolio
            </Typography>
            <PortfolioTable portfolio={portfolio} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <AssetAllocation data={portfolio} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <NewsWidget news={newsData} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Portfolio Performance
            </Typography>
            <PerformanceChart portfolio={portfolio} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PortfolioPage;