import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Paper,
  Grid,
  Alert,
  Box,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LineChart, PieChart } from "@mui/x-charts";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WealthWizard from "../components/WealthWizard";
import { getUsername } from "../services/authServices";

const commonGoals = [
  { name: "Emergency Fund", amount: 50000 },
  { name: "Retirement", amount: 5000000 },
  { name: "Home Down Payment", amount: 1000000 },
  { name: "Child Education", amount: 2000000 },
  { name: "Vacation", amount: 200000 },
  { name: "Wedding", amount: 1000000 },
  { name: "Car Purchase", amount: 800000 },
  { name: "Debt Repayment", amount: 500000 },
  { name: "Business Startup", amount: 2000000 },
  { name: "Home Renovation", amount: 500000 },
];

const assetTypes = [
  { name: "Mutual Funds", avgReturn: 12, percentage: 40 },
  { name: "Stocks", avgReturn: 10, percentage: 30 },
  { name: "Government Bonds", avgReturn: 6, percentage: 20 },
  { name: "Gold", avgReturn: 8, percentage: 10 },
];

const formatIndianCurrency = (amount) => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
};

const formatToLakhCrore = (value) => {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `${(value / 100000).toFixed(2)} L`;
  } else {
    return value.toFixed(0);
  }
};

const calculateSIP = (targetAmount, years) => {
  const months = years * 12;
  const r = assetTypes.reduce(
    (sum, asset) =>
      sum + ((asset.avgReturn / 12 / 100) * asset.percentage) / 100,
    0
  );
  const sip = targetAmount * (r / (Math.pow(1 + r, months) - 1));
  return sip;
};

const generateChartData = (targetAmount, years, monthlyInvestment) => {
  const months = years * 12;
  const data = Array.from({ length: months + 1 }, (_, i) => {
    const monthData = {
      month: i,
      total: 0,
    };
    assetTypes.forEach((asset) => {
      const r = asset.avgReturn / 12 / 100;
      const assetValue =
        ((monthlyInvestment * asset.percentage) / 100) *
        ((Math.pow(1 + r, i) - 1) / r) *
        (1 + r);
      monthData[asset.name] = assetValue;
      monthData.total += assetValue;
    });
    return monthData;
  });
  return data;
};



