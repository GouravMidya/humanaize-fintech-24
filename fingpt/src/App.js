import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import BudgetOptimizer from './pages/BudgetOptimizer';
import LandingPage from './pages/LandingPage';
import { isAuthenticated } from './utils/authUtils';
import { ThemeContextProvider } from './ThemeContext';
import { CssBaseline } from '@mui/material';
import CreditScore from './pages/CreditScore';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = isAuthenticated();
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleRegister = (token) => {
    localStorage.setItem('jwt', token);
    setIsLoggedIn(true);
  };

  return (
    <ThemeContextProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={<SignUp onRegister={handleRegister} />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/budget" element= {<BudgetOptimizer />}></Route>
          <Route path="/creditscore" element={<CreditScore />}></Route>
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
