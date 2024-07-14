import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import DebtPayoffCalculator from "./pages/DebtPayoffCalculator";
import BudgetOptimizer from "./pages/BudgetOptimizer";
import LandingPage from "./pages/LandingPage";
import { isAuthenticated } from "./utils/authUtils";
import { ThemeContextProvider } from "./ThemeContext";
import { CssBaseline } from "@mui/material";
import CreditScore from "./pages/CreditScore";
import ExpenseTracker from "./pages/ExpenseTracker";
import FinancialGoalTracker from "./pages/FinancialGoalTracker";
import Navbar from "./components/Navbar/Navbar";
import InvestmentPortfolio from './pages/PortfolioPage';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const user = isAuthenticated();
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleRegister = (token) => {
    localStorage.setItem("jwt", token);
    setIsLoggedIn(true);
  };

  const showNavbar = !["/login", "/register"].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={<SignUp onRegister={handleRegister} />}
        />
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/budget" element={<BudgetOptimizer />} />
        <Route path="/creditscore" element={<CreditScore />} />
        <Route path="/debt" element={<DebtPayoffCalculator />} />
        <Route path="/expensetracker" element={<ExpenseTracker />} />
        <Route path="/goal" element={<FinancialGoalTracker />} />
        <Route path="/investment" element={<InvestmentPortfolio/>}/>
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
