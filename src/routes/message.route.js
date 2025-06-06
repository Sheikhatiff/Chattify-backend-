import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getMessages,
  getUserForSidebar,
  sendMessage,
  getAllMessages,
} from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.get("/users", protect, getUserForSidebar);

messageRouter.get("/:_id", protect, getMessages);

messageRouter.get("/test",getAllMessages);

messageRouter.post("/send/:_id", protect, sendMessage);

export default messageRouter;
