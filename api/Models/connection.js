const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // First user in the connection
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Second user in the connection
  createdDate: { type: Date, default: Date.now }, // When the connection was created
});

module.exports = mongoose.model("Connection", connectionSchema);
