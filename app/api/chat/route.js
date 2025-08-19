import { GoogleGenAI } from "@google/genai";

const WeatherApiKey = process.env.WEATHER_API_KEY;







// --------------------------------------- Tools ---------------------------------------


function sum({ num1, num2 }) {
  return num1 + num2;
}

async function getWeather({ cityName }) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${WeatherApiKey}&q=${cityName}&aqi=yes`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return {
      temperateInDegC: data.current.temp_c,
      humidity: data.current.humidity,
      condition: data.current.condition.text,
    };
  } catch (err) {
    return { error: "Error fetching weather" };
  }
}

// --- Function Declarations for Gemini ---
const weatherFunctionDescription = {
  name: "getWeather",
  description:
    "Retrieves the current weather conditions (temperature in Celsius, humidity, and a description) for a specified city.",
  parameters: {
    type: "object",
    properties: {
      cityName: {
        type: "string",
        description: "The name of the city (e.g., 'London', 'New York').",
      },
    },
    required: ["cityName"],
  },
};

const sumFunDeclaration = {
  name: "sum",
  description: "Get the sum of two numbers",
  parameters: {
    type: "object",
    properties: {
      num1: { type: "number", description: "The first number" },
      num2: { type: "number", description: "The second number" },
    },
    required: ["num1", "num2"],
  },
};


//------------------------------------------------------------------------------------------


// --- AI Config ---
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});





export async function POST(request) {
  const tools = { sum, getWeather };
  let cnt = 0;
  const { history } = await request.json();
  const History = history;

  while (1) {
    cnt++;
    if (cnt == 9) {
      return Response.json(
        { message: "Too many questions asked together !!" },
        { status: 400 }
      );
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: History,
      config: {
        systemInstruction:
          "Your name is Zyra , You are an Advance AI chat bot with some tools available to you , so for every user question if tools available then answer them from the tools other wise answer from your current knowledge if you can  ",
        tools: [
          {
            functionDeclarations: [
              sumFunDeclaration,
              weatherFunctionDescription,
            ],
          },
        ],
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate) {
      console.log("No candidates found.");
      break;
    }

    const parts = candidate.content.parts;

    let functionCalls = parts.filter((p) => p.functionCall);
    let textParts = parts.filter((p) => p.text);

    // --- Handle function calls ---
    if (functionCalls.length > 0) {
      for (const { functionCall } of functionCalls) {
        const { name, args } = functionCall;
        const func = tools[name];
        if (!func) continue;

        const result = await func(args);

        // Push call + response into history
        History.push({ role: "model", parts: [{ functionCall }] });
        History.push({
          role: "user",
          parts: [{ functionResponse: { name, response: { result } } }],
        });
      }
      continue;
    }

    // --- Handle text output ---
    if (textParts.length > 0) {
      const answer = textParts.map((p) => p.text).join("\n");
      console.log("Model:", answer);
      return Response.json({ message: answer }, { status: 200 });
    }
  }
}
