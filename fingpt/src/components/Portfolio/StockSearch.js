import React, { useState } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

function StockSearch({ onSelectStock }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    console.log(`API Request: Searching for stock with keyword "${searchTerm} "`, API_KEY);
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchTerm}&apikey=${API_KEY}`
      );
      console.log(response.data);
      setSearchResults(response.data.bestMatches || []);
    } catch (error) {
      console.error('Error searching for stocks:', error);
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        label="Search for a stock"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleSearch} sx={{ mb: 2 }}>
        Search
      </Button>
      <Box sx={{ maxHeight: '165px', overflowY: 'auto' }}>
        <List>
          {searchResults.map((result) => (
            <ListItem
              key={result['1. symbol']}
              button
              onClick={() => onSelectStock(result['1. symbol'])}
            >
              <ListItemText
                primary={result['2. name']}
                secondary={result['1. symbol']}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default StockSearch;
