import React, { useState } from 'react';
import { List, ListItem, ListItemText, IconButton, Box, TextField, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

const Sidebar = ({ conversations, onNewConversation, onConversationClick, onDeleteConversation, onEditConversation, currentConversationId }) => {
    const [editingConversationId, setEditingConversationId] = useState(null);
    const [editedName, setEditedName] = useState('');

    const handleEditClick = (id, name) => {
        setEditingConversationId(id);
        setEditedName(name);
    };

    const handleEditChange = (e) => {
        setEditedName(e.target.value);
    };

    const handleEditSave = () => {
        onEditConversation(editingConversationId, editedName);
        setEditingConversationId(null);
    };

    return (
        <Box className="chat-sidebar">
            <Box display="flex" justifyContent="center" m={1}>
                <Button color="primary" onClick={onNewConversation}>
                    <Typography>New Conversation</Typography>
                </Button>
            </Box>
            <List>
                {conversations.map((conversation) => (
                    <ListItem
                        key={conversation.id}
                        button
                        selected={conversation.id === currentConversationId}
                        onClick={() => onConversationClick(conversation.id)}
                    >
                        {editingConversationId === conversation.id ? (
                            <Box display="flex" alignItems="center" width="100%">
                                <TextField
                                    fullWidth
                                    value={editedName}
                                    onChange={handleEditChange}
                                    onBlur={handleEditSave}
                                    onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
                                />
                                <IconButton onClick={handleEditSave}>
                                    <CheckIcon />
                                </IconButton>
                            </Box>
                        ) : (
                            <>
                                <ListItemText primary={conversation.name || `Conversation ${conversation.id}`} />
                                <IconButton edge="end" onClick={() => handleEditClick(conversation.id, conversation.name || `Conversation ${conversation.id}`)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" onClick={() => onDeleteConversation(conversation.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
