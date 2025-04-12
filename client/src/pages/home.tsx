import { useState } from "react";
import DarkModeToggle from "@/components/dark-mode-toggle";
import VideoFeed from "@/components/video-feed";
import InterpretationResults from "@/components/interpretation-results";
import SettingsModal from "@/components/settings-modal";
import { useWebcam } from "@/hooks/use-webcam";
import { useSignInterpreter } from "@/hooks/use-sign-interpreter";
import { WebcamSettings } from "@/lib/types";

export default function Home() {
  // Settings state
  const [settings, setSettings] = useState<WebcamSettings>({
    cameraId: "",
    processingInterval: 1000,
    confidenceThreshold: 70,
    continuousMode: true,
    audioFeedback: true
  });
  
  // Settings modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Webcam hook
  const {
    videoRef,
    state,
    devices,
    toggleWebcam,
    captureFrame,
    updateState
  } = useWebcam(settings);
  
  // Sign interpreter hook
  const {
    interpretations,
    isInterpreting,
    apiStatus,
    processFrame,
    clearResults,
    copyToClipboard
  } = useSignInterpreter(
    captureFrame,
    state.isActive,
    settings,
    () => updateState(state.isActive, true, state.hasError, state.errorMessage),
    () => updateState(state.isActive, false, state.hasError, state.errorMessage)
  );
  
  // Handle settings change
  const handleSaveSettings = (newSettings: WebcamSettings) => {
    setSettings(newSettings);
  };
  
  return (
    <div className="bg-gray-50 transition-colors duration-200 dark:bg-gray-800 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="material-icons mr-2">sign_language</span>
              Sign Language Interpreter
            </h1>
            <DarkModeToggle />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Powered by Gemini API</p>
        </header>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <VideoFeed
            videoRef={videoRef}
            state={state}
            onToggleCamera={toggleWebcam}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
          
          <InterpretationResults
            interpretations={interpretations}
            apiStatus={apiStatus}
            onClearResults={clearResults}
            onCopyText={copyToClipboard}
          />
        </div>
        
        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSaveSettings={handleSaveSettings}
          devices={devices}
        />
        
        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Sign Language Interpreter v1.0</p>
          <p className="mt-1">Built with React, TypeScript and Gemini API</p>
        </footer>
      </div>
    </div>
  );
}
