
import { auth } from "@clerk/nextjs/server";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  await auth.protect();

  return <HomeClient />;
}
