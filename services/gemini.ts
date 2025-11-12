import { GoogleGenAI } from '@google/genai';

export const getMarketSummary = async (): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: 'Act as a financial news web scraper. Provide a brief, 2-3 sentence summary of today\'s market sentiment based on the latest news from fictional sources. Mention key sectors and overall market mood (e.g., bullish, bearish, mixed).',
        });
        return response.text;
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        throw new Error(`Failed to get market summary: ${error.message}`);
    }
};
