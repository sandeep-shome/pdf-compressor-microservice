import { useState } from "react";

export interface FileMeta {
  name: string;
  originalSize: number;
  status: string;
  compressedSize: number;
}

export const useGetFileMeta = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileMeta, setFileMeta] = useState<FileMeta | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getFileMeta = (id: string) => {
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_BASE_URL}/api/file/meta/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setFileMeta(data.data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { loading, fileMeta, error, getFileMeta };
};
