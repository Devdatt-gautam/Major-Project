import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import { getRecepientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";
import language from "@google-cloud/language";
import vision from "@google-cloud/vision";

// import mongoose from "mongoose";
const sendMessage = async (req, res) => {
  try {
    const { recepientId, message } = req.body;
    let { img } = req.body;
    const client = new language.v1.LanguageServiceClient({
      projectId: process.env.GOOGLE_PROJECT_ID,
      key: process.env.GOOGLE_CLOUD_KEY,
    });
    //message profanity check
    const document = {
      content: message,
      type: "PLAIN_TEXT",
      languageCode: "*hi",
    };
    const request = {
      document,
    };

    const result = await client.moderateText(request);

    if (result) {
      result[0].moderationCategories.map((cat) => {
        if (cat.confidence >= 0.5) {
          throw new Error(`Your text contains/is ${cat.name}`);
        }
      });
    }

    // const sentiment = result.documentSentiment;
    // if (result.error) console.log(result.error, "hello");
    // console.log(result[0].moderationCategories, result[0].languageCode);

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

    if (img) {
      const client2 = new vision.ImageAnnotatorClient({
        projectId: process.env.GOOGLE_PROJECT_ID,
        key: process.env.GOOGLE_CLOUD_KEY,
      });

      const request = {
        image: {
          content: img.split(",")[1],
        },
      };
      // Performs label detection on the image file
      const [result] = await client2.safeSearchDetection(request);
      const detections = result.safeSearchAnnotation;

      console.log(detections);

      if (Object.values(detections).includes("LIKELY")) {
        throw new Error(`Adult,racy,medical,spoofy or violent image`);
      }
      if (Object.values(detections).includes("VERY_LIKELY")) {
        throw new Error(`Adult,racy,medical,spoofy or violent image`);
      }

      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img: img || "",
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
