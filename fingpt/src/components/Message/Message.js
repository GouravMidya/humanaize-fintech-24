import React from "react";
import "./Message.css";
import { Box, Typography, Paper, useTheme } from "@mui/material";

const Message = ({ sender, text }) => {
  const theme = useTheme();
  const isUser = sender === "user";

  return (
    <Box
      display="flex"
      justifyContent={isUser ? "flex-end" : "flex-start"}
      mb={2}
    >
      <Paper
        elevation={1}
        style={{
          maxWidth: "80%",
          padding: "10px",
          backgroundColor: isUser
            ? theme.palette.mode === "dark"
              ? "rgba(0, 123, 255, 0.6)" // Muted blue for user messages in dark mode
              : "rgba(0, 123, 255, 0.2)" // Light blue for user messages in light mode
            : theme.palette.mode === "dark"
            ? "#111111" // Very dark grey for bot messages in dark mode
            : "#F3F3F3", // Light grey for bot messages in light mode
          color:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.8)"
              : isUser
              ? "rgba(0, 0, 0, 0.8)"
              : "rgba(0, 0, 0, 0.8)",
        }}
      >
        <Typography variant="body1">{text}</Typography>
      </Paper>
    </Box>
  );
};

export default Message;
