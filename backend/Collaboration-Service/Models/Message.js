const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true } // Adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("Message", MessageSchema);
