import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const WealthWizard = () => {
  const [open, setOpen] = useState(false);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
      <Link 
        to="/home" 
        state={{ initialMessage: "How to improve my credit score" }}
        style={{ textDecoration: 'none' }}
      >
        <Fab
          color="primary"
          variant="extended"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 'tooltip',
          }}
        >
          <ChatIcon sx={{ mr: 1 }} />
          Talk to WealthWizard
        </Fab>
      </Link>

  );
};

export default WealthWizard;