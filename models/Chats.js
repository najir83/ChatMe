import mongoose from "mongoose";

const ChatsSchema = new mongoose.Schema(
  {
    clerk_id: {
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

export default mongoose.models.Chat ||
  mongoose.model("Chat", ChatsSchema);