const FinancialGoalTracker = () => {
  const [goal, setGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [inflationAdjustedAmount, setInflationAdjustedAmount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [monthlySIP, setMonthlySIP] = useState(0);
  const [savedGoals, setSavedGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [savedGoalsData, setSavedGoalsData] = useState({});

  useEffect(() => {
    fetchSavedGoals();
  }, []);

  const fetchSavedGoals = async () => {
    try {
      const { userId } = await getUsername();
      const response = await axios.post(`${process.env.REACT_APP_NODEURL}/api/financial-goals/get`, { userId });
      setSavedGoals(response.data);
      
      // Calculate data for each saved goal
      const goalsData = {};
      response.data.forEach(goal => {
        const years = dayjs(goal.targetDate).diff(dayjs(), "year");
        const inflatedAmount = goal.amount * Math.pow(1 + 0.03, years);
        const sip = calculateSIP(inflatedAmount, years);
        const chartData = generateChartData(inflatedAmount, years, sip);
        goalsData[goal._id] = { inflatedAmount, sip, chartData };
      });
      setSavedGoalsData(goalsData);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching saved goals:", err);
      setError("Failed to load saved goals. Please try again later.");
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/investment');
  };

  const handleGoalChange = (event) => {
    const selectedGoal = event.target.value;
    setGoal(selectedGoal);
    if (selectedGoal !== "Other") {
      const selectedAmount =
        commonGoals.find((g) => g.name === selectedGoal)?.amount || "";
      setAmount(selectedAmount.toString());
    }
  };

  const handleCalculate = async () => {
    const inflationRate = 0.03; // 3% annual inflation
    const years = date ? Math.max(0, date.diff(dayjs(), "year")) : 0;
    const inflatedAmount =
      parseFloat(amount) * Math.pow(1 + inflationRate, years);
    setInflationAdjustedAmount(inflatedAmount);

    const sip = calculateSIP(inflatedAmount, years);
    setMonthlySIP(sip);

    setChartData(generateChartData(inflatedAmount, years, sip));
    setShowResults(true);

    try {
      const { userId } = await getUsername();
      const newGoal = {
        userId,
        goalName: goal === "Other" ? customGoal : goal,
        amount: parseFloat(amount),
        targetDate: date.toISOString(),
      };
      const response = await axios.post(`${process.env.REACT_APP_NODEURL}/api/financial-goals`, newGoal);
      console.log("Goal saved:", response.data);
      fetchSavedGoals();
    } catch (err) {
      console.error("Error saving goal:", err);
      setError("Failed to save goal. Please try again.");
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        {savedGoals.length > 0 && (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Previous Financial Goals
            </Typography>
            {savedGoals.map((savedGoal) => (
              <Accordion
                key={savedGoal._id}
                expanded={expandedAccordion === savedGoal._id}
                onChange={handleAccordionChange(savedGoal._id)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{savedGoal.goalName}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Amount: {formatIndianCurrency(savedGoal.amount)}</Typography>
                  <Typography>Target Date: {dayjs(savedGoal.targetDate).format("MMMM D, YYYY")}</Typography>
                  {expandedAccordion === savedGoal._id && savedGoalsData[savedGoal._id] && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6">
                        Inflation Adjusted Amount: {formatIndianCurrency(savedGoalsData[savedGoal._id].inflatedAmount)}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        Required Monthly SIP: {formatIndianCurrency(savedGoalsData[savedGoal._id].sip)}
                      </Typography>
                      <Box sx={{ height: 200, width: "100%", mt: 2 }}>
                        <PieChart
                          series={[
                            {
                              data: assetTypes.map((asset) => ({
                                id: asset.name,
                                value: asset.percentage,
                                label: asset.name,
                              })),
                              highlightScope: {
                                faded: "global",
                                highlighted: "item",
                              },
                              faded: { innerRadius: 30, additionalRadius: -30 },
                            },
                          ]}
                          height={200}
                        />
                      </Box>
                      <Box sx={{ height: 400, mt: 4, width: "100%" }}>
                        <LineChart
                          xAxis={[
                            { data: savedGoalsData[savedGoal._id].chartData.map((d) => d.month), label: "Months" },
                          ]}
                          yAxis={[
                            {
                              label: "Amount",
                              valueFormatter: (value) => formatToLakhCrore(value),
                            },
                          ]}
                          series={[
                            ...assetTypes.map((asset, index) => ({
                              data: savedGoalsData[savedGoal._id].chartData.map((d) => d[asset.name]),
                              label: asset.name,
                              color: `hsl(${
                                (index * 360) / assetTypes.length
                              }, 70%, 50%)`,
                              showMark: false,
                              valueFormatter: (value) => formatIndianCurrency(value),
                            })),
                            {
                              data: savedGoalsData[savedGoal._id].chartData.map((d) => d.total),
                              label: "Total",
                              showMark: false,
                              valueFormatter: (value) => formatIndianCurrency(value),
                            },
                          ]}
                          height={400}
                          slotProps={{
                            legend: {
                              direction: "row",
                              position: { vertical: "top", horizontal: "middle" },
                              padding: 0,
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        )}

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Set Your Financial Goal
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Choose your financial goal</InputLabel>
            <Select value={goal} onChange={handleGoalChange}>
              {commonGoals.map((g) => (
                <MenuItem key={g.name} value={g.name}>
                  {g.name}
                </MenuItem>
              ))}
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          {goal === "Other" && (
            <TextField
              fullWidth
              margin="normal"
              label="Custom Goal"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
            />
          )}

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: goal ? 1 : 0, height: goal ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
          >
            <TextField
              fullWidth
              margin="normal"
              label="Goal Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                startAdornment: <Typography component="span">₹</Typography>,
              }}
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              This is a common amount for your chosen goal. You can adjust it
              according to your needs. The amount is in today's value.
            </Alert>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: amount ? 1 : 0, height: amount ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
          >
            <DatePicker
              label="Completion Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
              minDate={dayjs()}
            />
          </motion.div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCalculate}
            disabled={!goal || !amount || !date}
            sx={{ mt: 2 }}
          >
            Calculate
          </Button>
        </Paper>

        {showResults && (
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h4" gutterBottom>
              Your Financial Goal Plan
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">
                  Goal: {goal === "Other" ? customGoal : goal}
                </Typography>
                <Typography variant="h6">
                  Target Amount: {formatIndianCurrency(amount)}
                </Typography>
                <Typography variant="h6">
                  Target Date: {date.format("MMMM D, YYYY")}
                </Typography>
                <Typography variant="h6">
                  Inflation Adjusted Amount:{" "}
                  {formatIndianCurrency(inflationAdjustedAmount)}
                </Typography>
                <Typography variant="h6" color="primary">
                  Required Monthly SIP: {formatIndianCurrency(monthlySIP)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Asset Allocation:</Typography>
                <Box sx={{ height: 200, width: "100%" }}>
                  <PieChart
                    series={[
                      {
                        data: assetTypes.map((asset) => ({
                          id: asset.name,
                          value: asset.percentage,
                          label: asset.name,
                        })),
                        highlightScope: {
                          faded: "global",
                          highlighted: "item",
                        },
                        faded: { innerRadius: 30, additionalRadius: -30 },
                      },
                    ]}
                    height={200}
                  />
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ height: 400, mt: 4, width: "100%" }}>
              <LineChart
                xAxis={[
                  { data: chartData.map((d) => d.month), label: "Months" },
                ]}
                yAxis={[
                  {
                    label: "Amount",
                    valueFormatter: (value) => formatToLakhCrore(value),
                  },
                ]}
                series={[
                  ...assetTypes.map((asset, index) => ({
                    data: chartData.map((d) => d[asset.name]),
                    label: asset.name,
                    color: `hsl(${
                      (index * 360) / assetTypes.length
                    }, 70%, 50%)`,
                    showMark: false,
                    valueFormatter: (value) => formatIndianCurrency(value),
                  })),
                  {
                    data: chartData.map((d) => d.total),
                    label: "Total",
                    showMark: false,
                    valueFormatter: (value) => formatIndianCurrency(value),
                  },
                ]}
                height={400}
                slotProps={{
                  legend: {
                    direction: "row",
                    position: { vertical: "top", horizontal: "middle" },
                    padding: 0,
                  },
                }}
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleClick}
            >
              Go to Investment Portfolio Management
            </Button>
          </Paper>
        )}
        
        <WealthWizard initialMessage="What are financial goals and how to plan them?" />
      </Box>
    </LocalizationProvider>
  );
};

export default FinancialGoalTracker;