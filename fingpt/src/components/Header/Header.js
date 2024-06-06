import React from 'react';
import './Header.css';
import { AppBar, Toolbar, Typography, Link } from '@mui/material';

const Header = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h5" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    <Link href="/" variant="h5" color="inherit" underline="none">
                        WealthWizard
                    </Link>
                </Typography>
                
            </Toolbar>
        </AppBar>
    );
};

export default Header;
