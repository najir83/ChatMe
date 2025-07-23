import dbConnect from "@/lib/mongodb";
import Chat from "@/models/Chat";
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { chat_id } = await params;
    const history = await Chat.find({ chat_id }).select("role parts -_id");

    return Response.json({ history }, { status: 200 });
  } catch (e) {
    Response.json({ message: "Mongodb Error" }, { status: 500 });
  }
}
