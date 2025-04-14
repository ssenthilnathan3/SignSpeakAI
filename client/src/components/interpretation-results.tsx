import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { InterpretationResult, getConfidenceLevel, getConfidenceLevelClass } from "@/lib/types";

interface InterpretationResultsProps {
  interpretations: InterpretationResult[];
  apiStatus: "ready" | "processing" | "error";
  onClearResults: () => void;
  onCopyText: (text: string) => void;
}

export default function InterpretationResults({
  interpretations,
  apiStatus,
  onClearResults,
  onCopyText
}: InterpretationResultsProps) {
  const apiStatusText = useMemo(() => {
    switch (apiStatus) {
      case "processing":
        return "Processing";
      case "error":
        return "Error";
      default:
        return "Ready";
    }
  }, [apiStatus]);

  const apiStatusClass = useMemo(() => {
    switch (apiStatus) {
      case "processing":
        return "text-yellow-600 dark:text-yellow-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-green-600 dark:text-green-400";
    }
  }, [apiStatus]);

  return (
    <div className="lg:col-span-2">
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <span className="material-icons mr-2">translate</span>
            Interpretation
          </h2>
        </div>
        
        <CardContent className="p-4 flex-grow overflow-y-auto">
          {interpretations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
              <span className="material-icons text-4xl mb-3">sign_language</span>
              <p className="text-lg">No ASL interpretation yet</p>
              <p className="text-sm mt-1">American Sign Language will be interpreted into complete sentences as you sign</p>
              <p className="text-sm mt-2 italic">Best for standard ASL signs and basic sentences</p>
            </div>
          ) : (
            <div>
              {interpretations.map((item) => (
                <div key={item.id} className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-600 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <p className="text-gray-900 dark:text-white text-base leading-relaxed">{item.text}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{item.displayTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${getConfidenceLevelClass(getConfidenceLevel(item.confidence))} px-2 py-0.5 rounded`}>
                      {getConfidenceLevel(item.confidence)}
                    </span>
                    <div className="flex space-x-2">
                      <button 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center"
                        onClick={() => onCopyText(item.text)}
                      >
                        <span className="material-icons text-sm mr-1">content_copy</span>
                        <span className="text-xs">Copy</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="material-icons text-primary-500 mr-2">api</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">API Status:</span>
              <span className={`ml-1 text-sm font-medium ${apiStatusClass}`}>
                {apiStatusText}
              </span>
            </div>
            
            <button 
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm flex items-center"
              onClick={onClearResults}
            >
              <span className="material-icons text-sm mr-1">delete</span>
              Clear
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
