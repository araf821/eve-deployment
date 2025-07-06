// app/(dashboard)/call/BuddyProfileClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Phone } from "lucide-react";

export default function BuddyProfile({ user }: { user: any }) {
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } else {
      const recorder = mediaRecorderRef.current;
      if (!recorder) return;

      recorder.stop();
      recorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");

        if (user?.id) {
          formData.append("userId", user.id);
        } else {
          console.error("User is null or missing ID");
          return;
        }

        const res = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        console.log("Transcript:", data.transcript);
      };
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm text-center flex items-center justify-center flex-col">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-black overflow-hidden">
            <img
              src="/avatar.svg"
              alt="Buddy Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ev</h1>

        <p className="text-gray-600 mb-4">AI Buddy</p>

        <div className="text-2xl font-mono text-gray-700 mb-8">{formatTime(timer)}</div>

        <button
          onClick={toggleRecording}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors ${
            isRecording
              ? "bg-green-500 hover:bg-green-400"
              : "bg-red-400 hover:bg-red-300"
          }`}
        >
          <Phone className="w-8 h-8 -rotate-225 text-white" />
        </button>
      </div>
    </div>
  );
}
