import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { WebcamSettings } from "@/lib/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WebcamSettings;
  onSaveSettings: (settings: WebcamSettings) => void;
  devices: MediaDeviceInfo[];
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  devices
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<WebcamSettings>(settings);
  
  useEffect(() => {
    if (isOpen) {
      // Reset local settings when modal opens
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);
  
  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white dark:bg-gray-700 rounded-lg shadow-lg max-w-md w-full mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">Settings</DialogTitle>
        </DialogHeader>
        
        <div className="p-4">
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Camera Source
            </Label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={localSettings.cameraId}
              onChange={(e) => setLocalSettings({...localSettings, cameraId: e.target.value})}
            >
              <option value="">Default Camera</option>
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId.substring(0, 5)}...`}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Processing Interval
            </Label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="500" 
                max="3000" 
                step="100" 
                value={localSettings.processingInterval}
                onChange={(e) => setLocalSettings({
                  ...localSettings, 
                  processingInterval: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {localSettings.processingInterval / 1000}s
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Longer intervals use less API credits but have slower response
            </p>
          </div>
          
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confidence Threshold
            </Label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5" 
                value={localSettings.confidenceThreshold}
                onChange={(e) => setLocalSettings({
                  ...localSettings, 
                  confidenceThreshold: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {localSettings.confidenceThreshold}%
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Lower values show more results but may include errors
            </p>
          </div>
          
          <div className="mb-4">
            <Label className="flex items-center">
              <Checkbox 
                checked={localSettings.continuousMode}
                onCheckedChange={(checked) => setLocalSettings({
                  ...localSettings, 
                  continuousMode: checked === true
                })}
                className="rounded text-primary-500 focus:ring-primary-500 h-4 w-4 dark:bg-gray-800 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Continuous interpretation mode
              </span>
            </Label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
              Keep interpreting while camera is on
            </p>
          </div>
          
          <div>
            <Label className="flex items-center">
              <Checkbox
                checked={localSettings.audioFeedback}
                onCheckedChange={(checked) => setLocalSettings({
                  ...localSettings, 
                  audioFeedback: checked === true
                })}
                className="rounded text-primary-500 focus:ring-primary-500 h-4 w-4 dark:bg-gray-800 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Audio feedback for new interpretations
              </span>
            </Label>
          </div>
        </div>
        
        <DialogFooter className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
          <Button 
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
