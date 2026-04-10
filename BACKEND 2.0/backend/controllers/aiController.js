import { GoogleGenAI } from "@google/genai";

let aiClient = null;

function getClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// ================= GENERATE AI TEXT =================
export const generateAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return res.status(400).json({ msg: "A valid prompt is required ❌" });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({ msg: "Prompt is too long (max 5000 chars) ❌" });
    }

    const ai = getClient();

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt.trim(),
    });

    const text = response.text;

    if (!text) {
      return res.status(500).json({ msg: "AI returned an empty response ❌" });
    }

    res.status(200).json({ text });
  } catch (error) {
    console.error("AI Generation Error:", error.message);

    // Handle API key errors
    if (error.message.includes("API_KEY") || error.message.includes("not set")) {
      return res.status(503).json({
        msg: "AI service is not configured. Please add GEMINI_API_KEY to the backend .env file ❌",
      });
    }

    // Handle quota errors
    if (error.message.includes("quota") || error.message.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({ msg: "AI quota exceeded. Please try again later ❌" });
    }

    res.status(500).json({ msg: "AI generation failed ❌", error: error.message });
  }
};
