
import { GoogleGenAI } from "@google/genai";
import { Match } from "../types";

export const getMatchInsight = async (match: Match): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const prompt = `
      Act as a professional sports analyst. 
      Analyze the following match and provide a short, high-energy betting insight (2-3 sentences):
      Match: ${match.homeTeam} vs ${match.awayTeam} (${match.league})
      Current Score: ${match.score ? `${match.score.home}-${match.score.away}` : 'N/A'}
      Current Odds: ${match.homeTeam} (${match.odds.homeWin}), ${match.odds.draw ? 'Draw (' + match.odds.draw + '),' : ''} ${match.awayTeam} (${match.odds.awayWin})
      Include a "Smart Tip" at the end.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 200,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Unable to fetch insight at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI analyst is currently unavailable. Trust your gut for this one!";
  }
};
