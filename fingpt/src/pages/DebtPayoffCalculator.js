import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import WealthWizard from "../components/WealthWizard";

const DebtPayoffCalculator = () => {
  const [debts, setDebts] = useState([
    { name: "", amount: "", interestRate: "", monthlyPayment: "" },
  ]);
  const [results, setResults] = useState(null);

  const addDebt = () => {
    setDebts([
      ...debts,
      { name: "", amount: "", interestRate: "", monthlyPayment: "" },
    ]);
  };

  const removeDebt = (index) => {
    const newDebts = debts.filter((_, i) => i !== index);
    setDebts(newDebts);
  };

  const handleDebtChange = (index, field, value) => {
    const newDebts = [...debts];
    newDebts[index][field] = value;
    setDebts(newDebts);
  };

  const calculatePayoff = () => {
    let totalMonths = 0;
    let totalInterest = 0;
    let totalPaid = 0;
    const debtResults = debts.map((debt) => {
      const principal = parseFloat(debt.amount);
      const rate = parseFloat(debt.interestRate) / 100 / 12;
      const monthlyPayment = parseFloat(debt.monthlyPayment);
      let balance = principal;
      let months = 0;
      let interestPaid = 0;
      const balanceOverTime = [{ month: 0, balance: balance }];

      while (balance > 0) {
        const interest = balance * rate;
        const principalPayment = monthlyPayment - interest;

        balance -= principalPayment;
        interestPaid += interest;
        months++;

        balanceOverTime.push({ month: months, balance: Math.max(0, balance) });

        if (months > 360) break; // Avoid infinite loop
      }

      totalMonths = Math.max(totalMonths, months);
      totalInterest += interestPaid;
      totalPaid += principal + interestPaid;

      return {
        name: debt.name,
        months,
        interestPaid: interestPaid.toFixed(2),
        totalPaid: (principal + interestPaid).toFixed(2),
        balanceOverTime,
      };
    });

    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;

    setResults({
      debts: debtResults,
      totalMonths,
      totalInterest: totalInterest.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      summary: `You can pay off your debts in **${totalMonths} months (${years} years and ${remainingMonths} months)**. You will need to pay a total of ₹${totalPaid.toFixed(
        2
      )}, of which the total interest is ₹${totalInterest.toFixed(2)}.`,
    });
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const formatXAxis = (tickItem) => {
    const years = Math.floor(tickItem / 12);
    const months = tickItem % 12;
    return `${years}y ${months}m`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom marginBottom={"20px"}>
        See how long it could take to pay off your debt.
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {debts.map((debt, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} sm={2.5}>
                <TextField
                  fullWidth
                  label="Debt Name"
                  value={debt.name}
                  onChange={(e) =>
                    handleDebtChange(index, "name", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2.5}>
                <TextField
                  fullWidth
                  label="Debt Amount"
                  type="number"
                  value={debt.amount}
                  onChange={(e) =>
                    handleDebtChange(index, "amount", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2.5}>
                <TextField
                  fullWidth
                  label="Interest Rate (%)"
                  type="number"
                  value={debt.interestRate}
                  onChange={(e) =>
                    handleDebtChange(index, "interestRate", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2.5}>
                <TextField
                  fullWidth
                  label="Monthly Payment"
                  type="number"
                  value={debt.monthlyPayment}
                  onChange={(e) =>
                    handleDebtChange(index, "monthlyPayment", e.target.value)
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={2}
                container
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  onClick={() => removeDebt(index)}
                  disabled={debts.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Button startIcon={<AddIcon />} onClick={addDebt}>
              Add Debt
            </Button>
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Button
              variant="contained"
              onClick={calculatePayoff}
              sx={{ width: "200px" }}
            >
              Calculate
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {results && (
        <>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Debt Name</TableCell>
                  <TableCell>Months to Pay Off</TableCell>
                  <TableCell>Total Interest Paid</TableCell>
                  <TableCell>Total Amount Paid</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.debts.map((debt, index) => (
                  <TableRow key={index}>
                    <TableCell>{debt.name}</TableCell>
                    <TableCell>{debt.months}</TableCell>
                    <TableCell>₹{debt.interestPaid}</TableCell>
                    <TableCell>₹{debt.totalPaid}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Results
            </Typography>
            <Typography variant="body1" paragraph>
              {results.summary
                .split("**")
                .map((text, index) =>
                  index % 2 === 0 ? text : <strong key={index}>{text}</strong>
                )}
            </Typography>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Principal",
                      value:
                        parseFloat(results.totalPaid) -
                        parseFloat(results.totalInterest),
                    },
                    {
                      name: "Interest",
                      value: parseFloat(results.totalInterest),
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[0, 1].map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Debt Payoff Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                margin={{
                  top: 5,
                  right: 30,
                  left: 50,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  type="number"
                  tickFormatter={formatXAxis}
                  label={{
                    value: "Time (Years and Months)",
                    position: "insideBottomRight",
                    offset: -10,
                  }}
                />
                <YAxis
                  label={{
                    value: "Debt Remaining (₹)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -40,
                  }}
                />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Legend />
                {results.debts.map((debt, index) => (
                  <Line
                    key={debt.name}
                    type="monotone"
                    dataKey="balance"
                    data={debt.balanceOverTime}
                    name={debt.name}
                    stroke={COLORS[index % COLORS.length]}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}
      <WealthWizard initialMessage={"How to pay off debt quickly?"} />
    </Container>
  );
};

export default DebtPayoffCalculator;
