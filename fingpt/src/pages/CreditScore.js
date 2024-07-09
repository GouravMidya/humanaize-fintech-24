import React, { useState } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Slider,
  Paper,
  TextField,
  Button
} from '@mui/material';
import { 
  CheckCircleOutline, 
  TrendingUp, 
  CreditCard, 
  AccountBalance, 
  Report
} from '@mui/icons-material';
import { PieChart } from '@mui/x-charts';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#388e3c',
    },
  },
});

const creditFactorsData = [
  { id: 0, label: 'Payment History', value: 35, color: '#1976d2' },
  { id: 1, label: 'Credit Utilization', value: 30, color: '#388e3c' },
  { id: 2, label: 'Length of Credit History', value: 15, color: '#ffa726' },
  { id: 3, label: 'Credit Mix', value: 10, color: '#e53935' },
  { id: 4, label: 'New Credit', value: 10, color: '#8e24aa' },
];


const initialCreditScoreData = [
    { month: 'Jan', score: 620 },
    { month: 'Feb', score: 640 },
    { month: 'Mar', score: 660 },
    { month: 'Apr', score: 680 },
    { month: 'May', score: 700 },
    { month: 'Jun', score: 720 },
  ];
  
function CreditScore() {
  const [paymentHistory, setPaymentHistory] = useState(100);
  const [creditUtilization, setCreditUtilization] = useState(30);
  const [userCreditScore, setUserCreditScore] = useState('');
  const [creditScoreStatus, setCreditScoreStatus] = useState('');
  const [creditScoreData, setCreditScoreData] = useState(initialCreditScoreData);

  const calculateCreditScore = (paymentHistory, creditUtilization) => {
    const baseScore = 550;
    const paymentHistoryImpact = (paymentHistory / 100) * 150;
    const utilizationImpact = (1 - creditUtilization / 100) * 100;
    return Math.round(baseScore + paymentHistoryImpact + utilizationImpact);
  };

  const handlePaymentHistoryChange = (event, newValue) => {
    setPaymentHistory(newValue);
  };

  const handleCreditUtilizationChange = (event, newValue) => {
    setCreditUtilization(newValue);
  };

  const handleCreditScoreSubmit = () => {
    const score = parseInt(userCreditScore);
    if (score >= 800) {
      setCreditScoreStatus('Excellent');
    } else if (score >= 740) {
      setCreditScoreStatus('Very Good');
    } else if (score >= 670) {
      setCreditScoreStatus('Good');
    } else if (score >= 580) {
      setCreditScoreStatus('Fair');
    } else {
      setCreditScoreStatus('Poor');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return '#388e3c';
      case 'Very Good': return '#66bb6a';
      case 'Good': return '#ffa726';
      case 'Fair': return '#f57c00';
      case 'Poor': return '#e53935';
      default: return 'inherit';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h2" gutterBottom align="center">
          Credit Score Improvement Guide
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Credit Score Factors
                </Typography>
                <PieChart
                  series={[
                    {
                      data: creditFactorsData,
                      innerRadius: 30,
                      outerRadius: 100,
                      paddingAngle: 2,
                      cornerRadius: 5,
                      startAngle: -90,
                    },
                  ]}
                  width={500}
                  height={300}
                  legend={{ hidden: true }}
                />
                <Box mt={2}>
                  {creditFactorsData.map((factor) => (
                    <Typography key={factor.id} variant="body2" style={{ color: factor.color }}>
                      {factor.label}: {factor.value}%
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Understanding Credit Score Factors
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Payment History (35%)" 
                      secondary="Consistently paying bills on time is crucial. Late payments can significantly harm your score."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Credit Utilization (30%)" 
                      secondary="Keep your credit card balances low relative to your credit limits. Aim for under 30% utilization."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CreditCard color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Length of Credit History (15%)" 
                      secondary="Longer credit history is better. Keep old accounts open, even if unused."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccountBalance color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Credit Mix (10%)" 
                      secondary="Having a mix of credit types (e.g., credit cards, loans) can positively impact your score."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Report color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="New Credit (10%)" 
                      secondary="Opening multiple new accounts in a short time can lower your score. Apply for new credit sparingly."
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Simulate Credit Score Changes
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Payment History (% on-time payments)</Typography>
                  <Slider
                    value={paymentHistory}
                    onChange={handlePaymentHistoryChange}
                    aria-labelledby="payment-history-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={0}
                    max={100}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Credit Utilization (%)</Typography>
                  <Slider
                    value={creditUtilization}
                    onChange={handleCreditUtilizationChange}
                    aria-labelledby="credit-utilization-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={0}
                    max={100}
                  />
                </Grid>
              </Grid>
              <Typography variant="h6" align="center" mt={2}>
                Estimated Credit Score: {creditScoreData[creditScoreData.length - 1].score}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: '#e8f5e9' }}>
              <Typography variant="h5" gutterBottom align="center">
                Check Your Credit Score Status
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <TextField
                  label="Enter Your Credit Score"
                  variant="outlined"
                  value={userCreditScore}
                  onChange={(e) => setUserCreditScore(e.target.value)}
                  type="number"
                  sx={{ mr: 2 }}
                />
                <Button variant="contained" onClick={handleCreditScoreSubmit}>
                  Check Status
                </Button>
              </Box>
              {creditScoreStatus && (
                <Typography variant="h6" align="center" mt={2} style={{ color: getStatusColor(creditScoreStatus) }}>
                  Your credit score is considered: {creditScoreStatus}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

      </Container>
    </ThemeProvider>
  );
}

export default CreditScore;