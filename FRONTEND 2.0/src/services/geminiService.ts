import api from "./api";

/**
 * Helper function to generate generic content via backend.
 */
export async function generateText(prompt: string) {
  try {
    const response = await api.post("/api/ai/generate", { prompt });
    return response.data.text;
  } catch (error: any) {
    console.error("Error generating content via backend:", error);
    throw new Error(error.response?.data?.msg || "AI Generation failed ❌");
  }
}

/**
 * Chat with the AI via the backend chat route.
 */
export async function chatWithAI(message: string, financialData?: any) {
  try {
    const response = await api.post("/api/ai/chat", { message, financialData });
    return response.data; // Returns { reply: "..." }
  } catch (error: any) {
    console.error("Error chatting with AI via backend:", error);
    throw new Error(error.response?.data?.msg || "AI Chat failed ❌");
  }
}

/**
 * Get financial insights via backend.
 */
export async function getFinancialInsights(financialData: any) {
  try {
    const response = await api.post("/api/ai/insights", { financialData });
    return response.data.insights;
  } catch (error: any) {
    console.error("Error getting insights:", error);
    throw new Error(error.response?.data?.msg || "Failed to get insights ❌");
  }
}

/**
 * Get financial predictions via backend.
 */
export async function getFinancialPredictions(financialData: any) {
  try {
    const response = await api.post("/api/ai/predict", { financialData });
    return response.data.prediction;
  } catch (error: any) {
    console.error("Error getting predictions:", error);
    throw new Error(error.response?.data?.msg || "Failed to get predictions ❌");
  }
}

// ... rest of the file (email, logo, ad campaign functions) remains the same but uses the updated generateText
export interface EmailStep {
  day: number;
  subject: string;
  body: string;
  purpose: string;
  scheduledTime: string;
}

export interface EmailIntent {
  recipient: string;
  subject: string;
  body: string;
  purpose: string;
  scheduledTime?: string;
  isSequence: boolean;
  sequenceSteps?: EmailStep[];
}

export async function generateEmailIntent(userPrompt: string, activeIdea: any): Promise<EmailIntent> {
  const prompt = `
    You are an AI Email Agent for a startup called "${activeIdea.title}".
    Context: ${activeIdea.description}
    Problem: ${activeIdea.problem}
    
    User Intent: "${userPrompt}"
    
    Based on the user intent and the startup context, generate a professional email or email sequence.
    
    Return ONLY a JSON object in the following format:
    {
      "recipient": "email or name (if provided, else 'Potential Lead')",
      "subject": "Compelling subject line",
      "body": "HTML formatted email body",
      "purpose": "Primary goal of this email",
      "scheduledTime": "Suggested time to send",
      "isSequence": boolean,
      "sequenceSteps": [
        { "day": number, "subject": "step subject", "body": "step body", "purpose": "step purpose", "scheduledTime": "step scheduled time" }
      ]
    }
  `;

  const text = await generateText(prompt);
  if (!text) throw new Error("Failed to generate email intent");
  
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export interface LogoConcept {
  id: string;
  name: string;
  style: string;
  description: string;
  colorPalette: { name: string; hex: string }[];
  fontPairing: { heading: string; body: string };
  visualMetaphor: string;
  canvaTemplateId?: string;
}

export async function generateLogoConcepts(userPrompt: string, activeIdea: any): Promise<LogoConcept[]> {
  const prompt = `
    You are a Brand Identity Designer for a startup called "${activeIdea.title}".
    Context: ${activeIdea.description}
    Niche: ${activeIdea.niche || "General"}
    
    User Input: "${userPrompt}"
    
    Generate 3 distinct logo concepts and brand identity suggestions.
    
    Return ONLY a JSON array of objects in the following format:
    [
      {
        "id": "unique-id",
        "name": "Concept Name",
        "style": "Minimal/Modern/Bold/Luxury/Tech/etc.",
        "description": "Detailed visual description",
        "colorPalette": [
          { "name": "Primary", "hex": "#HEX" },
          { "name": "Secondary", "hex": "#HEX" },
          { "name": "Accent", "hex": "#HEX" }
        ],
        "fontPairing": { "heading": "Font Name", "body": "Font Name" },
        "visualMetaphor": "The core visual idea (e.g., 'A rising sun integrated with a circuit board')",
        "canvaTemplateId": "A mock Canva template ID (e.g., 'DAE-XXXXXX')"
      }
    ]
  `;

  const text = await generateText(prompt);
  if (!text) throw new Error("Failed to generate logo concepts");
  
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export interface AdCampaign {
  strategy: {
    objective: string;
    targetAudience: string;
    platforms: string[];
    funnelStrategy: string;
  };
  assets: {
    copies: { format: string; text: string }[];
    headlines: string[];
    ctas: string[];
    creativeIdeas: string[];
    platformVariations: Record<string, any>;
  };
  structure: {
    hierarchy: string;
    segmentation: string[];
    abTests: string[];
  };
  budget: {
    total: string;
    daily: string;
    distribution: Record<string, string>;
  };
  scheduling: {
    startDate: string;
    optimization: string;
    retargeting: string;
  };
}

export async function generateAdCampaign(userPrompt: string, activeIdea: any): Promise<AdCampaign> {
  const prompt = `
    You are an AI Ad Campaign Strategist for a startup called "${activeIdea.title}".
    Context: ${activeIdea.description}
    Problem: ${activeIdea.problem}
    
    User Intent: "${userPrompt}"
    
    Based on the user intent and the startup context, generate a complete, multi-platform ad campaign system.
    
    Return ONLY a JSON object in the following format:
    {
      "strategy": {
        "objective": "string",
        "targetAudience": "string",
        "platforms": ["string"],
        "funnelStrategy": "string"
      },
      "assets": {
        "copies": [{ "format": "short/long", "text": "string" }],
        "headlines": ["string"],
        "ctas": ["string"],
        "creativeIdeas": ["string"],
        "platformVariations": {}
      },
      "structure": {
        "hierarchy": "string",
        "segmentation": ["string"],
        "abTests": ["string"]
      },
      "budget": {
        "total": "string",
        "daily": "string",
        "distribution": {}
      },
      "scheduling": {
        "startDate": "string",
        "optimization": "string",
        "retargeting": "string"
      }
    }
  `;

  const text = await generateText(prompt);
  if (!text) throw new Error("Failed to generate ad campaign");
  
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}
