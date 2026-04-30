import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Slider from "@/components/slider";
import DragnDrop from "@/components/drag-n-drop";
import { useFileUpload } from "@/hooks/use-file-upload";

const RootPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(2); // Default to 'Standard'
  const nav = useNavigate();
  const { loading, error, result, uploadFile } = useFileUpload();

  const handleUpload = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("power", quality.toString());

    await uploadFile(formData);
  };

  useEffect(() => {
    if (result) {
      nav(`/download/${result.data.jobId}`);
    }
  }, [result]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-right",
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        <form
          className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100"
          onSubmit={handleUpload}
        >
          <div className="text-center space-y-1">
            <h1 className="font-bold text-2xl text-gray-800">Optimize PDF</h1>
            <p className="text-gray-500 text-sm">
              Upload a file to begin compression
            </p>
          </div>

          <DragnDrop file={file} setFile={setFile} />

          <Slider quality={quality} setQuality={setQuality} />

          <button
            type="submit"
            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
            disabled={!file || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              "Compress and Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RootPage;
