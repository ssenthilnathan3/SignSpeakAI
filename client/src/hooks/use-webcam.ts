import { useState, useRef, useCallback, useEffect } from "react";
import { WebcamState, WebcamSettings } from "@/lib/types";

export function useWebcam(settings: WebcamSettings) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  
  const [state, setState] = useState<WebcamState>({
    isActive: false,
    isLoading: false,
    hasError: false,
    errorMessage: "",
    status: "inactive",
    statusMessage: "Camera is ready"
  });

  const getStatusInfo = useCallback((
    isActive: boolean, 
    isLoading: boolean, 
    hasError: boolean, 
    errorMessage: string
  ): { status: WebcamState["status"], statusMessage: string } => {
    if (hasError) {
      return { 
        status: "error", 
        statusMessage: errorMessage || "Unknown error occurred" 
      };
    } 
    
    if (isLoading) {
      return { 
        status: "processing", 
        statusMessage: "Analyzing sign language" 
      };
    } 
    
    if (isActive) {
      return { 
        status: "active", 
        statusMessage: "Ready to interpret" 
      };
    } 
    
    return { 
      status: "inactive", 
      statusMessage: "Camera is ready" 
    };
  }, []);

  const updateState = useCallback((
    isActive: boolean,
    isLoading: boolean,
    hasError: boolean,
    errorMessage: string
  ) => {
    const { status, statusMessage } = getStatusInfo(isActive, isLoading, hasError, errorMessage);
    
    setState({
      isActive,
      isLoading,
      hasError,
      errorMessage,
      status,
      statusMessage
    });
  }, [getStatusInfo]);

  // Get available camera devices
  const getVideoDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      setDevices(videoDevices);
    } catch (error) {
      console.error("Error getting video devices:", error);
    }
  }, []);

  // Start webcam
  const startWebcam = useCallback(async () => {
    try {
      updateState(true, true, false, "");
      
      const constraints: MediaStreamConstraints = {
        video: settings.cameraId ? { deviceId: { exact: settings.cameraId } } : true,
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
      }
      
      updateState(true, false, false, "");
    } catch (error: any) {
      stopWebcam();
      updateState(false, false, true, error.message || "Failed to access camera");
      console.error("Error accessing webcam:", error);
    }
  }, [settings.cameraId, updateState]);

  // Stop webcam
  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    updateState(false, false, false, "");
  }, [updateState]);

  // Toggle webcam
  const toggleWebcam = useCallback(() => {
    if (state.isActive) {
      stopWebcam();
    } else {
      startWebcam();
    }
  }, [state.isActive, startWebcam, stopWebcam]);

  // Capture frame from webcam
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !state.isActive) return null;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Return base64 encoded image data
    return canvas.toDataURL("image/jpeg", 0.8).split(',')[1];
  }, [state.isActive]);

  // Clean up on unmount
  useEffect(() => {
    getVideoDevices();
    
    return () => {
      stopWebcam();
    };
  }, [getVideoDevices, stopWebcam]);

  return {
    videoRef,
    state,
    devices,
    toggleWebcam,
    startWebcam,
    stopWebcam,
    captureFrame,
    updateState
  };
}
