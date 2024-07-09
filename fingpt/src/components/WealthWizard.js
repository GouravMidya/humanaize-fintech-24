import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
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
    <>
      <Link to="/home" style={{ textDecoration: 'none' }}>
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
          Talk to WealthWizardAI
        </Fab>
      </Link>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          '& .MuiDialog-paper': {
            margin: 0,
            maxWidth: 'none',
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Still have questions?"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Click the button to talk to WealthWizardAI for more assistance.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WealthWizard;