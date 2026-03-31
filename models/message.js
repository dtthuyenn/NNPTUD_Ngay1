const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: String,
  to: String,
  messageContent: {
    type: {
      type: String, // "text" hoặc "file"
    },
    text: String
  }
}, { timestamps: true });

// 👇 ĐÂY là MODEL (quan trọng)
module.exports = mongoose.model("Message", messageSchema);