import { useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface ResultType {
  status: number;
  name: string;
  message: string;
  data: {
    jobId: string;
  };
}

export const useFileUpload = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultType | null>(null);

  const uploadFile = async (payload: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/file/upload`, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      setResult(await response.json());
    } catch (error) {
      setError("Failed to upload file" + error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, result, uploadFile } as const;
};
