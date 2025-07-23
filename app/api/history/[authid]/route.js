import dbConnect from "@/lib/mongodb";
import ChatHistory from "@/models/ChatHistory";
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { authid } = await params;
    const chat_history = await ChatHistory.find({ auth_id: authid }).select("title");

    return Response.json({ chat_history }, { status: 200 });
  } catch (e) {
    Response.json({ message: "Mongodb Error" }, { status: 500 });
  }
}
