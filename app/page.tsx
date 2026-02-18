"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_PREP_TIME = 100;
const DEFAULT_RECORD_TIME = 140;

const loadTimeFromStorage = (key: string, defaultValue: number): number => {
  if (typeof window === "undefined") return defaultValue;
  const stored = localStorage.getItem(key);
  if (stored) {
    const parsed = parseInt(stored, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return defaultValue;
};

export default function Home() {
  const router = useRouter();
  const [prepTime, setPrepTime] = useState<number>(DEFAULT_PREP_TIME);
  const [recordTime, setRecordTime] = useState<number>(DEFAULT_RECORD_TIME);

  useEffect(() => {
    setPrepTime(loadTimeFromStorage("prepTime", DEFAULT_PREP_TIME));
    setRecordTime(loadTimeFromStorage("recordTime", DEFAULT_RECORD_TIME));
  }, []);

  const handlePrepTimeChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      setPrepTime(num);
      localStorage.setItem("prepTime", num.toString());
    }
  };

  const handleRecordTimeChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      setRecordTime(num);
      localStorage.setItem("recordTime", num.toString());
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-6 p-6">
      <h1 className="text-4xl font-bold">HireView Practice</h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="flex flex-col gap-2">
          <label htmlFor="prepTime" className="text-sm text-gray-300">
            Preparation Time (seconds)
          </label>
          <input
            id="prepTime"
            type="number"
            min="1"
            value={prepTime}
            onChange={(e) => handlePrepTimeChange(e.target.value)}
            className="px-4 py-2 bg-gray-800 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="recordTime" className="text-sm text-gray-300">
            Recording Time (seconds)
          </label>
          <input
            id="recordTime"
            type="number"
            min="1"
            value={recordTime}
            onChange={(e) => handleRecordTimeChange(e.target.value)}
            className="px-4 py-2 bg-gray-800 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
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
      </div>
    </main>
  );
}
