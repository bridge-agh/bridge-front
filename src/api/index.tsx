import { useState, useCallback } from "react";

export const API_URL = "https://bridge-back-master.bridge-agh.gleeze.com";

export interface FetchHook<T, U> {
  trigger: (request: T) => void;
  data: U | undefined;
  loading: boolean;
  error: any | undefined | null;
}

export interface SWRHook<U> {
  data: U | undefined;
  loading: boolean;
  error: any | undefined | null;
}

export function useFetch<T, U>(fetcher: (request: T) => Promise<U>): FetchHook<T, U> {
  const [data, setData] = useState<U | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | undefined | null>(undefined);

  const trigger = useCallback((request: T) => {
    if (loading) return;
    setData(undefined);
    setLoading(true);
    setError(undefined);
    fetcher(request)
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetcher, loading]);

  return { trigger, data, loading, error };
}
