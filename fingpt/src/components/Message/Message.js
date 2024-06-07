import React from 'react';
import './Message.css';
import { Box, Typography, Paper } from '@mui/material';

const Message = ({ sender, text }) => {
    return (
        <Box
            display="flex"
            justifyContent={sender === 'user' ? 'flex-end' : 'flex-start'}
            mb={2}
        >
            <Paper
                style={{
                    maxWidth: '80%',
                    padding: '10px',
                    backgroundColor: sender === 'user' ? '#007bff' : '#f1f1f1',
                    color: sender === 'user' ? 'white' : 'black',
                }}
            >
                <Typography variant="body1">{text}</Typography>
            </Paper>
        </Box>
    );
};

export default Message;
