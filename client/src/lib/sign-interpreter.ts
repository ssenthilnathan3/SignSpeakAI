import { apiRequest } from "@/lib/queryClient";
import { GeminiRequest, GeminiResponse, InterpretationResult } from "@/lib/types";
import { format } from "date-fns";

export async function interpretSignLanguage(imageData: string): Promise<GeminiResponse> {
  try {
    const response = await apiRequest(
      "POST",
      "/api/interpret",
      { imageData }
    );
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error interpreting sign language:", error);
    throw error;
  }
}

export function formatInterpretation(
  result: GeminiResponse
): InterpretationResult {
  return {
    id: Date.now(),
    text: result.text,
    confidence: result.confidence,
    timestamp: new Date(),
    displayTime: format(new Date(), "h:mm a"),
    userId: null
  };
}

export function playAudioFeedback() {
  const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFzb25pY0NvbXBsZXguY29tAFRYWFgAAAASAAADTGF2ZjU4Ljc2LjEwMABURU5DAAAAHQAAA0VuY29kZWQgYnkATGF2YzU4LjEzNA==');
  audio.volume = 0.5;
  audio.play().catch(e => console.log("Audio feedback error:", e));
}
