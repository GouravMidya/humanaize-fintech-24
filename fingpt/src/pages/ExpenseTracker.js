import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import { 
  PieChart, 
  BarChart,
} from '@mui/x-charts';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend, ArcElement } from 'chart.js';
import 'chartjs-adapter-date-fns';
import WealthWizard from '../components/WealthWizard';

ChartJS.register(ArcElement, TimeScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [openAllExpensesDialog, setOpenAllExpensesDialog] = useState(false);

  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (newExpense.amount && newExpense.category && newExpense.date) {
      setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
      setNewExpense({
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    } else {
      alert("Please fill in all required fields (Amount, Category, and Date)");
    }
  };

  const getCurrentMonthExpenses = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= firstDayOfMonth && expenseDate <= now;
    });
  };

  const currentMonthExpenses = getCurrentMonthExpenses();
  const totalExpenses = currentMonthExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const expensesByCategory = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Date", "Category", "Amount", "Description"];
    const tableRows = [];

    const filteredExpenses = expenses.filter(expense => 
      new Date(expense.date) >= new Date(dateRange.start) &&
      new Date(expense.date) <= new Date(dateRange.end)
    );

    filteredExpenses.forEach(expense => {
      const expenseData = [
        expense.date,
        expense.category,
        `$${expense.amount}`,
        expense.description
      ];
      tableRows.push(expenseData);
    });

    doc.text("Expense Report", 14, 15);
    doc.autoTable(tableColumn, tableRows, { startY: 20 });

    doc.save("expense_report.pdf");
  };

  const expensesByDate = currentMonthExpenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {});

  const aggregatedExpensesByDate = Object.entries(expensesByDate).map(([date, expenses]) => {
    const totalAmount = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
    return {
      date,
      totalAmount,
      details: expenses
    };
  });

  // Prepare data for the line chart
  const sortedExpenses = expenses
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .filter(expense => expense.date && expense.amount); // Ensure we have valid date and amount

  const lineChartData = {
    datasets: [{
      label: 'Daily Expenses',
      data: sortedExpenses.map(expense => ({
        x: new Date(expense.date),
        y: parseFloat(expense.amount)
      })),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'PPP',
          displayFormats: {
            day: 'MMM d'
          }
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            const expense = sortedExpenses[dataIndex];
            if (expense) {
              return `${expense.category}: $${expense.amount}`;
            }
            return '';
          },
          afterBody: (tooltipItems) => {
            const dataIndex = tooltipItems[0].dataIndex;
            const expense = sortedExpenses[dataIndex];
            if (expense && expense.description) {
              return `Description: ${expense.description}`;
            }
            return '';
          }
        }
      },
      legend: {
        display: false
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" align="center" gutterBottom>
        Expense Tracker
      </Typography>
       
      <Grid container spacing={3}>
        {/* Expense Input Form */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '500px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>Add Expense</Typography>
            <TextField
              label="Amount"
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              >
                <MenuItem value="Income">Income</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Transportation">Transportation</MenuItem>
                <MenuItem value="Housing">Housing</MenuItem>
                <MenuItem value="Entertainment">Entertainment</MenuItem>
                <MenuItem value="Utilities">Utilities</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Personal">Personal</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Date"
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={addExpense} fullWidth sx={{ mt: 'auto' }}>
              Add Expense
            </Button>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '500px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>Expense Distribution</Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <PieChart
                series={[
                  {
                    data: Object.entries(expensesByCategory).map(([category, amount]) => ({
                      id: category,
                      value: amount,
                      label: category
                    })),
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 5,
                    startAngle: -90,
                    endAngle: 270,
                  },
                ]}
                width={300}
                height={300}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    padding: 0,
                    itemMarkWidth: 10,
                    itemMarkHeight: 10,
                    markGap: 5,
                    itemGap: 10,
                    labelStyle: {
                      fontSize: 12,
                    },
                  },
                }}
                margin={{ top: 20, bottom: 60, left: 0, right: 0 }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '500px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>Expense by Category</Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <BarChart
                xAxis={[{ scaleType: 'band', data: Object.keys(expensesByCategory) }]}
                series={[{ data: Object.values(expensesByCategory) }]}
                width={350}
                height={350}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>Expense Trend</Typography>
            <Box sx={{ flexGrow: 1, position: 'relative' }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Expenses */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '300px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>Recent Expenses</Typography>
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
              {expenses.slice(-5).reverse().map((expense) => (
                <ListItem key={expense.id}>
                  <ListItemText 
                    primary={`$${expense.amount} - ${expense.category}`} 
                    secondary={`${expense.date} - ${expense.description}`} 
                  />
                </ListItem>
              ))}
            </List>
            <Button variant="contained" color="primary" onClick={() => setOpenAllExpensesDialog(true)} fullWidth sx={{ mt: 2 }}>
              See All Expenses
            </Button>
          </Paper>
        </Grid>

        {/* PDF Generation */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '300px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>Generate Expense Report</Typography>
            <TextField
              label="Start Date"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Button variant="contained" color="primary" onClick={generatePDF} fullWidth sx={{ mt: 'auto' }}>
              Generate PDF Report
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* All Expenses Dialog */}
      <Dialog open={openAllExpensesDialog} onClose={() => setOpenAllExpensesDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>All Expenses</DialogTitle>
        <DialogContent>
          <List>
            {expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map((expense) => (
              <ListItem key={expense.id}>
                <ListItemText 
                  primary={`$${expense.amount} - ${expense.category}`} 
                  secondary={`${expense.date} - ${expense.description}`} 
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAllExpensesDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <WealthWizard initialMessage="How to manage my expenses?"/>
    </Container>
  );
};

export default ExpenseTracker;
