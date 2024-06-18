import React from 'react';
import { AppBar, Toolbar, Typography, Link, Box } from '@mui/material';
import ProfileSection from '../Profile_section/ProfileSection';
import './Header.css';

const Header = () => {
    return (
        <AppBar position="static" className="header">
            <Toolbar>
                <Typography variant="h5" className="header-title">
                    <Link href="/" variant="h5" color="inherit" underline="none">
                        WealthWizard
                    </Link>
                </Typography>
                <Box className="profile-section">
                    <ProfileSection />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
