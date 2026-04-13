// import { GoogleGenerativeAI } from "@google/generative-ai";

// let genAI = null;

// const getAIModel = (modelName = "gemini-2.0-flash" ) => {
//   if (!genAI) {
//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       throw new Error("GEMINI_API_KEY is not set in environment variables");
//     }
//     genAI = new GoogleGenerativeAI(apiKey);
//   }
//   return genAI.getGenerativeModel({ model: modelName });
// };

// const SYSTEM_PROMPT = `
// You are an expert financial advisor and AI CFO. Analyze the user's financial data and give clear, actionable, concise advice. 
// Always give practical suggestions like cost cutting, profit improvement, runway prediction, and risk alerts.
// `;

// /**
//  * Generate financial insights based on provided data
//  */
// export const generateFinancialInsights = async (financialData) => {
//   try {
//     const model = getAIModel();
//     const prompt = `
// ${SYSTEM_PROMPT}

// USER FINANCIAL DATA:
// ${JSON.stringify(financialData, null, 2)}

// Provide 3-5 key insights based on this data. Focus on immediate actions the user can take.
// Return the response in a clear, bulleted format.
// `;
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error("AI Service Error (Insights):", error);
//     throw error;
//   }
// };

// /**
//  * Chat with AI using financial context
//  */
// export const chatWithAI = async (message, financialData) => {
//   try {
//     const model = getAIModel();
//     const prompt = `
// ${SYSTEM_PROMPT}

// CONTEXTUAL FINANCIAL DATA:
// ${JSON.stringify(financialData || {}, null, 2)}

// USER MESSAGE:
// ${message}

// Respond to the user's message using the financial data as context if relevant. Keep it professional and helpful.
// `;
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error("AI Service Error (Chat):", error);
//     throw error;
//   }
// };

// /**
//  * Predict financial future (next 3 months)
//  */
// export const predictFinancials = async (financialData) => {
//   try {
//     const model = getAIModel();
//     const prompt = `
// ${SYSTEM_PROMPT}

// Act as an AI CFO. Based on the following financial data:
// ${JSON.stringify(financialData, null, 2)}

// Provide a prediction for:
// 1. Future balance for the next 3 months (month-by-month prediction).
// 2. Spending warnings (identify any negative trends or upcoming risks).
// 3. Savings suggestions (specific areas to cut costs or optimize).

// Format the output clearly.
// `;
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error("AI Service Error (Predict):", error);
//     throw error;
//   }
// };


// aiservice.ts (OpenRouter version)

// import dotenv from "dotenv";
// dotenv.config();

// let OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// if (!OPENROUTER_API_KEY) {
//   throw new Error("OPENROUTER_API_KEY is not set in environment variables");
// }

// const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// // You can change model if needed
// const MODEL = "meta-llama/llama-3.3-70b-instruct:free";

// const SYSTEM_PROMPT = `
// You are an expert financial advisor and AI CFO. Analyze the user's financial data and give clear, actionable, concise advice. 
// Always give practical suggestions like cost cutting, profit improvement, runway prediction, and risk alerts.
// `;

// // 🔥 Core function (replaces Gemini generateContent)
// const callAI = async (prompt) => {
//   const res = await fetch(OPENROUTER_URL, {
//     method: "POST",
//     headers: {
//       "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
//       "Content-Type": "application/json",
//       "HTTP-Referer": "http://localhost:3000", // optional but recommended
//       "X-Title": "MoneyForge AI"
//     },
//     body: JSON.stringify({
//       model: MODEL,
//       messages: [
//         { role: "system", content: SYSTEM_PROMPT },
//         { role: "user", content: prompt }
//       ]
//     })
//   });

//   if (!res.ok) {
//     const errorText = await res.text();
//     console.error("OpenRouter API Error:", errorText);
//     throw new Error("AI request failed");
//   }

//   const data = await res.json();

//   return data.choices?.[0]?.message?.content || "No response from AI";
// };

// /**
//  * Generate financial insights
//  */
// export const generateFinancialInsights = async (financialData) => {
//   try {
//     const prompt = `
// USER FINANCIAL DATA:
// ${JSON.stringify(financialData, null, 2)}

