import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key tidak ditemukan." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
      Kamu adalah AI Assistant Budaya Indonesia.
      Fokus pada budaya Indonesia.
      Jika ditanya hal di luar budaya Indonesia, arahkan kembali.
    `;

    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents,
    });

    const reply = result.text;

    return NextResponse.json({
      candidates: [
        {
          content: {
            parts: [{ text: reply }],
          },
        },
      ],
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        detail: String(error),
      },
      { status: 500 }
    );
  }
}
