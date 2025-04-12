import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { geminiRequestSchema } from "@shared/schema";
import { interpretSignLanguage } from "./lib/gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint to interpret sign language
  app.post("/api/interpret", async (req, res) => {
    try {
      const validationResult = geminiRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid request format", error: validationResult.error });
      }
      
      const { imageData } = validationResult.data;
      
      const interpretation = await interpretSignLanguage(imageData);
      
      return res.status(200).json(interpretation);
    } catch (error: any) {
      console.error("Error interpreting sign language:", error);
      return res.status(500).json({ message: "Failed to interpret sign language", error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
