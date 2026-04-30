import React from "react";
import { HashLoader } from "react-spinners";

interface ProcessingDialogueProps {
  status: FileStatus;
}

const ProcessingDialogue: React.FC<ProcessingDialogueProps> = ({ status }) => {
  return (
    <div className="p-8 md:p-12 text-center space-y-8">
      <div className="space-y-2">
        <h1 className="font-bold text-2xl text-gray-800 tracking-tight">
          Processing your PDF
        </h1>
        <p className="text-gray-500 text-sm">
          Our workers are shrinking your file. This won't take long.
        </p>
      </div>

      <div className="py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-6">
        <HashLoader size={50} color="#111827" />
        <div className="space-y-1">
          <p className="text-gray-900 font-bold uppercase tracking-widest text-[10px]">
            Current Status
          </p>
          <p className="text-blue-600 font-black text-xl capitalize animate-pulse">
            {status}...
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400">Please do not refresh this page</p>
    </div>
  );
};

export default ProcessingDialogue;
