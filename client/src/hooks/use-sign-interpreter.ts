import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { interpretSignLanguage, formatInterpretation, playAudioFeedback } from "@/lib/sign-interpreter";
import { WebcamSettings, InterpretationResult } from "@/lib/types";

export function useSignInterpreter(
  captureFrame: () => string | null,
  isActive: boolean,
  settings: WebcamSettings,
  onProcessingStart: () => void,
  onProcessingEnd: () => void
) {
  const [interpretations, setInterpretations] = useState<InterpretationResult[]>([]);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [apiStatus, setApiStatus] = useState<"ready" | "processing" | "error">("ready");
  const processingTimerRef = useRef<number | null>(null);
  const { toast } = useToast();

  const clearResults = useCallback(() => {
    setInterpretations([]);
  }, []);

  const processFrame = useCallback(async () => {
    if (!isActive || isInterpreting) return;
    
    const imageData = captureFrame();
    if (!imageData) return;
    
    try {
      setIsInterpreting(true);
      setApiStatus("processing");
      onProcessingStart();
      
      const result = await interpretSignLanguage(imageData);
      
      // Check if interpretation meets confidence threshold
      if (result.confidence >= settings.confidenceThreshold) {
        const newInterpretation = formatInterpretation(result);
        
        setInterpretations(prev => [newInterpretation, ...prev]);
        
        if (settings.audioFeedback) {
          playAudioFeedback();
        }
      }
      
      setApiStatus("ready");
    } catch (error) {
      console.error("Error interpreting sign language:", error);
      setApiStatus("error");
      
      toast({
        title: "Interpretation Error",
        description: "Failed to interpret sign language. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInterpreting(false);
      onProcessingEnd();
    }
  }, [
    isActive,
    isInterpreting,
    captureFrame,
    settings.confidenceThreshold,
    settings.audioFeedback,
    onProcessingStart,
    onProcessingEnd,
    toast
  ]);

  // Handle continuous mode
  useEffect(() => {
    if (isActive && settings.continuousMode && !processingTimerRef.current) {
      processingTimerRef.current = window.setInterval(() => {
        processFrame();
      }, settings.processingInterval);
    }
    
    return () => {
      if (processingTimerRef.current) {
        window.clearInterval(processingTimerRef.current);
        processingTimerRef.current = null;
      }
    };
  }, [isActive, settings.continuousMode, settings.processingInterval, processFrame]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Text copied to clipboard",
        });
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        toast({
          title: "Copy failed",
          description: "Could not copy text to clipboard",
          variant: "destructive"
        });
      });
  }, [toast]);

  return {
    interpretations,
    isInterpreting,
    apiStatus,
    processFrame,
    clearResults,
    copyToClipboard
  };
}
