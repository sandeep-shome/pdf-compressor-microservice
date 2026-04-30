import { AlertCircle, RefreshCw } from "lucide-react";
import React from "react";
import { Link } from "react-router";

interface ProcessErrorDialogueProps {
  error: string | null;
}

const ProcessErrorDialogue: React.FC<ProcessErrorDialogueProps> = ({
  error,
}) => {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-red-100/50 border border-red-50 overflow-hidden">
      <div className="p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="font-bold text-2xl text-gray-800">Transfer Failed</h1>
          <p className="text-sm text-gray-500 leading-relaxed italic px-4">
            "{error}"
          </p>
        </div>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all transform hover:-translate-y-0.5"
        >
          <RefreshCw size={18} />
          Try Again
        </Link>
      </div>
    </div>
  );
};

export default ProcessErrorDialogue;
