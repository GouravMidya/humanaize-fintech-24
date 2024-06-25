import React, { useState, useEffect, useContext } from 'react';
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
    Typography,
    useTheme
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/authUtils';
import { getUsername } from '../../services/authServices';
import axios from 'axios';
import { ColorModeContext } from '../../ThemeContext';

const ProfileSection = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [financialInfo, setFinancialInfo] = useState({
        monthlyIncome: '',
        monthlyExpenses: '',
        shortTermGoals: '',
        longTermGoals: '',
        riskTolerance: '',
        age: ''
    });
    const navigate = useNavigate();
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const { username, userId } = await getUsername();
                setUsername(username.charAt(0).toUpperCase() + username.slice(1));
                setUserId(userId);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserDetails();
    }, []);

    const fetchFinancialInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:8001/financeInfo/${userId}`);
            setFinancialInfo(response.data);
        } catch (error) {
            console.error('Error fetching financial information:', error);
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCustomizeClick = async () => {
        handleClose();
        await fetchFinancialInfo();
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleSubmit = async () => {
        try {
            await axios.put('http://localhost:8001/financeInfo', {
                userId,
                ...financialInfo
            });
            setOpenDialog(false);
        } catch (error) {
            console.error('Error submitting financial information:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFinancialInfo({ ...financialInfo, [name]: value });
    };

    const handleThemeChange = () => {
        colorMode.toggleColorMode();
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
                <MenuItem>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={theme.palette.mode === 'dark'}
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
                        Update your financial information to personalize your experience.
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
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="monthlyExpenses"
                        label="Monthly Expenses"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={financialInfo.monthlyExpenses}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="shortTermGoals"
                        label="Short-term Goals"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={financialInfo.shortTermGoals}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="longTermGoals"
                        label="Long-term Goals"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={financialInfo.longTermGoals}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="riskTolerance"
                        label="Risk Tolerance"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={financialInfo.riskTolerance}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="age"
                        label="Age"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={financialInfo.age}
                        onChange={handleInputChange}
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