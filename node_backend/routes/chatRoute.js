import express from "express";
import {
  addChatSession,
  deleteChatSession,
  getChatSessions,
  updateChatName,
} from "../controllers/chatController.js";

const router = express.Router();

// Route to get all chat sessions for a user
router.get("/", getChatSessions);

// Endpoint to add a new chat session to the user
router.post("/", addChatSession);

// Endpoint to delete a chat session from the user
router.delete("/", deleteChatSession);

//Endpoint to update the name of a chat session
router.put("/", updateChatName);

export default router;
