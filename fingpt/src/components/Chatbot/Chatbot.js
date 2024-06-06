import React, { useState } from 'react';
import './Chatbot.css';
import Message from '../Message/Message';
import Sidebar from '../Sidebar/Sidebar';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import favicon from '../Chatbot/favicon.ico'; // Adjust the path as necessary

const Chatbot = () => {
    const [conversations, setConversations] = useState([{ id: 1, messages: [], name: '' }]);
    const [currentConversationId, setCurrentConversationId] = useState(1);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (input.trim()) {
            const newMessage = { sender: 'user', text: input };
            setConversations((prevConversations) =>
                prevConversations.map((conv) =>
                    conv.id === currentConversationId
                        ? { ...conv, messages: [...conv.messages, newMessage] }
                        : conv
                )
            );
            setInput('');

            // Simulate chatbot response
            const response = { sender: 'bot', text: 'This is a sample response' };
            setConversations((prevConversations) =>
                prevConversations.map((conv) =>
                    conv.id === currentConversationId
                        ? { ...conv, messages: [...conv.messages, response] }
                        : conv
                )
            );
        }
    };

    const handleNewConversation = () => {
        const newId = conversations.length ? Math.max(...conversations.map(c => c.id)) + 1 : 1;
        setConversations([...conversations, { id: newId, messages: [], name: '' }]);
        setCurrentConversationId(newId);
    };

    const handleConversationClick = (id) => {
        setCurrentConversationId(id);
    };

    const handleDeleteConversation = (id) => {
        const updatedConversations = conversations.filter((conv) => conv.id !== id);
        setConversations(updatedConversations);
        if (updatedConversations.length) {
            setCurrentConversationId(updatedConversations[0].id);
        } else {
            setCurrentConversationId(null);
        }
    };

    const handleEditConversation = (id, newName) => {
        setConversations(conversations.map((conv) =>
            conv.id === id ? { ...conv, name: newName } : conv
        ));
    };

    const currentMessages = conversations.find(
        (conv) => conv.id === currentConversationId
    )?.messages || [];

    return (
        <Box className="chat-container">
            <Sidebar
                className="chat-sidebar"
                conversations={conversations}
                onNewConversation={handleNewConversation}
                onConversationClick={handleConversationClick}
                onDeleteConversation={handleDeleteConversation}
                onEditConversation={handleEditConversation}
                currentConversationId={currentConversationId}
            />
            <Box className="chat-content">
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
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <IconButton color="primary" onClick={handleSend}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Chatbot;
