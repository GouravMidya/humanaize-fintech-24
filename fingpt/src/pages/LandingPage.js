import React from 'react';
import { Box, Typography, Button, AppBar, Toolbar, Grid, Link } from '@mui/material';
import heroImage from './../assets/hero_image_3.jpg';  // Make sure this path is correct
import featureImage from '../assets/support1.jpeg';

const LandingPage = () => {
  return (
    <Box>
      <Box
        sx={{
          height: '100vh',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.7,  // Adjust this value to change opacity (0.0 to 1.0)
          },
        }}
      >
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, cursor: 'pointer', position: 'relative', zIndex: 1 }}
            >
              FinancePro
            </Typography>
            <Button color="inherit" sx={{ position: 'relative', zIndex: 1 }}>Login</Button>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              maxWidth: '80%',
              zIndex: 1,
            }}
          >
            Take Control of Your Financial Future Today
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Did You Know?
        </Typography>
        <Typography variant="body1">
          According to a recent study, individuals who create and stick to a budget save an average of 18% more money annually compared to those who don't budget.
        </Typography>
      </Box>

      {/* Feature Section */}
      <Box sx={{ padding: '40px', backgroundColor: '#f5f5f5' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={featureImage}
              alt="Budget Creation and Optimization"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Budget Creation and Optimization
            </Typography>
            <Typography variant="body1" paragraph>
              Our advanced budgeting tool helps you create a personalized budget tailored to your financial goals. With AI-powered optimization, we ensure your money works as hard as you do.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href="/budget-tool"
              target="_blank"
              rel="noopener"
            >
              Try Our Budget Tool
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LandingPage;