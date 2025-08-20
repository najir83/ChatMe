import { GoogleGenAI } from "@google/genai";
import { getJson } from "serpapi";
const WeatherApiKey = process.env.WEATHER_API_KEY;

// --------------------------------------- Tools ---------------------------------------

function sum({ num1, num2 }) {
  return num1 + num2;
}

async function google_search({ question }) {
  try {
    return await new Promise((resolve, reject) => {
      getJson(
        {
          engine: "google",
          q: question,
          google_domain: "google.com",
          hl: "en",
          gl: "us",
          api_key: process.env.Search_API,
        },
        (json) => {
          if (!json || !json["organic_results"]) {
            reject("No results");
            return;
          }
          const answer = [];
          for (
            let i = 0;
            i < Math.min(json["organic_results"].length, 3);
            i++
          ) {
            answer.push({
              title: json["organic_results"][i].title,
              link: json["organic_results"][i].link,
              snippet: json["organic_results"][i].snippet,
            });
          }
          resolve(answer);
        }
      );
    });
  } catch (e) {
    console.error(e);
    return [{ title: "Error", snippet: "Error while fetching data." }];
  }
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

const SearchFunctionDescription = {
  name: "google_search",
  description:
    "Searches Google for a given query and returns the top 3 most relevant results. Each result includes the title, a brief snippet, and the link to the source. This tool is useful for answering questions that require up-to-date or specific information from the web.",
  parameters: {
    type: "object",
    properties: {
      question: {
        type: "string",
        description:
          "The search query to be used for the Google search. This should be a concise and specific question or phrase.",
      },
    },
    required: ["question"],
  },
};

//------------------------------------------------------------------------------------------

// --- AI Config ---
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  const tools = { sum, getWeather, google_search: google_search };
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
       systemInstruction: `You are Zyra, an advanced AI assistant.   
You can directly answer questions using your own knowledge when reasoning, problem-solving, or explanation is required.  
If the question requires up-to-date or external information (like future ,present,date , news, weather, or facts not in your memory), ALWAYS call the appropriate tool instead of guessing.  
When the tool provides links, include them clearly in your answer.`,
        tools: [
          {
            functionDeclarations: [
              sumFunDeclaration,
              weatherFunctionDescription,
              SearchFunctionDescription,
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
      // console.log("Model:", answer);
      return Response.json({ message: answer }, { status: 200 });
    }
  }
}
