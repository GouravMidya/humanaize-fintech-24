import React, { useState } from 'react';
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
    FormControlLabel
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

const ProfileSection = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

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
                <MenuItem onClick={handleClose}>LogOut</MenuItem>
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