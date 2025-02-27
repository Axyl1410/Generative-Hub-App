import axiosInstance from "@/lib/axios-config";
import { useEffect, useState } from "react";

interface FetchResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

const useAutoFetch = <T>(
  url: string,
  interval: number = 600000,
  address?: string
): FetchResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<T>(url);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [url, interval, address]);

  return { data, error, loading };
};

export default useAutoFetch;
