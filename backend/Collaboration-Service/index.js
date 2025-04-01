const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./Models/Message");

const app = express();
const server = http.createServer(app);

app.use(cors()); // Enable CORS for all routes

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Allow frontend origin
    methods: ["GET", "POST"],
  },
});

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/chatapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", async (data) => {
    console.log(`User ${data.userId} joined`);
    try {
      // Fetch all previous messages from the database
      const messages = await Message.find().sort({ createdAt: 1 }); // Sort by createdAt field
      socket.emit("previous_messages", messages); // Emit previous messages to the client
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });

  socket.on("send_message", async (msg) => {
    try {
      const newMessage = new Message({
        username: msg.username, // Keep only username
        text: msg.text,
      });

      await newMessage.save(); // Save new message to database
      io.emit("receive_message", newMessage); // Broadcast new message to all users
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});
