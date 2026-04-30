import { useState } from "react";

export const useFileDownload = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const triggerDownload = async (id: string, fileName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/file/download/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
          },
        },
      );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `compressed-${fileName}`);
      link.click();
      link.parentNode?.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setError("Failed to download file");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, triggerDownload } as const;
};
