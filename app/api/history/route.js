import dbConnect from "@/lib/mongodb";
import ChatHistory from "@/models/ChatHistory";

export async function POST(request) {
  const { auth_id, title } = await request.json();
  console.log(auth_id, title);
  try {
    await dbConnect();

    const chat_history = await ChatHistory.create({
      auth_id,
      title,
    });

    return Response.json({ chat_id: chat_history._id }, { status: 201 });
  } catch (e) {
    return Response.json({ message: "Mongodb Error" }, { status: 500 });
  }
}
