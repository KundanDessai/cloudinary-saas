
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowRight,
  Cloud,
  Image,
  Video,
  Zap,
  ShieldCheck,
  Download,
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Video Management",
    description:
      "Upload, organize and manage your videos in one place.",
  },
  {
    icon: Zap,
    title: "Smart Compression",
    description:
      "Optimize video files using Cloudinary transformations.",
  },
  {
    icon: Image,
    title: "Social Media Creator",
    description:
      "Transform images into formats suitable for social media.",
  },
  {
    icon: Download,
    title: "Easy Downloads",
    description:
      "Download your optimized media whenever you need it.",
  },
];

async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/home");
  }

  return (
    <main className="min-h-screen bg-base-100 text-base-content">
      {/* Navbar */}
      <header className="navbar max-w-7xl mx-auto px-6">
        <div className="flex-1 gap-2">
          <Cloud className="text-primary w-8 h-8" />
          <span className="text-xl font-bold">
            Cloudinary Showcase
          </span>
        </div>

        <div className="flex gap-3">
          <Link href="/sign-in" className="btn btn-ghost">
            Sign In
          </Link>
          <Link href="/sign-up" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="badge badge-primary badge-outline mb-6">
          Your personal media workspace
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Manage your media.
          <br />
          <span className="text-primary">
            Create without limits.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto mt-6 text-base-content/70 text-lg">
          Upload, optimize, transform and manage your images
          and videos with the power of Cloudinary.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-9">
          <Link href="/sign-up" className="btn btn-primary btn-lg">
            Get Started Free
            <ArrowRight size={20} />
          </Link>

          <Link href="/sign-in" className="btn btn-outline btn-lg">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            Everything you need in one place
          </h2>
          <p className="mt-3 text-base-content/60">
            Simple tools for managing and optimizing your media.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card bg-base-200 border border-base-300"
            >
              <div className="card-body">
                <feature.icon
                  size={32}
                  className="text-primary mb-2"
                />
                <h3 className="card-title">
                  {feature.title}
                </h3>
                <p className="text-base-content/65">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-base-300 py-8 text-center">
        <p className="text-sm text-base-content/60">
          © 2026 Cloudinary Showcase.
          Built with Next.js and Cloudinary.
        </p>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <LandingPage />
    </Suspense>
  );
}