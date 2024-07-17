import express from "express";
import {
  getSessionHistory,
  saveSessionHistory,
} from "../controllers/chatController.js";

const router = express.Router();

// Route to get chat history for a session
router.get("/chats/:sessionId", getSessionHistory);

// Route to save chat history for a session
router.post("/chats/:sessionId", saveSessionHistory);

export default router;
