import { GeminiResponse } from "@shared/schema";

// This function calls Gemini API to interpret sign language
export async function interpretSignLanguage(
  imageData: string,
): Promise<GeminiResponse> {
  try {
    const apiKey = "AIzaSyB-1L9DKa3O8Pr0am7VLQp0oyukH5A4fro";

    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Interpret the American Sign Language (ASL) in this image. Focus on recognizing complete sentences and basic, standard ASL signs. If multiple signs are detected, connect them into a coherent sentence with proper grammar. Respond with ONLY a valid JSON object with these fields: 'text' (the full interpreted sentence) and 'confidence' (a number from 0-100 indicating the confidence level). Do not include any other text or explanation.",
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageData,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 800,
            topP: 0.8,
            topK: 40,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorData}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content;

    if (!content) {
      throw new Error("No content returned from Gemini API");
    }

    // Extract JSON from the response
    const textResponse = content.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error("No text content in Gemini response");
    }

    // Try to extract JSON from the response text
    try {
      // Clean the text in case it contains markdown code blocks
      const jsonMatch =
        textResponse.match(/```json\s*(\{.*?\})\s*```/s) ||
        textResponse.match(/\{.*\}/s);

      const jsonString = jsonMatch
        ? jsonMatch[1] || jsonMatch[0]
        : textResponse;
      const parsedResponse = JSON.parse(jsonString);

      // Ensure the required fields are present
      if (
        typeof parsedResponse.text !== "string" ||
        typeof parsedResponse.confidence !== "number"
      ) {
        throw new Error("Invalid response format from Gemini API");
      }

      return {
        text: parsedResponse.text,
        confidence: parsedResponse.confidence,
      };
    } catch (parseError) {
      console.error(
        "Failed to parse Gemini response:",
        parseError,
        "Raw response:",
        textResponse,
      );

      // Fallback: create a best-effort response
      return {
        text: "Could not interpret sign language clearly",
        confidence: 30,
      };
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
