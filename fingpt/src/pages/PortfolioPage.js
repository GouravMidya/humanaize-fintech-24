import React, { useState, useEffect } from "react";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import axios from "axios";
import StockSearch from "../components/Portfolio/StockSearch";
import StockDetails from "../components/Portfolio/StockDetails";
import AddToPortfolioForm from "../components/Portfolio/AddToPortfolioForm";
import PortfolioTable from "../components/Portfolio/PortfolioTable";
import NewsWidget from "../components/Portfolio/NewsWidget";
import PerformanceChart from "../components/Portfolio/PerformanceChart";
import { getUsername } from "../services/authServices";
const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

function PortfolioPage() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedStockData, setSelectedStockData] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [userId, setUserId] = useState(""); // Replace with actual user authentication

  useEffect(() => {
    const fetchUserDetailsAndPortfolio = async () => {
      try {
        const { userId } = await getUsername();
        setUserId(userId);
        await fetchPortfolio(userId);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetailsAndPortfolio();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsResponse = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${NEWS_API_KEY}`
        );
        setNewsData(newsResponse.data.articles.slice(0, 5));
      } catch (error) {
        console.error("Error fetching news:", error);
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

  const handleAddToPortfolio = async (stock) => {
    if (!userId) {
      console.error("User ID not available");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_NODEURL}/api/portfolio/`,
        {
          userId: userId,
          symbol: stock.symbol,
          name: stock.name,
          quantity: parseInt(stock.quantity),
          buyPrice: parseFloat(stock.price),
        }
      );
      setPortfolio(response.data);
    } catch (error) {
      console.error("Error adding stock to portfolio:", error);
    }
  };

  const fetchPortfolio = async (userId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_NODEURL}/api/portfolio/`,
        {
          params: {
            userId: userId,
          },
        }
      );
      setPortfolio(response.data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  };

  const handleUpdateStock = async (stockId, updatedData) => {
    if (!userId) {
      console.error("User ID not available");
      return;
    }
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_NODEURL}/api/portfolio/`,
        {
          userId: userId,
          stockId: stockId,
          quantity: parseInt(updatedData.quantity),
          buyPrice: parseFloat(updatedData.buyPrice),
        }
      );
      setPortfolio(response.data);
    } catch (error) {
      console.error("Error updating stock in portfolio:", error);
    }
  };

  const handleDeleteStock = async (stockId) => {
    if (!userId) {
      console.error("User ID not available");
      return;
    }
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_NODEURL}/api/portfolio/`,
        {
          data: { userId: userId, stockId: stockId },
        }
      );
      setPortfolio(response.data);
    } catch (error) {
      console.error("Error deleting stock from portfolio:", error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Stock Search and Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Search Stocks
            </Typography>
            <StockSearch onSelectStock={handleSelectStock} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Stock Details
            </Typography>
            {selectedStock && (
              <Box>
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
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Portfolio Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Your Portfolio
            </Typography>
            <PortfolioTable
              portfolio={portfolio}
              onUpdateStock={handleUpdateStock}
              onDeleteStock={handleDeleteStock}
            />
          </Paper>
        </Grid>

        {/* Performance Chart (8 units) and News Widget (4 units) */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Portfolio Performance
            </Typography>
            <PerformanceChart portfolio={portfolio} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                textAlign: "center",
                textDecoration: "underline",
                marginBottom: "10px",
              }}
            >
              Latest Business News
            </Typography>
            <NewsWidget news={newsData} />
          </Paper>
        </Grid>
      </Grid>
      <br />
    </Container>
  );
}

export default PortfolioPage;
