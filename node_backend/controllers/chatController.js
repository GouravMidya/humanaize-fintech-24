import User from "../models/userModel.js";

// Controller function to add a new chat session to a user
export const addChatSession = async (req, res) => {
  const { id: chatSessionId, userId, chatName } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }
    user.chat_sessions.push({
      chat_session_id: chatSessionId,
      chat_name: chatName,
    });

    await user.save();
    res.status(200).send("Chat session added successfully");
  } catch (error) {
    console.error("Error updating user with new chat session:", error);
    res.status(500).send("Internal server error");
  }
};

// Controller function to delete a chat session from a user
export const deleteChatSession = async (req, res) => {
  const { id: chatSessionId, userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.chat_sessions = user.chat_sessions.filter(
      (session) => session.chat_session_id !== chatSessionId
    );

    await user.save();
    res.status(200).send("Chat session deleted successfully");
  } catch (error) {
    console.error("Error deleting chat session:", error);
    res.status(500).send("Internal server error");
  }
};

// Controller function to fetch all chat sessions for a user
export const getChatSessions = async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Send the user's chat sessions
    res.status(200).json(user.chat_sessions);
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    res.status(500).send("Internal server error");
  }
};
