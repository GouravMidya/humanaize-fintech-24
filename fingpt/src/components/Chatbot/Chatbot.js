import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './Chatbot.css';
import Message from '../Message/Message';
import Sidebar from '../Sidebar/Sidebar';
import { Box, TextField, IconButton, Grid, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MenuIcon from '@mui/icons-material/Menu';
import { v4 as uuidv4 } from 'uuid';
import favicon from '../Chatbot/favicon.ico'; // Adjust the path as necessary
import handleSend from '../../services/handleSend'; // Import the handleSend function

const Chatbot = () => {
    const [conversations, setConversations] = useState([{ id: uuidv4(), messages: [], name: '' }]);
    const [currentConversationId, setCurrentConversationId] = useState(conversations[0].id);
    const [input, setInput] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSending, setIsSending] = useState({}); // State to manage if a message is being sent per conversation
    const [showQuestions, setShowQuestions] = useState(true); // State to manage the visibility of questions
    const [randomQuestions, setRandomQuestions] = useState([]); // State to store the randomized questions

    const questions = useMemo(() => [
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
        "What is estate planning and why is it important?"
    ], []);

    const getRandomQuestions = useCallback(() => {
        const shuffled = questions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }, [questions]);

    useEffect(() => {
        setRandomQuestions(getRandomQuestions());
    }, [getRandomQuestions]);

    const onSend = async (message) => {
        await handleSend(message || input, currentConversationId, setConversations, setIsSending, setInput); // Pass setInput
        setShowQuestions(false); // Hide questions when a message is sent
    };

    const handleNewConversation = () => {
        const newId = uuidv4();
        setConversations([...conversations, { id: newId, messages: [], name: '' }]);
        setCurrentConversationId(newId);
        setIsSending(prev => ({ ...prev, [newId]: false }));
        setShowQuestions(true); // Show questions for the new conversation
        setRandomQuestions(getRandomQuestions()); // Update questions for the new conversation
    };

    const handleConversationClick = (id) => {
        setCurrentConversationId(id);
        setShowQuestions(conversations.find(conv => conv.id === id)?.messages.length === 0); // Show questions if no messages
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
        setConversations(conversations.map((conv) =>
            conv.id === id ? { ...conv, name: newName } : conv
        ));
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleQuestionClick = (question) => {
        onSend(question); // Send the question as a message automatically
    };

    const currentMessages = useMemo(() => {
        return conversations.find((conv) => conv.id === currentConversationId)?.messages || [];
    }, [conversations, currentConversationId]);

    useEffect(() => {
        setShowQuestions(currentMessages.length === 0); // Show questions if no messages in the current conversation
    }, [currentConversationId, currentMessages]);

    return (
        <Box className="chat-container">
            <IconButton
                className="toggle-sidebar-button"
                onClick={toggleSidebar}
                style={{ position: 'fixed', left:'5px', top: '10px', color:'white'}}
            >
                <MenuIcon style={{ fontSize: '2rem' }} />
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
            <Box className={`chat-content ${isSidebarOpen ? '' : 'expanded'}`}>
                <img src={favicon} alt="Chat Icon" className="chat-icon" style={{marginTop:'-140px'}}/>
                <Box className="chat-messages">
                    {currentMessages.map((msg, index) => (
                        <Message key={index} sender={msg.sender} text={msg.text} />
                    ))}
                </Box>
                {showQuestions && (
                    <Grid 
                        container 
                        spacing={2} 
                        style={{ padding:'2rem' }}
                    >
                        {randomQuestions.map((question, index) => (
                            <Grid item xs={12} sm={6} key={index} >
                                <Button className="button-question"variant="contained" style={{ 
                                    border: '1px dashed #303030', 
                                    padding: '10px', 
                                    height:'5rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
                                    borderRadius: '10px',
                                    color:'#303030'
                                }}  fullWidth onClick={() => handleQuestionClick(question)}>
                                    {question}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                )}
                {currentConversationId && (
                    <Box className="chat-input" display="flex" alignItems="center" p={1} borderTop={1} borderColor="divider">
                        <TextField
                            style={{padding:'0.5rem'}}
                            fullWidth
                            variant="outlined"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isSending[currentConversationId] && onSend()}
                            disabled={isSending[currentConversationId]} // Disable input while sending
                        />
                        <IconButton color="primary" onClick={() => onSend()} disabled={isSending[currentConversationId]}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Chatbot;
