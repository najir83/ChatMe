import dbConnect from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function POST(request) {
  const { chat_id, role, parts } = await request.json();

  try {
    await dbConnect();

    const chat_history = await Chat.create({
      chat_id,
      role,
      parts
    });

    return Response.json(
      { message: "message added successfully" },
      { status: 201 }
    );
  } catch (e) {
    return Response.json({ message: "Mongodb Error" }, { status: 500 });
  }
}

