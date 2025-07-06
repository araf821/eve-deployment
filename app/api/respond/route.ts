// app/api/respond/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";

async function readableStreamToBuffer(stream: unknown): Promise<Buffer> {
  const webStream = stream as ReadableStream<Uint8Array>;
  const reader = webStream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  try {
    const { _, userName } = await req.json();

    const prompt = `You are having a conversation at night with ${userName}, who is feeling unsafe. Talk like a human, at most three short sentences, like you are a friend. Conversational language, no extra words.`;

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const message = result.response.text();

    // Initialize ElevenLabs
    const eleven = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY!,
    });

    const stream = await eleven.textToSpeech.convert(
      process.env.ELEVENLABS_VOICE_ID!,
      {
        text: message,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }
    );

    // Convert ReadableStream to buffer
    const audioBuffer = await readableStreamToBuffer(stream); // stream is a Node Readable

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}