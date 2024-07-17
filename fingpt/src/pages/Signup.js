import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { AccountBalance as AccountBalanceIcon } from "@mui/icons-material";
import { signUp, getUsername } from "../services/authServices";
import axios from "axios";

// Create a custom theme (same as login page)
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue color
    },
    secondary: {
      main: "#9c27b0", // Purple color
    },
  },
});

const SignUp = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openFinancialDialog, setOpenFinancialDialog] = useState(false);
  const [financialInfo, setFinancialInfo] = useState({
    monthlyIncome: "",
    monthlyExpenses: "",
    shortTermGoals: "",
    longTermGoals: "",
    riskTolerance: "",
    age: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinancialInfoChange = (e) => {
    setFinancialInfo({ ...financialInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { token } = await signUp(formData);
      onRegister(token);
      const { userId } = await getUsername();
      setFinancialInfo((prevState) => ({ ...prevState, userId }));
      setOpenFinancialDialog(true);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrorMessage(err.response.data.message);
        setShowErrorDialog(true);
      }
      setIsLoading(false);
    }
  };

  const handleFinancialSubmit = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_NODEURL}/api/financeInfo`,
        financialInfo
      );
      setOpenFinancialDialog(false);
      navigate("/home");
    } catch (error) {
      console.error("Error submitting financial information:", error);
      setErrorMessage(
        "Failed to submit financial information. Please try again."
      );
      setShowErrorDialog(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{ padding: 4, borderRadius: 2, width: "100%" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <AccountBalanceIcon
                sx={{ fontSize: 40, color: "primary.main", mr: 1 }}
              />
              <Typography
                component="h1"
                variant="h4"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                WealthWizard
              </Typography>
            </Box>
            <Typography component="h2" variant="h5" align="center" gutterBottom>
              Create your account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
              </Button>
            </Box>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Typography variant="body2" color="primary">
                  Already signed up? Log in
                </Typography>
              </Link>
            </Box>
          </Paper>
        </Box>

        <Dialog
          open={showErrorDialog}
          onClose={() => setShowErrorDialog(false)}
        >
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <DialogContentText>{errorMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowErrorDialog(false)}>OK</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openFinancialDialog}
          onClose={() => setOpenFinancialDialog(false)}
        >
          <DialogTitle>Customize GPT</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Provide your financial information to personalize your experience.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="monthlyIncome"
              label="Monthly Income"
              type="text"
              fullWidth
              variant="standard"
              value={financialInfo.monthlyIncome}
              onChange={handleFinancialInfoChange}
            />
            <TextField
              margin="dense"
              name="monthlyExpenses"
              label="Monthly Expenses"
              type="text"
              fullWidth
              variant="standard"
              value={financialInfo.monthlyExpenses}
              onChange={handleFinancialInfoChange}
            />
            <TextField
              margin="dense"
              name="shortTermGoals"
              label="Short-term Goals"
              type="text"
              fullWidth
              variant="standard"
              value={financialInfo.shortTermGoals}
              onChange={handleFinancialInfoChange}
            />
            <TextField
              margin="dense"
              name="longTermGoals"
              label="Long-term Goals"
              type="text"
              fullWidth
              variant="standard"
              value={financialInfo.longTermGoals}
              onChange={handleFinancialInfoChange}
            />
            <TextField
              margin="dense"
              name="riskTolerance"
              label="Risk Tolerance"
              type="text"
              fullWidth
              variant="standard"
              value={financialInfo.riskTolerance}
              onChange={handleFinancialInfoChange}
            />
            <TextField
              margin="dense"
              name="age"
              label="Age"
              type="number"
              fullWidth
              variant="standard"
              value={financialInfo.age}
              onChange={handleFinancialInfoChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenFinancialDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleFinancialSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
