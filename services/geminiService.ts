
import { GoogleGenAI, Type } from "@google/genai";
import type { Item } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getRecommendedItems = async (
  userInterests: string,
  allItems: Item[]
): Promise<number[]> => {
  if (!API_KEY) {
    return [];
  }

  const availableItems = allItems
    .filter((item) => item.status === 'available')
    .map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      tags: item.tags.join(', '),
      price: item.price,
    }));

  if (availableItems.length === 0) {
    return [];
  }

  const prompt = `
    Based on the following user interests, recommend items from the list provided.
    User Interests: "${userInterests}"

    Available Items:
    ${JSON.stringify(availableItems, null, 2)}

    Analyze the user's interests and the item details (name, description, tags). 
    Return a JSON array of the top 5 most relevant item IDs, ordered from most to least relevant.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommended_ids: {
              type: Type.ARRAY,
              items: {
                type: Type.NUMBER,
              },
            },
          },
        },
      },
    });
    
    const jsonText = response.text;
    const result = JSON.parse(jsonText);

    if (result && Array.isArray(result.recommended_ids)) {
      return result.recommended_ids;
    }
    return [];
  } catch (error) {
    console.error("Error fetching recommendations from Gemini:", error);
    return [];
  }
};
