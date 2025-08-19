import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  const { clerk_id, name } = await request.json();
  try {
      await dbConnect();
      
      const user = await User.findOne({ clerk_id });
      if (user) {
      return Response.json({ user }, { status: 200 });
    }
    // console.log(clerk_id, name);
    const u = await User.create({
        name,
      clerk_id,
    });
    
    return Response.json({ user: u }, { status: 201 });
  } catch (e) {
    return Response.json({ message: "Mongodb Error" }, { status: 500 });
  }
}
