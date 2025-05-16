import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    });
    res.status(200).json(filteredUsers);
  } catch (err) {
    console.log(`Error in getUserForSidebar: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { _id: reciever } = req.params;
    const sender = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: sender, recieverId: reciever },
        { senderId: reciever, recieverId: sender },
      ],
    });
    res.status(200).json(messages);
  } catch (err) {
    console.log(`Error in getMessages: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { _id: recieverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const recieverSocketId = getRecieverSocketId(recieverId);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json({
      newMessage,
    });
  } catch (err) {
    console.log(`Error in sendMessage: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
