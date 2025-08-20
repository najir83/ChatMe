import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  const { clerk_id} = await request.json();
  try {
    await dbConnect();

    const user = await User.findOne({ clerk_id });
    if (!user) {
      return Response.json({ message: "user not found" }, { status: 404 });
    }
    user.role = "premium";
    user.query_limit = 15;
    user.used_query = 0;
    user.save();

    return Response.json({ user }, { status: 201 });
  } catch (e) {
    return Response.json({ message: "Mongodb Error" }, { status: 500 });
  }
}
