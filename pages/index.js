import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Wait for Clerk to load
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Redirect if not logged in
  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <div>
      <p>Hello {user.firstName}</p>
      <SignOutButton>Sign out</SignOutButton>
    </div>
  );
}