// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { db } from "@/server/db"; // adjust path as needed
import { voiceTranscriptsTable } from "@/server/db/schema"; // adjust path
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

// Ensure this is set in your .env
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
  }

  const formData = await req.formData();
  const audioBlob = formData.get("file") as Blob | null;
  const userId = formData.get("userId") as string;

  if (!audioBlob || !userId) {
    return NextResponse.json({ error: "Missing audio or userId" }, { status: 400 });
  }

  const buffer = Buffer.from(await audioBlob.arrayBuffer());

  const file = new File([buffer], "audio.webm", { type: "audio/webm" });

  try {
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });

    const transcript = transcription.text;

    // Insert into database
    await db.insert(voiceTranscriptsTable).values({
      id: uuidv4(),
      userId,
      transcript,
    });

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
