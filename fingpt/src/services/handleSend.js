// services/handleSend.js

import axios from 'axios';

// Utility function to capitalize the first letter
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const handleSend = async (input, currentConversationId, setConversations, setIsSending, setInput) => {
    if (input.trim()) {
        const newMessage = { sender: 'user', text: input };
        setConversations((prevConversations) =>
            prevConversations.map((conv) =>
                conv.id === currentConversationId
                    ? { ...conv, messages: [...conv.messages, newMessage] }
                    : conv
            )
        );

        // Disable the input while sending
        setIsSending(prev => ({ ...prev, [currentConversationId]: true }));

        // Clear input before sending the message
        setInput('');

        // Send user input to the backend API
        try {
            const response = await axios.post('http://localhost:8000/api/query', { query: input, sessionId: currentConversationId });
            const capitalizedBotResponse = capitalizeFirstLetter(response.data.response);
            const botMessage = { sender: 'bot', text: capitalizedBotResponse, sessionId: response.data.sessionId };
            setConversations((prevConversations) =>
                prevConversations.map((conv) =>
                    conv.id === response.data.sessionId
                        ? { ...conv, messages: [...conv.messages, botMessage] }
                        : conv
                )
            );
        } catch (error) {
            console.error('Error sending message to API:', error);
            // Optionally handle the error (e.g., display an error message)
        } finally {
            // Re-enable the input after the response is received
            setIsSending(prev => ({ ...prev, [currentConversationId]: false }));
        }
    }
};

export default handleSend;
