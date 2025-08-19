import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  const { clerk_id } = await request.json();
  try {
    await dbConnect();

    const user = await User.findOne({ clerk_id });
    if (user.used_query === user.query_limit) {
      return Response.json({ message: "chat limit exced" }, { status: 429 });
    }
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    user.used_query = user.used_query + 1;
    await user.save();

    return Response.json({ user }, { status: 201 });
  } catch (e) {
    return Response.json({ message: "Mongodb Error" }, { status: 500 });
  }
}
