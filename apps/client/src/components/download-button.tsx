import { useFileDownload } from "@/hooks/use-file-download";
import { Download } from "lucide-react";
import React, { useEffect, type ComponentProps } from "react";
import toast from "react-hot-toast";

interface ButtonProps extends ComponentProps<"button"> {
  readonly fileId: string;
  readonly fileName: string;
}

const DownloadButton: React.FC<ButtonProps> = ({ fileId, fileName }) => {
  const { triggerDownload, loading, error } = useFileDownload();

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-right",
      });
    }
  }, [error]);

  return (
    <button
      className="w-full flex items-center justify-center gap-3 py-4 bg-gray-900 text-white rounded-xl font-bold text-sm transition-all transform hover:bg-black hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-gray-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      onClick={() => triggerDownload(fileId, fileName)}
      disabled={loading}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <Download size={18} />
          <span>Download PDF File</span>
        </>
      )}
    </button>
  );
};

export default DownloadButton;
