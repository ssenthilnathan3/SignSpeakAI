import { Interpretation } from "@shared/schema";

export interface InterpretationResult extends Interpretation {
  displayTime: string;
}

export interface WebcamSettings {
  cameraId: string;
  processingInterval: number;
  confidenceThreshold: number;
  continuousMode: boolean;
  audioFeedback: boolean;
}

export enum ConfidenceLevel {
  HIGH = "High confidence",
  MEDIUM = "Medium confidence",
  LOW = "Low confidence"
}

export const getConfidenceLevel = (confidence: number): ConfidenceLevel => {
  if (confidence >= 80) {
    return ConfidenceLevel.HIGH;
  } else if (confidence >= 50) {
    return ConfidenceLevel.MEDIUM;
  } else {
    return ConfidenceLevel.LOW;
  }
};

export const getConfidenceLevelClass = (level: ConfidenceLevel): string => {
  switch (level) {
    case ConfidenceLevel.HIGH:
      return "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300";
    case ConfidenceLevel.MEDIUM:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300";
    case ConfidenceLevel.LOW:
      return "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300";
  }
};

export type WebcamStatus = "inactive" | "active" | "processing" | "error";

export interface WebcamState {
  isActive: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  status: WebcamStatus;
  statusMessage: string;
}
