import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import VideoUploadClient from "./VideoUploadClient";

async function ProtectedVideoUpload() {
  await auth.protect();

  return <VideoUploadClient />;
}

export default function VideoUploadPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ProtectedVideoUpload />
    </Suspense>
  );
}