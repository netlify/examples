import type { Context } from "@netlify/functions";
import Groq from "groq-sdk/index.mjs";

const groq = new Groq({
  apiKey: Netlify.env.get('GROQ_API_KEY'),
});

export default async (request: Request, context: Context) => {
  const form = await request.formData();
  const file = form.get("audio") as File;

  // Create a transcription job
  const transcription = await groq.audio.transcriptions.create({
    file, // Required path to audio file - replace with your audio file!
    model: "distil-whisper-large-v3-en", // Required model to use for transcription
    prompt: "Specify context or spelling", // Optional
    response_format: "json", // Optional
    language: "en", // Optional
    temperature: 0.0, // Optional
  });
  // Log the transcribed text
  console.log(transcription.text);

  const response = Response.json({
    text: transcription.text,
  });
  // since custom control lives in iframe and under different domain, allow CORS for this endpoint
  // for production allow only for known hosts
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.append("Access-Control-Allow-Headers", "*");
  response.headers.append("Access-Control-Allow-Methods", "*");
  return response;
};
