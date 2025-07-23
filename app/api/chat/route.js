import { GoogleGenAI } from "@google/genai";
console.log(process.env.GEMINI_API_KEY);
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  const { chat, history } = await request.json();

  console.log(chat);

  const Chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: history,
    config: {
      systemInstruction:
        "You are a chatbot , your name is ChatMe . Always give the answer is short form of 2 to 3 lines contails atmost 30",
    },
  });
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response2 = await Chat.sendMessageStream({
          message: chat,
        });
        for await (const chunk of response2) {
          const text = chunk.text;
          console.log(text);
          controller.enqueue(encoder.encode(text));
        }

        controller.close();
      } catch (err) {
        controller.enqueue(encoder.encode(`data: Error: ${err.message}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
