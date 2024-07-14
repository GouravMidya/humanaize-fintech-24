import React, { useState, useEffect } from "react";
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
  Tooltip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { getUsername } from "../services/authServices";
import { PieChart, BarChart } from "@mui/x-charts";
import axios from "axios";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import "jspdf-autotable";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "chartjs-adapter-date-fns";
import WealthWizard from "../components/WealthWizard";

ChartJS.register(
  ArcElement,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    userId: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [openAllExpensesDialog, setOpenAllExpensesDialog] = useState(false);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { userId } = await getUsername();
        setUserId(userId);
        console.log(userId);
        newExpense.userId = userId;
        await fetchExpenses(userId);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, []);

  const fetchExpenses = async (userIdParam) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_NODEURL}/getexpenses`,
        { userId: userIdParam }
      );
      setExpenses(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const addExpense = async () => {
    if (newExpense.amount && newExpense.category && newExpense.date) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_NODEURL}/expenses`,
          newExpense
        );
        await fetchExpenses(userId); // Refresh all expenses
        setNewExpense({
          userId: userId,
          amount: "",
          category: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
        });
      } catch (error) {
        console.error("Error adding expense:", error);
        alert("Failed to add expense. Please try again.");
      }
    } else {
      alert("Please fill in all required fields (Amount, Category, and Date)");
    }
  };

  const updateExpense = async (id, updatedExpense) => {
    try {
      await axios.put(`/api/expenses/update/${id}`, updatedExpense, {
        withCredentials: true,
      });
      fetchExpenses(); // Refresh the expenses list
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Failed to update expense. Please try again.");
    }
  };

  const getCurrentMonthExpenses = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= firstDayOfMonth && expenseDate <= now;
    });
  };

  const currentMonthExpenses = getCurrentMonthExpenses();

  const totalExpenses = currentMonthExpenses.reduce(
    (total, expense) => total + parseFloat(expense.amount),
    0
  );

  // Prepare data for the line chart
  const aggregatedExpenses = currentMonthExpenses.reduce((acc, expense) => {
    const date = expense.date.split("T")[0]; // Assuming date is in ISO format
    if (!acc[date]) {
      acc[date] = {
        totalAmount: 0,
        expenses: [],
      };
    }
    acc[date].totalAmount += parseFloat(expense.amount);
    acc[date].expenses.push(expense);
    return acc;
  }, {});

  const expensesByCategory = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] =
      (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Date", "Category", "Amount", "Description"];
    const tableRows = [];

    const filteredExpenses = expenses.filter(
      (expense) =>
        new Date(expense.date) >= new Date(dateRange.start) &&
        new Date(expense.date) <= new Date(dateRange.end)
    );

    // Sort expenses by date in descending order
    filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    let totalAmount = 0;

    filteredExpenses.forEach((expense) => {
      const expenseData = [
        format(new Date(expense.date), "MMM dd, yyyy"),
        expense.category,
        `$${parseFloat(expense.amount).toFixed(2)}`,
        expense.description,
      ];
      tableRows.push(expenseData);
      totalAmount += parseFloat(expense.amount);
    });

    // Add title with date range
    doc.setFontSize(18);
    doc.text(`Expense Report`, 14, 15);
    doc.setFontSize(12);
    doc.text(
      `From: ${format(new Date(dateRange.start), "MMM dd, yyyy")} To: ${format(
        new Date(dateRange.end),
        "MMM dd, yyyy"
      )}`,
      14,
      25
    );

    // Add total expenses
    doc.text(`Total Expenses: $${totalAmount.toFixed(2)}`, 14, 35);

    // Add table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [75, 75, 75] },
    });

    // Add page number
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save("expense_report.pdf");
  };

  // Prepare data for the line chart
  const sortedExpenses = currentMonthExpenses
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .filter((expense) => expense.date && expense.amount);

  const lineChartData = {
    datasets: [
      {
        label: "Daily Expenses",
        data: Object.entries(aggregatedExpenses).map(([date, data]) => ({
          x: new Date(date),
          y: data.totalAmount,
          expenses: data.expenses,
        })),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "PPP",
          displayFormats: {
            day: "MMM d",
          },
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount (Rs. )",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context) => {
            return format(context[0].parsed.x, "MMMM d, yyyy");
          },
          label: (context) => {
            return `Total: ${context.parsed.y.toFixed(2)}`;
          },
          afterBody: (context) => {
            const dataIndex = context[0].dataIndex;
            const dayExpenses = context[0].dataset.data[dataIndex].expenses;
            return dayExpenses.map(
              (expense) =>
                `${expense.category}: $${expense.amount} - ${
                  expense.description || "No description"
                }`
            );
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <Container maxWidth="lg">
      {/* <Typography
        variant="h4"
        align="center"
        gutterBottom
        marginTop={"20px"}
        marginBottom={"20px"}
      >
        Expense Tracker
      </Typography> */}

      <Grid container spacing={3} marginTop={"20px"}>
        {/* Expense Input Form */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: "500px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Add Expense
            </Typography>
            <TextField
              label="Amount"
              type="number"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                value={newExpense.category}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, category: e.target.value })
                }
              >
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Transportation">Transportation</MenuItem>
                <MenuItem value="Housing">Housing</MenuItem>
                <MenuItem value="Entertainment">Entertainment</MenuItem>
                <MenuItem value="Utilities">Utilities</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Date"
              type="date"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: e.target.value })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Description"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={addExpense}
              fullWidth
              sx={{ mt: "auto" }}
            >
              Add Expense
            </Button>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: "500px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Expense Distribution
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PieChart
                series={[
                  {
                    data: Object.entries(expensesByCategory).map(
                      ([category, amount]) => ({
                        id: category,
                        value: amount,
                        label: category,
                      })
                    ),
                    innerRadius: 40,
                    outerRadius: 120,
                    paddingAngle: 2,
                    cornerRadius: 5,
                    startAngle: -90,
                    endAngle: 270,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 40,
                      additionalRadius: -10,
                      color: "gray",
                    },
                  },
                ]}
                width={350}
                height={350}
                slotProps={{
                  legend: {
                    direction: "row",
                    position: { vertical: "bottom", horizontal: "middle" },
                    padding: 0,
                    itemMarkWidth: 10,
                    itemMarkHeight: 10,
                    markGap: 5,
                    itemGap: 10,
                    labelStyle: {
                      fontSize: 15,
                    },
                  },
                }}
                margin={{ top: -20, bottom: 60, left: 0, right: 0 }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: "500px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Expense by Category
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: Object.keys(expensesByCategory),
                    tickLabelStyle: {
                      angle: -90,
                      textAnchor: "end",
                      dominantBaseline: "hanging",
                    },
                  },
                ]}
                series={[{ data: Object.values(expensesByCategory) }]}
                width={350}
                height={350}
                bottomAxis={{
                  tickSize: 0,
                  tickMargin: 15,
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: "400px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Expense Trend ({format(new Date(), "MMMM yyyy")})
            </Typography>
            <Box sx={{ flexGrow: 1, position: "relative" }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Expenses */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: "300px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ marginBottom: "20px" }}>
              Recent Expenses
            </Typography>
            <Grid container spacing={2} sx={{ flexGrow: 1, overflow: "auto" }}>
              {expenses
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map((expense) => (
                  <Grid item xs={12} sm={12} md={12} key={expense._id}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        height: "100%",
                        bgcolor: "#f0f4f8",
                        borderLeft: "4px solid #1976d2",
                      }}
                    >
                      <Typography variant="body1">
                        ${expense.amount} - {expense.category}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(expense.date).toLocaleDateString()} -{" "}
                        {expense.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAllExpensesDialog(true)}
              fullWidth
              sx={{ mt: 2 }}
            >
              See All Expenses
            </Button>
          </Paper>
        </Grid>

        {/* PDF Generation */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: "300px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Generate Expense Report
            </Typography>
            <TextField
              label="Start Date"
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={generatePDF}
              fullWidth
              sx={{ mt: "auto" }}
            >
              Generate PDF Report
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* All Expenses Dialog */}
      <Dialog
        open={openAllExpensesDialog}
        onClose={() => setOpenAllExpensesDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>All Expenses</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((expense) => (
                    <TableRow key={expense._id}>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${expense.amount}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAllExpensesDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <br />
      <WealthWizard initialMessage="How to manage my expenses?" />
    </Container>
  );
};

export default ExpenseTracker;
