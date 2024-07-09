import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { signUp, getUsername } from '../services/authServices';
import axios from 'axios';

const SignUp = ({ onRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openFinancialDialog, setOpenFinancialDialog] = useState(false);
  const [financialInfo, setFinancialInfo] = useState({
    monthlyIncome: '',
    monthlyExpenses: '',
    shortTermGoals: '',
    longTermGoals: '',
    riskTolerance: '',
    age: '',
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
      onRegister(token); // Store the token
      const { userId } = await getUsername(); // Get the userId after registration
      setFinancialInfo(prevState => ({ ...prevState, userId })); // Add userId to financialInfo
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
      await axios.post(`${process.env.REACT_APP_NODEURL}/financeInfo`, financialInfo);
      setOpenFinancialDialog(false);
      navigate('/home');
    } catch (error) {
      console.error('Error submitting financial information:', error);
      setErrorMessage('Failed to submit financial information. Please try again.');
      setShowErrorDialog(true);
    }
  };

  return (
    <Container maxWidth="xs">
      <br/><br/><br/>
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
        </Button>
      </form>

      <Dialog open={showErrorDialog} onClose={() => setShowErrorDialog(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowErrorDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openFinancialDialog} onClose={() => setOpenFinancialDialog(false)}>
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
          <Button onClick={() => setOpenFinancialDialog(false)}>Cancel</Button>
          <Button onClick={handleFinancialSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SignUp;