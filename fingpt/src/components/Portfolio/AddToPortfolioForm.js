import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function AddToPortfolioForm({ stockData, onAddToPortfolio }) {
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("STOCK DATA:", stockData);
    onAddToPortfolio({
      symbol: stockData['01. symbol'],
      name: stockData['01. symbol'],
      price: parseFloat(stockData['05. price']),
      quantity: parseInt(quantity),
    });
    setQuantity(1);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        type="number"
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        InputProps={{ inputProps: { min: 1 } }}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" fullWidth>
        Add to Portfolio
      </Button>
    </Box>
  );
}

export default AddToPortfolioForm;