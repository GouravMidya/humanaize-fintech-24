import React from "react";
import { Typography, Button, Container, Grid, Box } from "@mui/material";
import { Link } from "react-router-dom";
import heroImage from "./../assets/hero_image_3.jpg";
import featureImage from "./../assets/support0.jpeg";
import featureImage1 from "./../assets/support8.jpg";
import featureImage2 from "./../assets/support7.jpg";
import featureImage3 from "./../assets/support3.jpg";
import featureImage4 from "./../assets/support4.jpg";
import featureImage5 from "./../assets/support6.jpg";
import featureImage6 from "./../assets/support9.jpg";
import WealthWizard from "../components/WealthWizard";
import { styled, useTheme } from "@mui/material/styles";

const FullScreenHero = styled(Box)(({ theme }) => ({
  position: "relative",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.mode === "dark" ? "#BDBDBD" : theme.palette.common.black, // Light grey in dark mode
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${heroImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: theme.palette.mode === "dark" ? 0.4 : 0.5, // Reduce opacity slightly in dark mode
    zIndex: -1,
  },
}));

const WhiteSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(8, 0),
}));

const ImageSection = styled(Box)(({ theme, image }) => ({
  position: "relative",
  backgroundImage: `url("${image}")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: 400,
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // This creates a semi-transparent black overlay
    opacity: theme.palette.mode === "dark" ? 1 : 0, // Only show in dark mode
    transition: "opacity 0.3s ease-in-out",
  },
}));
const Footer = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.background.paper // Use the same color as navbar in dark mode
      : theme.palette.primary.main, // Keep the primary color for light mode
  color:
    theme.palette.mode === "dark"
      ? theme.palette.text.primary // Use primary text color in dark mode
      : theme.palette.primary.contrastText, // Keep contrast text color for light mode
  padding: theme.spacing(6),
}));

const LandingPage = () => {
  const theme = useTheme();
  const features = [
    {
      title: "WealthWizard AI",
      description:
        "Get personalized financial advice from our advanced AI-powered planning specialist.",
      link: "/home",
      image: featureImage,
    },
    {
      title: "Investment Portfolio Management",
      description:
        "Manage your investments efficiently and track your portfolio's performance with real-time updates and insights. Optimize your financial growth with our comprehensive portfolio management tools.",
      link: "/investment",
      image: featureImage6,
    },
    {
      title: "Expense Tracker",
      description:
        "Monitor and categorize your spending  while gaining insights into spending patterns to make informed decisions and work towards your financial goals.",
      link: "/expensetracker",
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
    {
      title: "Financial Goal Planning",
      description:
        "Set and achieve your financial goals, track your progress, and stay motivated.",
      link: "/goal",
      image: featureImage5,
    },
  ];

  const facts = [
    "AI-powered financial planning tools can help increase investment returns by up to 4% annually.",
    "Diversifying your investments can reduce risk and increase the potential for long-term gains!",
    "Studies show that people who regularly use expense trackers save up to 20% more money than those who don't. This is due to increased awareness of spending habits, which often leads to more mindful purchasing decisions.",
    "People who create and stick to a budget save 10% more of their income on average.",
    "Improving your credit score by 100 points could save you thousands on mortgage interest.",
    "Do you know that debt can be a powerful tool for financial growth but also a source of significant financial risk?",
    "Studies show that individuals with a written financial plan are more than twice as likely to achieve their financial goals compared to those without one.",
  ];

  return (
    <>
      <FullScreenHero>
        <Container maxWidth="m">
          <Typography component="h1" variant="h2" align="center" gutterBottom>
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
                <Button variant="contained" component={Link} to={feature.link}>
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
      <br />
      <br />
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
      <WealthWizard initialMessage="What is personal financial planning?" />
    </>
  );
};

export default LandingPage;
