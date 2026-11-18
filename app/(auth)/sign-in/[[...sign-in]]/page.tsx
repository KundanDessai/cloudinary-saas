import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function SignInContent() {
  const { userId } = await auth();

  if (userId) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <SignIn />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}