import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import SocialShareClient from "./SocialShareClient";

async function ProtectedSocialShare() {
  await auth.protect();

  return <SocialShareClient />;
}

export default function SocialSharePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ProtectedSocialShare />
    </Suspense>
  );
}