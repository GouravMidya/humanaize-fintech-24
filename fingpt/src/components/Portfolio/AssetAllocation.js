import React from 'react';
import { Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function AssetAllocation({ data }) {
  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Asset Allocation
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Asset allocation refers to the distribution of your investments across various asset classes. 
          It's a key strategy for balancing risk and reward in your investment portfolio.
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}

export default AssetAllocation;
