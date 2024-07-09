import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Slider,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  IconButton,
  MenuItem,
  Select,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { PieChart } from '@mui/x-charts/PieChart';

// Custom color palette
const customColors = [
    '#1f77b4', '#ff7f0e', '#48cae4', '#d62728', '#8338ec', 
    '#0f4c5c', '#fb6f92', '#7f7f7f', '#bcbd22', '#17becf',
    '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
    '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5'
  ];

const BudgetOptimizer = () => {
  const [incomes, setIncomes] = useState([{ source: 'Salary', amount: 0 }]);
  const [expenses, setExpenses] = useState({
    Housing: 25,
    Food: 15,
    Transportation: 10,
    Utilities: 10,
    Entertainment: 10,
    Savings: 20,
    Other: 10,
  });

  const handleIncomeChange = (index, field, value) => {
    const newIncomes = [...incomes];
    newIncomes[index][field] = value;
    setIncomes(newIncomes);
  };

  const addIncome = () => {
    setIncomes([...incomes, { source: '', amount: 0 }]);
  };

  const removeIncome = (index) => {
    const newIncomes = incomes.filter((_, i) => i !== index);
    setIncomes(newIncomes);
  };

  const handleExpenseChange = (category, value) => {
    setExpenses({ ...expenses, [category]: value });
  };

  const addExpense = () => {
    const newCategory = prompt('Enter new expense category:');
    if (newCategory) {
      setExpenses({ ...expenses, [newCategory]: 0 });
    }
  };

  const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount), 0);
  const totalExpensePercentage = Object.values(expenses).reduce((a, b) => a + b, 0);
  const totalExpenses = totalExpensePercentage / 100 * totalIncome;
  const isOverBudget = totalExpensePercentage > 100;
  const surplus = totalIncome - totalExpenses;

  const pieChartData = Object.entries(expenses).map(([category, percentage], index) => ({
    id: category,
    value: percentage,
    label: category,
    color: customColors[index % customColors.length],
  }));

  // Add surplus to pie chart if positive
  if (surplus > 0) {
    const surplusPercentage = (surplus / totalIncome) * 100;
    pieChartData.push({
      id: 'Surplus',
      value: surplusPercentage,
      label: 'Surplus',
      color: '#00C853', // A positive green color for surplus
    });
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Budget Creation and Optimization
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Income
            </Typography>
            {incomes.map((income, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Select
                  value={income.source}
                  onChange={(e) => handleIncomeChange(index, 'source', e.target.value)}
                  sx={{ mr: 1, minWidth: 120 }}
                >
                  <MenuItem value="Salary">Salary</MenuItem>
                  <MenuItem value="Investments">Investments</MenuItem>
                  <MenuItem value="Freelance">Freelance</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                <TextField
                  label="Amount"
                  type="number"
                  value={income.amount}
                  onChange={(e) => handleIncomeChange(index, 'amount', e.target.value)}
                  sx={{ mr: 1 }}
                />
                <IconButton onClick={() => removeIncome(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={addIncome}>
              Add Income
            </Button>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Expenses (%)
            </Typography>
            {Object.entries(expenses).map(([category, percentage]) => (
              <Box key={category} sx={{ mb: 2 }}>
                <Typography gutterBottom>{category} ({percentage}%)</Typography>
                <Slider
                  value={percentage}
                  onChange={(_, newValue) => handleExpenseChange(category, newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                />
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={addExpense}>
              Add Expense Category
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Budget Summary
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Total Income" secondary={`$${totalIncome}`} />
              </ListItem>
              <Grid container>
                {incomes.map((income, index) => (
                  <Grid item xs={6} key={index}>
                    <ListItem>
                      <ListItemText 
                        primary={income.source} 
                        secondary={`$${income.amount}`} 
                      />
                    </ListItem>
                  </Grid>
                ))}
              </Grid>
              <Divider />
              <ListItem>
                <ListItemText primary="Total Expenses" secondary={`$${totalExpenses.toFixed(2)} (${totalExpensePercentage}%)`} />
              </ListItem>
              <Grid container>
                {Object.entries(expenses).map(([category, percentage], index) => (
                  <Grid item xs={6} key={index}>
                    <ListItem>
                      <ListItemText 
                        primary={category} 
                        secondary={`${percentage}% ($${(totalIncome * percentage / 100).toFixed(2)})`} 
                      />
                    </ListItem>
                  </Grid>
                ))}
              </Grid>
            </List>
            {isOverBudget && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Warning: Total expenses exceed 100% of income
              </Alert>
            )}
            {surplus > 0 && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Surplus: ${surplus.toFixed(2)} ({((surplus / totalIncome) * 100).toFixed(2)}% of income)
              </Alert>
            )}
            <Box sx={{ height: 300, mt: 2 }}>
              <PieChart series={[{ 
                data: pieChartData,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                }]} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary">
          Optimize Budget
        </Button>
      </Box>
    </Box>
  );
};

export default BudgetOptimizer;