// Provide 3-5 key insights based on this data. Focus on immediate actions the user can take.
// Return the response in a clear, bulleted format.
// `;

//     return await callAI(prompt);
//   } catch (error) {
//     console.error("AI Service Error (Insights):", error);
//     throw error;
//   }
// };

// /**
//  * Chat with AI
//  */
// export const chatWithAI = async (message, financialData) => {
//   try {
//     const prompt = `
// CONTEXTUAL FINANCIAL DATA:
// ${JSON.stringify(financialData || {}, null, 2)}

// USER MESSAGE:
// ${message}

// Respond to the user's message using the financial data as context if relevant. Keep it professional and helpful.
// `;

//     return await callAI(prompt);
//   } catch (error) {
//     console.error("AI Service Error (Chat):", error);
//     throw error;
//   }
// };

// /**
//  * Predict financial future
//  */
// export const predictFinancials = async (financialData) => {
//   try {
//     const prompt = `
// Act as an AI CFO. Based on the following financial data:
// ${JSON.stringify(financialData, null, 2)}

// Provide a prediction for:
// 1. Future balance for the next 3 months (month-by-month prediction).
// 2. Spending warnings.
// 3. Savings suggestions.

// Format the output clearly.
// `;

//     return await callAI(prompt);
//   } catch (error) {
//     console.error("AI Service Error (Predict):", error);
//     throw error;
//   }
// };

import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not set in environment variables");
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Fallback list — if one fails, next is tried automatically
const MODELS = [
  "openrouter/free",
  "deepseek/deepseek-r1:free",
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free"
];

const SYSTEM_PROMPT = `
You are an expert financial advisor and AI CFO. Analyze the user's financial data and give clear, actionable, concise advice. 
Always give practical suggestions like cost cutting, profit improvement, runway prediction, and risk alerts.
`;

// Core function with automatic model fallback
const callAI = async (prompt, modelIndex = 0) => {
  if (modelIndex >= MODELS.length) {
    throw new Error("All AI models are currently unavailable. Please try again later.");
  }

  const MODEL = MODELS[modelIndex];
  console.log(`Using model: ${MODEL}`);

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "MoneyForge AI"
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ]
    })
  });

  // Auto-fallback on rate limit or model unavailable
  if (res.status === 429 || res.status === 404) {
    console.warn(`Model ${MODEL} unavailable (${res.status}), trying next...`);
    return callAI(prompt, modelIndex + 1);
  }

  if (!res.ok) {
    const errorText = await res.text();
    console.error("OpenRouter API Error:", errorText);

    // Also fallback on other provider errors
    if (modelIndex + 1 < MODELS.length) {
      console.warn(`Falling back to next model...`);
      return callAI(prompt, modelIndex + 1);
    }

    throw new Error("AI request failed");
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response from AI";
};

/**
 * Generate financial insights
 */
export const generateFinancialInsights = async (financialData) => {
  try {
    const prompt = `
USER FINANCIAL DATA:
${JSON.stringify(financialData, null, 2)}

Provide 3-5 key insights based on this data. Focus on immediate actions the user can take.
Return the response in a clear, bulleted format.
`;
    return await callAI(prompt);
  } catch (error) {
    console.error("AI Service Error (Insights):", error);
    throw error;
  }
};

/**
 * Chat with AI
 */
export const chatWithAI = async (message, financialData) => {
  try {
    const prompt = `
CONTEXTUAL FINANCIAL DATA:
${JSON.stringify(financialData || {}, null, 2)}

USER MESSAGE:
${message}

Respond to the user's message using the financial data as context if relevant. Keep it professional and helpful.
`;
    return await callAI(prompt);
  } catch (error) {
    console.error("AI Service Error (Chat):", error);
    throw error;
  }
};

/**
 * Predict financial future
 */
export const predictFinancials = async (financialData) => {
  try {
    const prompt = `
Act as an AI CFO. Based on the following financial data:
${JSON.stringify(financialData, null, 2)}

Provide a prediction for:
1. Future balance for the next 3 months (month-by-month prediction).
2. Spending warnings.
3. Savings suggestions.

Format the output clearly.
`;
    return await callAI(prompt);
  } catch (error) {
    console.error("AI Service Error (Predict):", error);
    throw error;
  }
};