import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Typography
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/authUtils';
import { getUsername } from '../../services/authServices';

const ProfileSection = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      const fetchUsername = async () => {
        try {
            const username = await getUsername();
            setUsername(username.charAt(0).toUpperCase() + username.slice(1));
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    };
    fetchUsername();
}, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCustomizeClick = () => {
        handleClose();
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleSubmit = () => {
        setOpenDialog(false);
    };

    const handleThemeChange = (event) => {
        setIsDarkMode(event.target.checked);
        // Implement the logic to change the theme here
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        window.location.reload();
    };

    return (
        <div>
            <IconButton onClick={handleClick} color="inherit">
                <AccountCircle />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Typography fontSize={'18px'} align='center'>{username}</Typography><hr></hr>
                <MenuItem onClick={handleCustomizeClick}>Customize</MenuItem>
                <MenuItem onClick={handleClose}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isDarkMode}
                                onChange={handleThemeChange}
                                color="primary"
                            />
                        }
                        label="Dark Mode"
                    />
                </MenuItem>
                <MenuItem onClick={handleLogout}>LogOut</MenuItem>
            </Menu>
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Customize GPT</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        What would you like ChatGPT to know about you to provide better responses?
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Your Information"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProfileSection;
