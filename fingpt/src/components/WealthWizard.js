import React from 'react';
import { Link } from 'react-router-dom';
import { Fab, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const LargeTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    fontSize: 16,
    padding: '8px 16px',
    maxWidth: 'none',
    textAlign: 'center',
  },
  '& .MuiTooltip-arrow': {
    '&::before': {
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.grey[300]}`,
    },
    right: 12,
    '&::before': {
      transformOrigin: '100% 100%',
    },
  },
}));

const ButtonContainer = styled('div')({
  position: 'fixed',
  bottom: 26,
  right: 26,
  zIndex: 'tooltip',
});

const IconImage = styled('img')({
  width: 45,
  height: 45,
});

const WealthWizard = ({ initialMessage }) => {
  return (
    <ButtonContainer>
      <LargeTooltip 
        title={
          <React.Fragment>
            Have more queries?<br />
            Talk to WealthWizard
          </React.Fragment>
        }
        arrow 
        placement="top"
        enterDelay={500}
        leaveDelay={200}
        PopperProps={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [-70, 5],
              },
            },
          ],
        }}
      >
        <Link
          to="/home"
          state={{ initialMessage: initialMessage }}
          style={{ textDecoration: 'none' }}
        >
          <Fab
            color="primary"
            size="large"
            sx={{
              width: 64,
              height: 64,
              '& .MuiFab-root': {
                width: '100%',
                height: '100%',
              },
            }}
          >
            <IconImage src="wizardIcon.png" alt="WealthWizard" />
          </Fab>
        </Link>
      </LargeTooltip>
    </ButtonContainer>
  );
};

export default WealthWizard;