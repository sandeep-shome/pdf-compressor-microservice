import { useState, useCallback, useRef, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useFileStatus = () => {
  const [status, setStatus] = useState<FileStatus>("PENDING");
  const [error, setError] = useState<string | null>(null);

  // Use a ref to track the EventSource for cleanup
  const eventSourceRef = useRef<EventSource | null>(null);

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const checkStatus = useCallback(
    async (id: string) => {
      // 1. Reset state for new request
      cleanup();
      setStatus("PENDING");
      setError(null);

      try {
        const sc = new EventSource(BASE_URL + `/api/file/status/${id}`);
        eventSourceRef.current = sc;

        sc.onmessage = async (event) => {
          try {
            const data = JSON.parse(event.data);
            const currentStatus = data.status as FileStatus;

            setStatus(currentStatus);

            if (currentStatus === "COMPLETED") cleanup(); // Close SSE immediately

            if (currentStatus === "FAILED") {
              cleanup();
              setError("Something went wrong while processing file!");
            }
          } catch (e) {
            console.log(e);
            setError("Failed to parse server response");
            cleanup();
          }
        };

        sc.onerror = () => {
          console.log("Connection to status stream lost.");
          setError("Connection to status stream lost.");
          cleanup();
        };
      } catch (err) {
        setError("Unable to initiate file tracking.");
        console.error(err);
      }
    },
    [cleanup],
  );

  return { status, error, checkStatus };
};
