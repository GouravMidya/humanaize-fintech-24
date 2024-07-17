import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["human", "ai"],
  },
  content: {
    type: String,
    required: true,
  },
});

const ChatSessionSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    unique: true,
  },
  history: [MessageSchema],
});

const ChatSession = mongoose.model("ChatSession", ChatSessionSchema);

export const getSessionHistory = async (req, res) => {
  const sessionId = req.params.sessionId;
  try {
    console.log("Searching for session ID:", sessionId);
    let chatSession = await ChatSession.findOne({
      session_id: sessionId,
    }).lean();
    console.log("Found chat session:", chatSession);

    if (!chatSession || !chatSession.history) {
      console.log("No chat session or history found");
      res.json([]);
    } else {
      console.log("Sending history:", chatSession.history);
      res.json(chatSession.history);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const saveSessionHistory = async (req, res) => {
  const sessionId = req.params.sessionId;
  const messages = req.body.messages;
  try {
    let chatSession = await ChatSession.findOne({ session_id: sessionId });
    if (!chatSession) {
      chatSession = new ChatSession({
        session_id: sessionId,
        history: messages,
      });
    } else {
      chatSession.history = messages;
    }
    await chatSession.save();
    res.status(200).json({ message: "Chat history saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
