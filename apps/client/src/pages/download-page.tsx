import DownloadCard from "@/components/download-card";
import ProcessErrorDialogue from "@/components/process-error-dialogue";
import ProcessingDialogue from "@/components/processing-dialogue";
import { useFileStatus } from "@/hooks/use-file-status";
import { useGetFileMeta } from "@/hooks/use-get-file-meta";
import React, { useEffect } from "react";
import { useParams } from "react-router";

const DownloadPage: React.FC = () => {
  const { status, error, checkStatus } = useFileStatus();
  const {
    loading,
    fileMeta,
    error: getFileMetaError,
    getFileMeta,
  } = useGetFileMeta();

  const { id } = useParams();
  useEffect(() => {
    checkStatus(id!);
  }, []);

  useEffect(() => {
    if (status === "COMPLETED") {
      getFileMeta(id!);
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {error || getFileMetaError ? (
        /* --- ERROR STATE --- */
        <ProcessErrorDialogue error={error || getFileMetaError} />
      ) : (
        /* --- SUCCESS / LOADING CARD --- */
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {status !== "COMPLETED" ? (
            /* --- PENDING STATE --- */
            <ProcessingDialogue status={status} />
          ) : (
            /* --- COMPLETED STATE --- */
            fileMeta && (
              <DownloadCard id={id!} loading={loading} {...fileMeta} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default DownloadPage;
