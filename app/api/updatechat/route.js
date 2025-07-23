import dbConnect from "@/lib/mongodb";
import ChatHistory from "@/models/ChatHistory";

export async function POST(request) {
  try {
    const { chat_id, title } = await request.json();
    console.log("Updating Chat:", chat_id, title);

    await dbConnect();

    const updated = await ChatHistory.findByIdAndUpdate(
      chat_id,
      { title: title },
      { new: true } // ✅ Return the updated document
    );

    if (!updated) {
      return Response.json({ message: "Chat not found" }, { status: 404 });
    }

    return Response.json({ message: "Update successful", chat: updated }, { status: 200 });
  } catch (e) {
    console.error("Update error:", e);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
