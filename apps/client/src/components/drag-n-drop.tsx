import { formatSize } from "@/lib/utils";
import { FileText } from "lucide-react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

interface DragnDropProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const DragnDrop: React.FC<DragnDropProps> = ({ file, setFile }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  // Drag and Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      toast.error("Please drop a valid PDF file");
    }
  };
  return (
    <>
      <input
        type="file"
        accept="application/pdf"
        hidden
        ref={inputRef}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative group
            ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
            ${file ? "border-green-400 bg-green-50" : ""}`}
      >
        <FileText
          className={`transition-colors mb-3 ${file ? "text-green-500" : "text-gray-300 group-hover:text-gray-400"}`}
          size={48}
        />
        <div className="text-center px-6">
          {file ? (
            <p className="text-green-700 font-semibold truncate w-75">
              {file.name}
            </p>
          ) : (
            <p className="text-gray-500 font-medium">Click to browse or </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {file ? formatSize(file.size) : "PDF files only (Max 50MB)"}
          </p>
        </div>
      </div>
    </>
  );
};

export default DragnDrop;
