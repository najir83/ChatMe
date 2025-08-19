import dbConnect from "@/lib/mongodb";
import Chats from "@/models/Chats";
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { clerk_id } = await params;

    const chats = await Chats.find({ clerk_id }).select("title");

    return Response.json({ chats }, { status: 200 });
  } catch (e) {
    Response.json({ message: "Mongodb Error" }, { status: 500 });
  }
}
