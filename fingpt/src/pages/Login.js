// Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { login } from '../services/authServices';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { token } = await login(formData);
      localStorage.setItem('jwt', token);
      onLogin(); // Notify the App component that the user is logged in
      navigate('/home');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrorMessage(err.response.data.message);
        setShowErrorDialog(true);
      }
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs"><br/><br/><br/>
      <Typography variant="h4" align="center" gutterBottom>
        Log In
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Log In'}
        </Button>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </Typography>
      </form>

      <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>Login successful!</DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog open={showErrorDialog} onClose={() => setShowErrorDialog(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowErrorDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;
