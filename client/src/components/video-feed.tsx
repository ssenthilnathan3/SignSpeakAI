import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WebcamState } from "@/lib/types";

interface VideoFeedProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  state: WebcamState;
  onToggleCamera: () => void;
  onOpenSettings: () => void;
}

export default function VideoFeed({
  videoRef,
  state,
  onToggleCamera,
  onOpenSettings
}: VideoFeedProps) {
  const { isActive, isLoading, hasError, errorMessage, status, statusMessage } = state;
  
  const getStatusBadgeClass = () => {
    switch (status) {
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300";
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300";
      default:
        return "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200";
    }
  };
  
  return (
    <div className="lg:col-span-3">
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <span className="material-icons mr-2">videocam</span>
            Video Feed
          </h2>
        </div>
        
        <CardContent className="p-4">
          <div className="webcam-container bg-gray-100 dark:bg-gray-800 rounded-lg aspect-video relative">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            
            {/* Inactive overlay */}
            {!isActive && !hasError && (
              <div className="webcam-overlay bg-gray-800/70 absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <span className="material-icons text-4xl mb-2">videocam_off</span>
                  <p className="text-lg font-medium">Camera is off</p>
                  <p className="text-sm text-gray-300 mt-1">Click start to begin interpretation</p>
                </div>
              </div>
            )}
            
            {/* Loading overlay */}
            {isLoading && !hasError && (
              <div className="webcam-overlay bg-gray-800/50 absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="dot-pulse relative left-[-9999px] w-[10px] h-[10px] rounded-[5px] bg-blue-500 text-blue-500 mb-3 before:content-[''] before:inline-block before:absolute before:top-0 before:w-[10px] before:h-[10px] before:rounded-[5px] before:bg-blue-500 before:text-blue-500 after:content-[''] after:inline-block after:absolute after:top-0 after:w-[10px] after:h-[10px] after:rounded-[5px] after:bg-blue-500 after:text-blue-500"></div>
                  <p className="text-base font-medium">Processing...</p>
                </div>
              </div>
            )}
            
            {/* Error overlay */}
            {hasError && (
              <div className="webcam-overlay bg-red-800/50 absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <span className="material-icons text-4xl mb-2">error_outline</span>
                  <p className="text-lg font-medium">Camera error</p>
                  <p className="text-sm mt-1">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Video Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <span 
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass()}`}
              >
                {status === "error" ? "Error" : status === "processing" ? "Processing" : status === "active" ? "Active" : "Inactive"}
              </span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {statusMessage}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button 
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={onOpenSettings}
              >
                <span className="material-icons">settings</span>
              </button>
              
              <button 
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center"
                onClick={onToggleCamera}
              >
                <span className="material-icons mr-1">{isActive ? "stop" : "play_arrow"}</span>
                <span>{isActive ? "Stop" : "Start"}</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
