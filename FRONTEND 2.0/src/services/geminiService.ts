import api from "./api";

/**
 * Helper function to generate content using the backend AI route.
 */
export async function generateText(prompt: string) {
  try {
    const response = await api.post("/api/ai/generate", { prompt });
    return response.data.text;
  } catch (error: any) {
    console.error("Error generating content via backend:", error);
    // Graceful fallback or error propagation
    throw new Error(error.response?.data?.msg || "AI Generation failed ❌");
  }
}

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
    
    Rules:
    1. If the user says "sequence" or implies multiple emails, set isSequence to true and generate at least 3 steps.
    2. If the user says "single email", set isSequence to false.
    3. For each email, provide a "purpose" (e.g., "Introduction", "Value Prop Follow-up", "Social Proof", "Final Break-up").
    4. If no timing is provided, default to Day 1, Day 3, and Day 7 for sequences.
    5. Generate "scheduledTime" as a human-readable string (e.g., "Tomorrow at 9:00 AM", "In 3 days at 10:00 AM").
    6. Ensure the body is HTML formatted and highly personalized to the active idea.
    
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
