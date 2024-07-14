import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function PortfolioTable({ portfolio }) {
    console.log("PORTFOLIO",portfolio);
  const calculateTotal = () => {
    return portfolio.reduce((total, stock) => total + stock.price * stock.quantity, 0);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {portfolio.map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell>{stock.symbol}</TableCell>
              <TableCell>{stock.name}</TableCell>
              <TableCell align="right">{stock.quantity}</TableCell>
              <TableCell align="right">${stock.price.toFixed(2)}</TableCell>
              <TableCell align="right">${stock.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4} align="right">Total Portfolio Value:</TableCell>
            <TableCell align="right">${calculateTotal().toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PortfolioTable;