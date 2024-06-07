import { useState, useEffect } from 'react';
import axios from '../services/api';

const useChatbot = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (message) => {
        setLoading(true);
        try {
            const response = await axios.post('/query', { question: message });
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'user', text: message },
                { sender: 'bot', text: response.data.answer },
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
        setLoading(false);
    };

    return { messages, sendMessage, loading };
};

export default useChatbot;
