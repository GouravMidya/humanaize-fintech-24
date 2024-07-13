import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import heroImage from "./../assets/hero_image_3.jpg"; // Make sure this path is correct
import featureImage from "./../assets/support0.jpeg";
import featureImage1 from "./../assets/support1.jpeg";
import featureImage2 from "./../assets/support2.png";
import featureImage3 from "./../assets/support3.jpg";
import featureImage4 from "./../assets/support4.jpg"
import WealthWizard from "../components/WealthWizard";

const FullScreenHero = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${heroImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
}));

const WhiteSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(8, 0),
}));

const ImageSection = styled(Box)(({ theme, image }) => ({
  backgroundImage: `url("${image}")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: 400,
}));

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(6),
}));

const MainContent = styled(Box)(({ theme }) => ({
  paddingTop: theme.mixins.toolbar.minHeight, // Add padding to account for the fixed AppBar
}));

const LandingPage = () => {
  const features = [
    {
      title: "WealthWizard AI",
      description:
        "Get personalized financial advice from our advanced AI-powered planning specialist.",
      link: "/home",
      image: featureImage,
    },
    {
      title: "Expense Tracker",
      description:"monitor and categorize your spending  while gaining insights into spending patterns to make informed decisions and work towards your financial goals.",
      link:"/expensetracker",
      image: featureImage4,
    },
    {
      title: "Budget Calculation & Optimization",
      description:
        "Create and optimize your budget for maximum savings and financial stability.",
      link: "/budget",
      image: featureImage1,
    },
    {
      title: "Credit Score Improvement Guide",
      description:
        "Discover actionable steps to boost your credit score and unlock better financial opportunities.",
      link: "/creditscore",
      image: featureImage2,
    },
    {
      title: "Debt Payoff Calculator",
      description:
        "Easily calculate and plan your debt repayment strategy to achieve financial freedom.",
      link: "/debt",
      image: featureImage3,
    },
    
  ];

  const facts = [
    "AI-powered financial planning tools can help increase investment returns by up to 4% annually.",
    "Studies show that people who regularly use expense trackers save up to 20% more money than those who don't. This is due to increased awareness of spending habits, which often leads to more mindful purchasing decisions.",
    "People who create and stick to a budget save 10% more of their income on average.",
    "Improving your credit score by 100 points could save you thousands on mortgage interest.",
    "Do you know that debt can be a powerful tool for financial growth but also a source of significant financial risk?",
    ];

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WealthWizard
          </Typography>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <MainContent>
        <FullScreenHero>
          <Container maxWidth="m">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              gutterBottom
              color="black"
            >
              Plan Your Financial Future with WealthWizard
            </Typography>
            <Typography variant="h5" align="center" paragraph>
              Take control of your finances with our powerful tools like
              WealthWizard Ai and Budget Planning and Optimization tool
            </Typography>
          </Container>
        </FullScreenHero>

        {features.map((feature, index) => (
          <React.Fragment key={index}>
            {index < features.length && (
              <WhiteSection>
                <Container>
                  <Typography variant="h5" gutterBottom>
                    Did You Know?
                  </Typography>
                  <Typography variant="body1">{facts[index]}</Typography>
                </Container>
              </WhiteSection>
            )}
            <Grid container>
              <Grid
                item
                xs={12}
                md={6}
                order={{ xs: 2, md: index % 2 === 0 ? 2 : 1 }}
              >
                <Box sx={{ p: 4 }}>
                  <Typography variant="h4" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {feature.description}
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    to={feature.link}
                  >
                    Learn More
                  </Button>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                order={{ xs: 1, md: index % 2 === 0 ? 1 : 2 }}
              >
                <ImageSection image={feature.image} />
              </Grid>
            </Grid>
          </React.Fragment>
        ))}
        <br /><br/>
        <Footer>
          <Container>
            <Typography variant="h6" gutterBottom>
              WealthWizard
            </Typography>
            <Typography variant="body2">
              © 2024 WealthWizard. All rights reserved.
            </Typography>
          </Container>
        </Footer>
      </MainContent>
      <WealthWizard initialMessage="What is personal financial planning?" />
    </>
  );
};

export default LandingPage;
