import mongoose from "mongoose";

const PartSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const MessageSchema = new mongoose.Schema(
  {
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatHistory",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "model"],
      required: true,
    },
    parts: {
      type: [PartSchema],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.history ||
  mongoose.model("history", MessageSchema);
