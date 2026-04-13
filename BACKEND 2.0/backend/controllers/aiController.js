import * as aiService from "../services/aiService.js";

/**
 * Handle AI Chat
 */
export const chatAI = async (req, res) => {
  try {
    const { message, financialData } = req.body;

    if (!message) {
      return res.status(400).json({ msg: "Message is required ❌" });
    }

    const reply = await aiService.chatWithAI(message, financialData);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("AI Controller Error (Chat):", error.message);
    
    if (error.message.includes("API_KEY")) {
      return res.status(503).json({ msg: "Gemini API key is not configured ❌" });
    }

    if (error.message.includes("429") || error.message.includes("quota")) {
      return res.status(429).json({ msg: "AI quota exceeded. Try again later ❌" });
    }

    res.status(500).json({ msg: "AI chat failed ❌", error: error.message });
  }
};

/**
 * Handle AI Insights
 */
export const getInsights = async (req, res) => {
  try {
    const { financialData } = req.body;

    if (!financialData) {
      return res.status(400).json({ msg: "Financial data is required ❌" });
    }

    const insights = await aiService.generateFinancialInsights(financialData);

    res.status(200).json({ insights });
  } catch (error) {
    console.error("AI Controller Error (Insights):", error.message);
    res.status(500).json({ msg: "Failed to generate insights ❌", error: error.message });
  }
};

/**
 * Handle AI Predictions
 */
export const getPredictions = async (req, res) => {
  try {
    const { financialData } = req.body;

    if (!financialData) {
      return res.status(400).json({ msg: "Financial data is required ❌" });
    }

    const prediction = await aiService.predictFinancials(financialData);

    res.status(200).json({ prediction });
  } catch (error) {
    console.error("AI Controller Error (Predictions):", error.message);
    res.status(500).json({ msg: "Failed to generate predictions ❌", error: error.message });
  }
};

/**
 * Legacy generateAI for backward compatibility (optional but safe to keep/redirect)
 */
export const generateAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ msg: "Prompt is required" });
    
    // Using chat logic as a fallback for general prompt generation
    const text = await aiService.chatWithAI(prompt, null);
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ msg: "AI Generation failed", error: error.message });
  }
};
