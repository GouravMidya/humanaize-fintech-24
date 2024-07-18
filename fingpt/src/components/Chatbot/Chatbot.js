import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./Chatbot.css";
import Message from "../Message/Message";
import Sidebar from "../Sidebar/Sidebar";
import {
  Box,
  TextField,
  IconButton,
  Grid,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { v4 as uuidv4 } from "uuid";
import favicon from "../Chatbot/favicon.ico"; // Adjust the path as necessary
import handleSend from "../../services/handleSend"; // Import the handleSend function
import CloseIcon from "@mui/icons-material/Close";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { getUsername } from "../../services/authServices";
import { useTheme } from "@mui/material/styles";

const Chatbot = ({ initialMessage }) => {
  const theme = useTheme();
  const [conversations, setConversations] = useState([
    { id: uuidv4(), messages: [], name: "" },
  ]);
  const [currentConversationId, setCurrentConversationId] = useState(
    conversations[0].id
  );
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSending, setIsSending] = useState({}); // State to manage if a message is being sent per conversation
  const [showQuestions, setShowQuestions] = useState(true); // State to manage the visibility of questions
  const [randomQuestions, setRandomQuestions] = useState([]); // State to store the randomized questions
  const [isToggled, setIsToggled] = useState(false); // State to manage button toggle
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { userId } = await getUsername(); // Assuming this function returns an object with userId
        setUserId(userId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  const questions = useMemo(
    () => [
      "What are some effective saving strategies?",
      "How can I improve my overall financial health?",
      "How can I build an emergency fund quickly?",
      "What's the difference between term and whole life insurance?",
      "What are the benefits of tax-advantaged accounts?",
      "How can I improve my credit score?",
      "What are some strategies for early retirement?",
      "What are some low-risk investment options?",
      "How do I set financial goals?",
      "How much of my income should I save each month?",
      "How do I start investing?",
      "How much should I invest in the stock market?",
      "When should I start saving for retirement?",
      "What is the best way to pay off debt?",
      "What is the difference between a tax credit and a tax deduction?",
      "How can I choose the best insurance plan for my needs?",
      "What are some common financial mistakes to avoid?",
      "How can I generate passive income?",
      "What is estate planning and why is it important?",
    ],
    []
  );

  useEffect(() => {
    if (initialMessage) {
      onSend(initialMessage);
    }
  }, [initialMessage]);

  const getRandomQuestions = useCallback(() => {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [questions]);

  useEffect(() => {
    setRandomQuestions(getRandomQuestions());
  }, [getRandomQuestions]);

  const onSend = async (message) => {
    setIsSending((prev) => ({ ...prev, [currentConversationId]: true }));
    await handleSend(
      message || input,
      currentConversationId,
      setConversations,
      setIsSending,
      setInput,
      userId // Add this line
    );
    setShowQuestions(false);
    setIsSending((prev) => ({ ...prev, [currentConversationId]: false }));
  };

  const handleNewConversation = () => {
    const newId = uuidv4();
    setConversations([...conversations, { id: newId, messages: [], name: "" }]);
    setCurrentConversationId(newId);
    setIsSending((prev) => ({ ...prev, [newId]: false }));
    setShowQuestions(true); // Show questions for the new conversation
    setRandomQuestions(getRandomQuestions()); // Update questions for the new conversation
  };

  const handleConversationClick = (id) => {
    setCurrentConversationId(id);
    setShowQuestions(
      conversations.find((conv) => conv.id === id)?.messages.length === 0
    ); // Show questions if no messages
  };

  const handleDeleteConversation = (id) => {
    const updatedConversations = conversations.filter((conv) => conv.id !== id);
    setConversations(updatedConversations);

    // Check if there are any conversations left after deletion
    if (updatedConversations.length > 0) {
      // Set the current conversation to the first conversation in the updated list
      setCurrentConversationId(updatedConversations[0].id);
      setShowQuestions(updatedConversations[0].messages.length === 0); // Show questions if no messages
    } else {
      // If there are no conversations left, set the current conversation to null
      setCurrentConversationId(null);
    }
  };

  const handleEditConversation = (id, newName) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === id ? { ...conv, name: newName } : conv
      )
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsToggled(!isToggled); // Toggle the button state
  };

  const handleQuestionClick = (question) => {
    onSend(question); // Send the question as a message automatically
  };

  const currentMessages = useMemo(() => {
    return (
      conversations.find((conv) => conv.id === currentConversationId)
        ?.messages || []
    );
  }, [conversations, currentConversationId]);

  useEffect(() => {
    setShowQuestions(currentMessages.length === 0); // Show questions if no messages in the current conversation
  }, [currentConversationId, currentMessages]);

  return (
    <Box className="chat-container">
      <IconButton
        className="toggle-sidebar-button"
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "70px",
          left: isToggled ? "20%" : "10px",
          color:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.7)"
              : "#1976d2",
          background:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "white",
          borderRadius: "50%",
          padding: "8px",
          zIndex: 1000,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0px 2px 4px rgba(255, 255, 255, 0.1)"
              : "0px 2px 4px rgba(0, 0, 0, 0.2)",
          transition: "right 0.3s ease",
        }}
      >
        {isToggled ? (
          <CloseIcon style={{ fontSize: "1.5rem" }} />
        ) : (
          <AddCommentIcon style={{ fontSize: "1.5rem" }} />
        )}
      </IconButton>
      {isSidebarOpen && (
        <Sidebar
          className="chat-sidebar"
          conversations={conversations}
          onNewConversation={handleNewConversation}
          onConversationClick={handleConversationClick}
          onDeleteConversation={handleDeleteConversation}
          onEditConversation={handleEditConversation}
          currentConversationId={currentConversationId}
        />
      )}
      <Box className={`chat-content ${isSidebarOpen ? "" : "expanded"}`}>
        <img
          src={favicon}
          alt="Chat Icon"
          className="chat-icon"
          style={{ marginTop: "-140px" }}
        />
        <Box className="chat-messages">
          {currentMessages.map((msg, index) => (
            <Message key={index} sender={msg.sender} text={msg.text} />
          ))}
        </Box>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {showQuestions && (
            <Grid
              container
              spacing={2}
              style={{ padding: "2rem", width: "70%" }}
            >
              {randomQuestions.map((question, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Button
                    className="button-question"
                    variant="contained"
                    style={{
                      border:
                        theme.palette.mode === "dark"
                          ? "1px solid rgba(255, 255, 255, 0.23)"
                          : "1px solid #303030",
                      padding: "10px",
                      height: "5rem",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(255, 255, 255, 0.5)",
                      borderRadius: "10px",
                      color:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.9)"
                          : "#303030",
                      boxShadow: "none",
                    }}
                    fullWidth
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question}
                  </Button>
                </Grid>
              ))}
            </Grid>
          )}
        </div>
        {currentConversationId && (
          <Box
            className="chat-input"
            display="flex"
            alignItems="center"
            p={1}
            borderTop={1}
            borderColor="divider"
            justifyContent="center"
          >
            <TextField
              style={{
                padding: "0.5rem",
                maxWidth: "70%",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.05)",
              }}
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color={
                        theme.palette.mode === "dark" ? "default" : "primary"
                      }
                      onClick={() => onSend()}
                      disabled={
                        !input.trim() || isSending[currentConversationId]
                      }
                      style={{
                        color:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.7)"
                            : theme.palette.primary.main,
                      }}
                    >
                      {isSending[currentConversationId] ? (
                        <CircularProgress size={24} />
                      ) : (
                        <SendIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chatbot;
