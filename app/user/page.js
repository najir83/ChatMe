"use client"
import { useUser } from "@clerk/nextjs";


export default function Page() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Sign in to view this page</div>;
  }

  return <div className="text-white">
    <p>
        Hello {user.id}
    </p>
    <p>
        Hello {user.fullName}
    </p>
    



  </div>;
}