import React, { useState, useEffect } from 'react';
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
  Button
} from '@mui/material';
import { 
  CheckCircleOutline, 
  TrendingUp, 
  CreditCard, 
  AccountBalance, 
  Report,
  Info
} from '@mui/icons-material';
import { PieChart, LineChart } from '@mui/x-charts';


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

const creditTips = [
  "Pay your bills on time, every time.",
  "Keep your credit card balances low.",
  "Don't close old credit accounts.",
  "Limit new credit applications.",
  "Regularly check your credit report for errors.",
  "Use a mix of credit types responsibly.",
  "Set up automatic payments to avoid late fees.",
  "Consider becoming an authorized user on a family member's card.",
  "Negotiate with creditors if you're having trouble paying.",
  "Use credit monitoring services to track your progress.",
];

function CreditScore() {
  const [paymentHistory, setPaymentHistory] = useState(100);
  const [creditUtilization, setCreditUtilization] = useState(30);
  const [creditScoreData, setCreditScoreData] = useState([]);
  const [tipOfTheDay, setTipOfTheDay] = useState('');
  const [currentScore, setCurrentScore] = useState(0);

  const calculateCreditScore = (paymentHistory, creditUtilization) => {
    const baseScore = 300;
    const maxScore = 900;
    const paymentHistoryImpact = (paymentHistory / 100) * 350;
    const utilizationImpact = (1 - creditUtilization / 100) * 300;
    return Math.round(Math.min(maxScore, baseScore + paymentHistoryImpact + utilizationImpact));
  };

  const projectCreditScore = (baseScore, paymentHistory, creditUtilization, months) => {
    const maxImprovement = 150;
    const improvementRate = 0.1;
    
    // Adjust improvement based on current habits
    const habitFactor = (paymentHistory / 100 * 0.7) + ((100 - creditUtilization) / 100 * 0.3);
    const improvement = maxImprovement * habitFactor * (1 - Math.exp(-improvementRate * months));
    
    return Math.min(900, Math.round(baseScore + improvement));
  };

  const updateCreditScore = (paymentHistory, creditUtilization) => {
    const calculatedScore = calculateCreditScore(paymentHistory, creditUtilization);
    setCurrentScore(calculatedScore);
    
    const newData = [
      { month: 'Current', score: calculatedScore },
      { month: '3 Months', score: projectCreditScore(calculatedScore, paymentHistory, creditUtilization, 3) },
      { month: '6 Months', score: projectCreditScore(calculatedScore, paymentHistory, creditUtilization, 6) },
      { month: '9 Months', score: projectCreditScore(calculatedScore, paymentHistory, creditUtilization, 9) },
      { month: '1 Year', score: projectCreditScore(calculatedScore, paymentHistory, creditUtilization, 12) },
    ];
    setCreditScoreData(newData);
  };

  useEffect(() => {
    updateCreditScore(paymentHistory, creditUtilization);
  }, [paymentHistory, creditUtilization]);

  const handlePaymentHistoryChange = (event, newValue) => {
    setPaymentHistory(newValue);
  };

  const handleCreditUtilizationChange = (event, newValue) => {
    setCreditUtilization(newValue);
  };

  const getCreditScoreStatus = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Very Good';
    if (score >= 650) return 'Good';
    if (score >= 600) return 'Fair';
    return 'Poor';
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

  useEffect(() => {
    const randomTip = creditTips[Math.floor(Math.random() * creditTips.length)];
    setTipOfTheDay(randomTip);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h2" gutterBottom align="center">
          Credit Score Improvement Guide
        </Typography>

        
        <Grid container spacing={4}>
          {/* Keep the Credit Score Factors and Understanding Credit Score Factors sections as they were */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" gutterBottom>
                  Credit Score Factors
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',alignItems:'center' }}>
                  <PieChart
                    series={[
                      {
                        data: creditFactorsData,
                        innerRadius: 40,
                        outerRadius: 150,
                        paddingAngle: 2,
                        cornerRadius: 5,
                        startAngle: -90,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
                      },
                    ]}
                    width={400}
                    height={250}
                    legend={{ hidden: true }}
                    sx={{marginLeft:'5rem', alignItems:'center'}}
                    
                  />
                  <Box mt={2} sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {creditFactorsData.map((factor) => (
                      <Box key={factor.id} sx={{ display: 'flex', alignItems: 'center', margin: '0 10px 10px 0' }}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: factor.color, marginRight: 1 }} />
                        <Typography variant="body2">
                          {factor.label}: {factor.value}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" gutterBottom>
                  Understanding Credit Score Factors
                </Typography>
                <List sx={{ flexGrow: 1, overflow: 'auto' }}>
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
              Simulate Your Credit Score
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
            <Box mt={2}>
              <Typography variant="h6" align="center">
                Your Estimated Credit Score: {currentScore}
              </Typography>
              <Typography variant="body1" align="center" style={{ color: getStatusColor(getCreditScoreStatus(currentScore)) }}>
                Status: {getCreditScoreStatus(currentScore)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Projected Credit Score Improvement
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <LineChart
                xAxis={[{ 
                  data: creditScoreData.map(d => d.month), 
                  scaleType: 'point' 
                }]}
                yAxis={[{ 
                  min: Math.min(...creditScoreData.map(d => d.score)) - 20,
                  max: Math.max(...creditScoreData.map(d => d.score)) + 20
                }]}
                series={[
                  {
                    data: creditScoreData.map(d => d.score),
                    area: false,
                    curve: "linear"
                  },
                ]}
                width={900}
                height={300}
              />
            </Box>
            <Typography variant="body2" mt={2}>
              This projection is based on your current payment history ({paymentHistory}%) and credit utilization ({creditUtilization}%). 
              {paymentHistory < 90 && " Your payment history is below ideal levels. Improving this can significantly boost your score."}
              {creditUtilization > 30 && " Your credit utilization is higher than recommended. Reducing this can help improve your score."}
              {paymentHistory >= 90 && creditUtilization <= 30 && " You're on the right track! Maintaining these good habits should help your score improve over time."}
            </Typography>
            <Typography variant="body2" mt={2}>
              Remember, this is an estimate. Actual results may vary based on many factors. For the best improvement:
              <ul>
                <li>Aim for 100% on-time payments</li>
                <li>Keep credit utilization below 30%</li>
                <li>Maintain a mix of credit types</li>
                <li>Avoid opening too many new accounts</li>
              </ul>
            </Typography>
          </Paper>
        </Grid>

        
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, mt: 4, backgroundColor: '#e3f2fd' }}>
              <Typography variant="h5" gutterBottom align="center">
                Additional Resources
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<Info />}
                    onClick={() => window.open('https://www.rbi.org.in/Scripts/FAQView.aspx?Id=92', '_blank')}
                  >
                    RBI Credit Information
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<Info />}
                    onClick={() => window.open('https://www.cibil.com/freecreditscore', '_blank')}
                  >
                    Free CIBIL Score
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<Info />}
                    onClick={() => window.open('https://www.experian.in/consumer/credit-report', '_blank')}
                  >
                    Experian Credit Report
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="body2" color="textSecondary" align="center">
            Disclaimer: This tool provides estimates and general information. 
            For accurate credit scores and personalized advice, consult with financial professionals.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CreditScore;