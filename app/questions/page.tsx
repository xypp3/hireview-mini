"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  text: string;
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [input, setInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("questions");
    if (stored) setQuestions(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  const addQuestion = () => {
    if (!input.trim()) return;
    setQuestions([
      ...questions,
      { id: crypto.randomUUID(), text: input },
    ]);
    setInput("");
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Questions</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 p-2 rounded text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter interview question"
        />
        <button
          onClick={addQuestion}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Add
        </button>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <div
            key={q.id}
            className="flex justify-between bg-gray-800 p-3 rounded"
          >
            <span>{q.text}</span>
            <button
              onClick={() => deleteQuestion(q.id)}
              className="text-red-400"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/")}
        className="mt-8 text-blue-400"
      >
        ← Back
      </button>
    </main>
  );
}
