import React, { useState } from 'react';
import './Chatbot.css';
import Message from '../Message/Message';
import Sidebar from '../Sidebar/Sidebar';
import { Box, TextField, IconButton } from '@mui/material';
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

    const onSend = async () => {
        await handleSend(input, currentConversationId, setConversations, setIsSending, setInput); // Pass setInput
    };

    const handleNewConversation = () => {
        const newId = uuidv4();
        setConversations([...conversations, { id: newId, messages: [], name: '' }]);
        setCurrentConversationId(newId);
        setIsSending(prev => ({ ...prev, [newId]: false }));
    };

    const handleConversationClick = (id) => {
        setCurrentConversationId(id);
    };

    const handleDeleteConversation = (id) => {
        const updatedConversations = conversations.filter((conv) => conv.id !== id);
        setConversations(updatedConversations);
    
        // Check if there are any conversations left after deletion
        if (updatedConversations.length > 0) {
            // Set the current conversation to the first conversation in the updated list
            setCurrentConversationId(updatedConversations[0].id);
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

    const currentMessages = conversations.find(
        (conv) => conv.id === currentConversationId
    )?.messages || [];

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
                <img src={favicon} alt="Chat Icon" className="chat-icon" />
                <Box className="chat-messages">
                    {currentMessages.map((msg, index) => (
                        <Message key={index} sender={msg.sender} text={msg.text} />
                    ))}
                </Box>
                {currentConversationId && (
                    <Box className="chat-input" display="flex" alignItems="center" p={1} borderTop={1} borderColor="divider">
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isSending[currentConversationId] && onSend()}
                            disabled={isSending[currentConversationId]} // Disable input while sending
                        />
                        <IconButton color="primary" onClick={onSend} disabled={isSending[currentConversationId]}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Chatbot;
