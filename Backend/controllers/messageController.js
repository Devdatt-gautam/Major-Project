import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import { getRecepientSocketId, io } from "../socket/socket.js";
// import mongoose from "mongoose";
const sendMessage = async (req, res) => {
  try {
    const { recepientId, message } = req.body;
    const senderId = req.user._id;
    if (senderId == recepientId) {
      throw new Error("You cannot send message to youself");
    }
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recepientId] },
    });

    if (!conversation) {
      // console.log(mongoose.Types.ObjectId.isValid(recepientId));

      conversation = new Conversation({
        participants: [senderId, recepientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });
    await newMessage.save();
    await conversation.updateOne({
      lastMessage: {
        text: message,
        sender: senderId,
      },
    });

    const recepientSocketId = getRecepientSocketId(recepientId);
    if (recepientSocketId) {
      io.to(recepientSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user._id;

  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConversations = async (req, res) => {
  const userId = req.user._id;
  // console.log(mongoose.Types.ObjectId.isValid(userId));
  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "username profilePic",
    });

    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { sendMessage, getMessages, getConversations };
