import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import ProfileSection from "../Profile_section/ProfileSection";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "inherit", mr: 2 }}
          >
            WealthWizard
          </Typography>
          {isLoggedIn && (
            <>
              <IconButton
                size="large"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <ExpandMoreIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/budget"
                >
                  Budget Optimizer
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/creditscore"
                >
                  Credit Score
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/debt">
                  Debt Payoff Calculator
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/expensetracker"
                >
                  Expense Tracker
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/goal">
                  Financial Goal Tracker
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {isLoggedIn && (
          <Button
            sx={{ textDecoration: "none", color: "inherit", mr: 3 }}
            component={Link}
            to="/home"
          >
            Chat
          </Button>
        )}

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isLoggedIn ? (
            <>
              <Box className="profile-section">
                <ProfileSection />
              </Box>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
