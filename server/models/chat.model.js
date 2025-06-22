const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  members: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    required: true,
    default: [],
    validate: [v => v.length > 1, "A chat must have at least two members."]
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },
  unreadMessageCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
