import mongoose from "mongoose";

const ChatHistorySchema = new mongoose.Schema(
  {
    auth_id: {
      type: String,
      required: true,
      index: true,
    },  
    title: {
      type: String,
      default:"abc",
    },
  },
  { timestamps: true }
);

export default mongoose.models.ChatHistory ||
  mongoose.model("ChatHistory", ChatHistorySchema);
