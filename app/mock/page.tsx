"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Stage = "ready" | "recording" | "review" | "complete" | "error";

export default function MockPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("ready");
  const [prepTime, setPrepTime] = useState(51);
  const [recordTime, setRecordTime] = useState(90);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("questions");
    if (stored) {
      const parsed = JSON.parse(stored);
      setQuestions(parsed.map((q: any) => q.text));
    }
  }, []);

  useEffect(() => {
    if (stage === "ready" && prepTime > 0) {
      const timer = setTimeout(() => setPrepTime(prepTime - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (stage === "ready" && prepTime === 0) {
      startRecording();
    }
  }, [stage, prepTime]);

  useEffect(() => {
    if (stage === "recording" && recordTime > 0) {
      const timer = setTimeout(
        () => setRecordTime(recordTime - 1),
        1000
      );
      return () => clearTimeout(timer);
    }

    if (stage === "recording" && recordTime === 0) {
      stopRecording();
    }
  }, [stage, recordTime]);

  const startRecording = async (retryCount = 0) => {
    try {
      setError(null);
      setStage("recording");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser does not support camera access");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
        setStage("review");
      };

      mediaRecorder.start();
    } catch (err: any) {
      console.error("Error accessing webcam:", err);
      setError(err.message || "Failed to access webcam. Please check permissions and try again.");
      setStage("error");
      
      // Auto-retry once after 1 second if it's a permission/device error
      if (retryCount < 1 && (err.name === "NotAllowedError" || err.name === "NotFoundError" || err.name === "NotReadableError")) {
        setTimeout(() => {
          startRecording(retryCount + 1);
        }, 1000);
      }
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    const tracks =
      (videoRef.current?.srcObject as MediaStream)?.getTracks() ||
      [];
    tracks.forEach((track) => track.stop());
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setStage("complete");
      return;
    }
    setCurrentIndex(currentIndex + 1);
    setPrepTime(30);
    setRecordTime(90);
    setVideoURL(null);
    setStage("ready");
  };

  if (!questions.length) {
    return (
      <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <p>No questions found.</p>
        <button
          onClick={() => router.push("/questions")}
          className="text-blue-400 mt-4"
        >
          Add Questions
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 text-center">
      {stage === "ready" && (
        <>
          <h2 className="text-2xl mb-4">
            {questions[currentIndex]}
          </h2>
          <p className="text-4xl">{prepTime}s</p>
          <p className="mt-2 text-gray-400">
            Preparation Time
          </p>
        </>
      )}

      {stage === "recording" && (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-96 rounded mb-4"
          />
          <p className="text-4xl">{recordTime}s</p>
          <p className="text-gray-400">Recording...</p>
        </>
      )}

      {stage === "review" && videoURL && (
        <>
          <video
            src={videoURL}
            controls
            className="w-96 rounded mb-4"
          />
          <div className="flex gap-4">
            <button
              onClick={() => {
                setPrepTime(30);
                setRecordTime(90);
                setVideoURL(null);
                setStage("ready");
              }}
              className="px-4 py-2 bg-yellow-600 rounded"
            >
              Retry
            </button>

            <button
              onClick={nextQuestion}
              className="px-4 py-2 bg-green-600 rounded"
            >
              Next
            </button>
          </div>
        </>
      )}

      {stage === "complete" && (
        <>
          <h2 className="text-3xl mb-4">
            Interview Complete 🎉
          </h2>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 rounded"
          >
            Back Home
          </button>
        </>
      )}

      {stage === "error" && (
        <>
          <h2 className="text-2xl mb-4 text-red-400">
            Camera Access Error
          </h2>
          <p className="text-gray-300 mb-4 max-w-md">
            {error || "Unable to access your webcam. Please grant camera permissions and try again."}
          </p>
          <button
            onClick={() => {
              setPrepTime(30);
              setRecordTime(90);
              setError(null);
              setStage("ready");
            }}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            Try Again
          </button>
        </>
      )}
    </main>
  );
}
