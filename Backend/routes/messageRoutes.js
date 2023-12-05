import express from "express";
import {
  sendMessage,
  getMessages,
  getConversations,
} from "../controllers/messageController.js";
import protectRoute from "../middlewares/protectRoute.js";
const router = express.Router();

router.get("/:otherUserId", protectRoute, getMessages);
router.get("/", protectRoute, getConversations);
router.post("/", protectRoute, sendMessage);

export default router;
