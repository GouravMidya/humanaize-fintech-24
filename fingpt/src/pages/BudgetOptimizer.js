import React, { useState } from 'react';
import axios from 'axios';
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
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { PieChart } from '@mui/x-charts/PieChart';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";

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
  const [optimizedBudget, setOptimizedBudget] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    const newExpenses = { ...expenses, [category]: value };
    const totalExpensePercentage = Object.entries(newExpenses)
      .filter(([cat]) => cat !== 'Surplus')
      .reduce((sum, [, val]) => sum + val, 0);
    const surplusPercentage = Math.max(100 - totalExpensePercentage, 0);
    setExpenses({ ...newExpenses, Surplus: surplusPercentage });
  };

  const addExpense = () => {
    const newCategory = prompt('Enter new expense category:');
    if (newCategory) {
      const newExpenses = { ...expenses, [newCategory]: 0 };
      const totalExpensePercentage = Object.entries(newExpenses)
        .filter(([cat]) => cat !== 'Surplus')
        .reduce((sum, [, val]) => sum + val, 0);
      const surplusPercentage = Math.max(100 - totalExpensePercentage, 0);
      setExpenses({ ...newExpenses, Surplus: surplusPercentage });
    }
  };

  const optimizeBudget = async () => {
    if (totalExpensePercentage !== 100) {
      alert('Total expenses must equal 100% before optimizing.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/budget/optimize', {
        income: totalIncome,
        expenses: expenses,
      });
      setOptimizedBudget(response.data.optimized_expenses);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error optimizing budget:', error);
      alert('An error occurred while optimizing the budget.');
    }
    setIsLoading(false);
  };

  const exportData = (format) => {
    const data = [
      ['Category', 'Original (%)', 'Optimized (%)', 'Change (%)'],
      ...Object.keys(expenses).map(category => [
        category,
        expenses[category],
        optimizedBudget ? optimizedBudget[category] : '',
        optimizedBudget ? (optimizedBudget[category] - expenses[category]).toFixed(2) : ''
      ]),
      ['Suggestions', ...suggestions]
    ];

    if (format === 'xlsx') {
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Budget Comparison");
      XLSX.writeFile(wb, "budget_comparison.xlsx");
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      doc.autoTable({
        head: [data[0]],
        body: data.slice(1),
      });
      doc.save("budget_comparison.pdf");
    }
  };

  const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount), 0);
  const totalExpensePercentage = Object.entries(expenses)
  .filter(([category]) => category !== 'Surplus')
  .reduce((sum, [, value]) => sum + value, 0);
  const totalExpenses = totalExpensePercentage / 100 * totalIncome;
  const isOverBudget = totalExpensePercentage > 100;
  const surplus = totalIncome - totalExpenses;

  const pieChartData = Object.entries(expenses).map(([category, percentage], index) => ({
    id: category,
    value: percentage,
    label: category,
    color: customColors[index % customColors.length],
  }));

  const BudgetSummary = ({ title, expenses, totalIncome, isOptimized = false }) => {
    const totalExpensePercentage = Object.entries(expenses)
  .filter(([category]) => category !== 'Surplus')
  .reduce((sum, [, value]) => sum + value, 0);
    const totalExpenses = (totalExpensePercentage / 100) * totalIncome;
    const isOverBudget = totalExpensePercentage > 100;
    const surplus = totalIncome - totalExpenses;

    const pieChartData = Object.entries(expenses).map(([category, percentage], index) => ({
      id: category,
      value: percentage,
      label: category,
      color: customColors[index % customColors.length],
    }));

    return (
      <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <List>
          <ListItem>
          <Grid container>
            <Grid item xs={6}>
              <ListItemText primary="Total Income" secondary={`$${totalIncome.toFixed(2)}`} />  
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <ListItemText primary="Total Expenses" secondary={`$${totalExpenses.toFixed(2)} (${totalExpensePercentage.toFixed(2)}%)`} />  
            </Grid>
          </Grid>
          </ListItem>
          <Divider />
          <Grid container>
            {Object.entries(expenses).map(([category, percentage], index) => (
              <Grid item xs={6} key={index}>
                <ListItem>
                  <ListItemText 
                    primary={category} 
                    secondary={
                      <span>
                        {percentage.toFixed(2)}% (${(totalIncome * percentage / 100).toFixed(2)})
                        {isOptimized && (
                          <span style={{ color: percentage > (expenses[category] || 0) ? 'green' : 'red', marginLeft: '5px' }}>
                            ({(percentage - (expenses[category] || 0)).toFixed(2)}%)
                          </span>
                        )}
                      </span>
                    }
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
    );
  };


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
              category !== 'Surplus' && (
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
              )
            ))}
            <Button startIcon={<AddIcon />} onClick={addExpense}>
              Add Expense Category
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <BudgetSummary title="Current Budget Summary" expenses={expenses} totalIncome={totalIncome} />
        </Grid>
        {optimizedBudget && (
          <Grid item xs={12} md={6}>
            <BudgetSummary title="Optimized Budget Summary" expenses={optimizedBudget} totalIncome={totalIncome} isOptimized={true} />
          </Grid>
        )}
      </Grid>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="contained" color="primary" onClick={optimizeBudget} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Optimize Budget'}
        </Button>
        {optimizedBudget && (
          <Box>
            <Button startIcon={<FileDownloadIcon />} onClick={() => exportData('xlsx')} sx={{ mr: 1 }}>
              Export to Excel
            </Button>
            <Button startIcon={<FileDownloadIcon />} onClick={() => exportData('pdf')}>
              Export to PDF
            </Button>
          </Box>
        )}
      </Box>
      {suggestions.length > 0 && (
        <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            AI Suggestions
          </Typography>
          <List>
            {suggestions.map((suggestion, index) => (
              <ListItem key={index}>
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default BudgetOptimizer;