import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { PieChart } from "@mui/x-charts/PieChart";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { getUsername } from "../services/authServices";
import WealthWizard from "../components/WealthWizard";
import { startOfMonth, endOfMonth } from "date-fns";

const customColors = [
  "#1f77b4", "#ff7f0e", "#48cae4", "#d62728", "#8338ec",
  "#0f4c5c", "#fb6f92", "#7f7f7f", "#bcbd22", "#17becf",
  "#aec7e8", "#ffbb78", "#98df8a", "#ff9896", "#c5b0d5",
  "#c49c94", "#f7b6d2", "#c7c7c7", "#dbdb8d", "#9edae5",
];

const BudgetOptimizer = () => {
  const [incomes, setIncomes] = useState([{ source: "Salary", amount: 0 }]);
  const [expenses, setExpenses] = useState({
    Housing: 25, Food: 15, Transportation: 10, Utilities: 10,
    Entertainment: 10, Savings: 20, Other: 10,
  });
  const [optimizedBudget, setOptimizedBudget] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);
    const lastDayOfMonth = endOfMonth(now);

    setDateRange({
      start: firstDayOfMonth.toISOString().split("T")[0],
      end: lastDayOfMonth.toISOString().split("T")[0],
    });

    const fetchUserIdAndIncome = async () => {
      try {
        const { userId } = await getUsername();
        setUserId(userId);
        await fetchIncome(userId);
      } catch (error) {
        console.error("Error fetching user ID or income:", error);
      }
    };
    fetchUserIdAndIncome();
  }, []);

  const fetchIncome = async (userId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_NODEURL}/api/financeInfo`,
        { params: { userId: userId } }
      );
      const fetchedIncome = response.data.financialInfo.monthlyIncome;
      if (fetchedIncome) {
        setIncomes([{ source: "Salary", amount: Math.max(0, parseFloat(fetchedIncome)) }]);
      }
    } catch (error) {
      console.error("Error fetching income:", error);
      alert("An error occurred while fetching income data.");
    }
  };

  const handleIncomeChange = (index, field, value) => {
    setIncomes(prevIncomes => {
      const newIncomes = [...prevIncomes];
      if (field === "amount") {
        value = Math.max(0, parseFloat(value) || 0);
      }
      newIncomes[index] = { ...newIncomes[index], [field]: value };
      return newIncomes;
    });
  };

  const addIncome = () => {
    setIncomes(prevIncomes => [...prevIncomes, { source: "", amount: 0 }]);
  };

  const removeIncome = (index) => {
    const newIncomes = incomes.filter((_, i) => i !== index);
    setIncomes(newIncomes);
  };

  const handleExpenseChange = (category, value) => {
    const newExpenses = { ...expenses, [category]: value };
    const totalExpensePercentage = Object.entries(expenses)
  .filter(([category]) => category !== "Savings")
  .reduce((sum, [, value]) => sum + value, 0);
  
    const savingsPercentage = Math.max(100 - totalExpensePercentage, 0);
    setExpenses({ ...newExpenses, Savings: savingsPercentage });
  };

  const addExpense = () => {
    const newCategory = prompt("Enter new expense category:");
    if (newCategory) {
      const newExpenses = { ...expenses, [newCategory]: 0 };
      setExpenses(newExpenses);
    }
  };

  const optimizeBudget = async () => {
    
    if (totalIncome === 0) {
      alert("No income has been entered. Please enter your income before fetching expenses.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_FASTURL}/budget/optimize`,
        { income: totalIncome, expenses: expenses }
      );
      setOptimizedBudget(response.data.optimized_expenses);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error optimizing budget:", error);
      alert("An error occurred while optimizing the budget.");
    }
    setIsLoading(false);
  };

  const fetchAndSetExpenses = async () => {
    if (!userId) {
      alert("User ID is not available. Please try again.");
      return;
    }

    if (totalIncome === 0) {
      alert("No income has been entered. Please enter your income before fetching expenses.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_NODEURL}/api/expense/getexpensesdaterange`,
        { userId, startDate: dateRange.start, endDate: dateRange.end }
      );
      const fetchedExpenses = response.data;
     
      const totalExpense = fetchedExpenses.reduce(
        (sum, expense) => sum + parseFloat(expense.amount),
        0
      );
      const savings = totalIncome - totalExpense;

      const expensePercentages = fetchedExpenses.reduce((acc, expense) => {
        const category = expense.category;
        const percentage = (parseFloat(expense.amount) / totalIncome) * 100;
        acc[category] = (acc[category] || 0) + percentage;
        return acc;
      }, {});

      expensePercentages["Savings"] = (savings / totalIncome) * 100;

      Object.keys(expenses).forEach((category) => {
        if (!(category in expensePercentages)) {
          expensePercentages[category] = 0;
        }
      });

      const totalPercentage = Object.values(expensePercentages).reduce(
        (sum, value) => sum + value,
        0
      );
      if (totalPercentage !== 100) {
        const adjustmentFactor = 100 / totalPercentage;
        Object.keys(expensePercentages).forEach((category) => {
          expensePercentages[category] *= adjustmentFactor;
        });
      }

      setExpenses(expensePercentages);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      alert("An error occurred while fetching expenses.");
    }
  };

  const exportData = (format) => {
    const data = [
      ["Category", "Original (%)", "Optimized (%)", "Change (%)"],
      ...Object.keys(expenses).map((category) => [
        category,
        expenses[category],
        optimizedBudget ? optimizedBudget[category] : "",
        optimizedBudget
          ? (optimizedBudget[category] - expenses[category]).toFixed(2)
          : "",
      ]),
      ["Suggestions", ...suggestions],
    ];

    if (format === "xlsx") {
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Budget Comparison");
      XLSX.writeFile(wb, "budget_comparison.xlsx");
    } else if (format === "pdf") {
      const doc = new jsPDF();
      doc.autoTable({
        head: [data[0]],
        body: data.slice(1),
      });
      doc.save("budget_comparison.pdf");
    }
  };

  const totalIncome = incomes.reduce(
    (sum, income) => sum + Number(income.amount),
    0
  );
  const totalExpensePercentage = Object.entries(expenses)
    .filter(([category]) => category !== "Savings")
    .reduce((sum, [, value]) => sum + value, 0);
  const totalExpenses = (totalExpensePercentage / 100) * totalIncome;
  const isOverBudget = totalExpensePercentage > 100;
  const surplus = totalIncome - totalExpenses;

  const BudgetSummary = ({
    title,
    expenses,
    totalIncome,
    isOptimized = false,
    originalExpenses,
  }) => {
    const totalExpensePercentage = Object.values(expenses).reduce((sum, percentage) => sum + percentage, 0);
    const adjustedExpenses = { ...expenses };

    // Adjust percentages if they exceed 100%
    if (totalExpensePercentage > 100) {
      const adjustmentFactor = 100 / totalExpensePercentage;
      Object.keys(adjustedExpenses).forEach((category) => {
        adjustedExpenses[category] *= adjustmentFactor;
      });
    }

    // Ensure Savings is not negative
    if (adjustedExpenses.Savings < 0) {
      adjustedExpenses.Savings = 0;
    }

    const totalExpenses = (Object.entries(adjustedExpenses)
  .filter(([category]) => category !== "Savings")
  .reduce((sum, [, percentage]) => sum + percentage, 0) / 100) * totalIncome;
  
  const surplus = totalIncome - totalExpenses;

    const pieChartData = Object.entries(adjustedExpenses).map(
      ([category, percentage], index) => ({
        id: category,
        value: percentage,
        label: category,
        color: customColors[index % customColors.length],
      })
    );

    return (
      <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <List>
          <ListItem>
            <Grid container>
              <Grid item xs={6}>
                <ListItemText
                  primary="Total Income"
                  secondary={`₹${totalIncome.toFixed(2)}`}
                />
              </Grid>
              <Grid item xs={6}>
                <ListItemText
                  primary="Total Expenses"
                  secondary={`₹${totalExpenses.toFixed(2)} (${(totalExpenses / totalIncome * 100).toFixed(2)}%)`}
                />
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <Grid container>
            {Object.entries(adjustedExpenses).map(([category, percentage], index) => (
              <Grid item xs={6} key={index}>
                <ListItem>
                  <ListItemText
                    primary={category}
                    secondary={
                      <span>
                        {percentage.toFixed(2)}% (₹
                        {((totalIncome * percentage) / 100).toFixed(2)})
                        {isOptimized && originalExpenses && (
                          <span
                            style={{
                              color:
                                percentage > originalExpenses[category]
                                  ? "green"
                                  : percentage < originalExpenses[category]
                                  ? "red"
                                  : "inherit",
                              marginLeft: "5px",
                            }}
                          >
                            (
                            {(percentage - originalExpenses[category]).toFixed(2)}
                            %)
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
        {surplus > 0 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Savings: ₹{surplus.toFixed(2)} ({(surplus / totalIncome * 100).toFixed(2)}% of income)
          </Alert>
        )}
        {surplus < 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Warning: Total Expense Exceeding 100%
          </Alert>
        )}

        <Box sx={{ height: 300, mt: 2 }}>
          <PieChart
            series={[
              {
                data: pieChartData,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
          />
        </Box>
      </Paper>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1, py: 4 }}>
        {/* <Typography variant="h4" gutterBottom align="center">
          Budget Creation and Optimization
        </Typography> */}
        <Grid container spacing={4}>
          {!optimizedBudget ? (
            <>
              <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Income
              </Typography>
              {incomes.map((income, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <TextField
                    label="Source"
                    value={income.source}
                    sx={{ mr: 1, flexGrow: 1 }}
                  />
                  <TextField
                    label="Amount"
                    type="number"
                    value={income.amount}
                    onChange={(e) =>
                      handleIncomeChange(index, "amount", e.target.value)
                    }
                    inputProps={{ min: 0 }}
                    sx={{ mr: 1, flexGrow: 1 }}
                  />
                  <IconButton onClick={() => removeIncome(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addIncome}
                variant="outlined"
                fullWidth
              >
                Add Income
              </Button>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Expenses (%)
                  </Typography>
                  {Object.entries(expenses).map(
                    ([category, percentage]) =>
                      category !== "Savings" && (
                        <Box key={category} sx={{ mb: 2 }}>
                          <Typography gutterBottom>
                            {category} ({percentage.toFixed(2)}%)
                          </Typography>
                          <Slider
                            value={percentage}
                            onChange={(_, newValue) =>
                              handleExpenseChange(category, newValue)
                            }
                            valueLabelDisplay="auto"
                            min={0}
                            max={100}
                          />
                        </Box>
                      )
                  )}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addExpense}
                    variant="outlined"
                    fullWidth
                  >
                    Add Expense Category
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <BudgetSummary
                  title="Current Budget Summary"
                  expenses={expenses}
                  totalIncome={totalIncome}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} md={6}>
                <BudgetSummary
                  title="Current Budget Summary"
                  expenses={expenses}
                  totalIncome={totalIncome}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <BudgetSummary
                  title="Optimized Budget Summary"
                  expenses={optimizedBudget}
                  totalIncome={totalIncome}
                  isOptimized={true}
                  originalExpenses={expenses}
                />
              </Grid>
            </>
          )}
        </Grid>
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {!optimizedBudget ? (
            <Box>
              <Button
                onClick={fetchAndSetExpenses}
                size="large"
                variant="contained"
                sx={{ marginRight: "10px" }}
              >
                Fetch Stored Expenses
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={optimizeBudget}
                disabled={isLoading}
                size="large"
                sx={{ mr: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Optimize Budget"}
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                startIcon={<FileDownloadIcon />}
                onClick={() => exportData("xlsx")}
                sx={{ mr: 1 }}
              >
                Export to Excel
              </Button>
              <Button
                startIcon={<FileDownloadIcon />}
                onClick={() => exportData("pdf")}
              >
                Export to PDF
              </Button>
            </Box>
          )}
        </Box>
        {suggestions.length > 0 && (
          <>
            <Typography
              variant="h6"
              gutterBottom
              align="center"
              sx={{ mt: 4, mb: 2 }}
            >
              AI Suggestions
            </Typography>
            <Grid container spacing={2}>
              {suggestions.map((suggestion, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      height: "100%",
                      bgcolor: "#f0f4f8",
                      borderLeft: "4px solid #1976d2",
                    }}
                  >
                    <Typography variant="body1">{suggestion}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </>
        )}
        <Box sx={{ mt: 4 }}>
          <WealthWizard initialMessage="How to optimize my budget?" />
        </Box>
      </Box>
    </Container>
  );
};

export default BudgetOptimizer;