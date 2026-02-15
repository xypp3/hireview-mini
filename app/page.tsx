"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-6">
      <h1 className="text-4xl font-bold">HireView Practice</h1>

      <button
        onClick={() => router.push("/questions")}
        className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500"
      >
        Manage Questions
      </button>

      <button
        onClick={() => router.push("/mock")}
        className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-500"
      >
        Start Mock Interview
      </button>
    </main>
  );
}
