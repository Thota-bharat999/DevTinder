const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getScretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initilizeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, lastName, userId, targetUserId }) => {
      const roomId = getScretRoomId(userId, targetUserId);
      console.log(firstName + " joined room : " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getScretRoomId(userId, targetUserId);

          let chat = await Chat.findOne({
            participantes: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participantes: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          // IMPORTANT: send senderId
          io.to(roomId).emit("messageRecived", {
            senderId: userId,
            firstName,
            lastName,
            text,
          });
        } catch (err) {
          console.error(err);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });
};

module.exports = initilizeSocket;
