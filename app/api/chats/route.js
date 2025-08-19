import dbConnect from "@/lib/mongodb";
import Chats from "@/models/Chats";

export async function POST(request) {
  const { clerk_id, title } = await request.json();
  console.log(clerk_id, title);
  try {
    await dbConnect();

    const chat_history = await Chats.create({
      clerk_id,
      title,
    });

    return Response.json({ chat_id: chat_history._id }, { status: 201 });
  } catch (e) {
    return Response.json({ message: "Mongodb Error" }, { status: 500 });
  }
}
