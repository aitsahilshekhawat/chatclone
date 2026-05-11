import Message from "../models/message.model.js";

import { io, getReceiverSocketId } from "../socket/socket.js";

// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    const { id: receiverId } = req.params;

    const senderId = req.user.userId;

    if (!text) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const newMessage = new Message({
      senderId,

      receiverId,

      text,
    });

    await newMessage.save();

    // REALTIME SOCKET
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Send Message Error:", error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// GET MESSAGES
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;

    const myId = req.user.userId;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },

        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Get Messages Error:", error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
