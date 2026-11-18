
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import AppShell from "./AppShell";

async function ProtectedApp({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await auth.protect();

  return <AppShell>{children}</AppShell>;
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ProtectedApp>{children}</ProtectedApp>
    </Suspense>
  );
}
