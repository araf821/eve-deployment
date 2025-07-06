// app/(dashboard)/call/BuddyProfileClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Phone } from "lucide-react";
import { User } from "@/types/next-auth";

export default function BuddyProfile({ user }: { user: User | null }) {
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
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

      mediaRecorder.ondataavailable = event => {
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
      recorder.stream.getTracks().forEach(track => track.stop());
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
      <div className="flex w-full max-w-sm flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-lg">
        <div className="mb-6">
          <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-black">
            <img
              src="/avatar.svg"
              alt="Buddy Avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">Ev</h1>

        <p className="mb-4 text-gray-600">AI Buddy</p>

        <div className="mb-8 font-mono text-2xl text-gray-700">
          {formatTime(timer)}
        </div>

        <button
          onClick={toggleRecording}
          className={`flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-colors ${
            isRecording
              ? "bg-green-500 hover:bg-green-400"
              : "bg-red-400 hover:bg-red-300"
          }`}
        >
          <Phone className="h-8 w-8 -rotate-225 text-white" />
        </button>
      </div>
    </div>
  );
}
