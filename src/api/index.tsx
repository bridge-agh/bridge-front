import { useState, useCallback } from "react";

export const API_URL = "https://bridge-back-develop.bridge-agh.gleeze.com";

export function useFetch<T, U>(fetcher: (request: T) => Promise<U>): [(request: T) => void, U | undefined, boolean, any] {
  const [data, setData] = useState<U | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(undefined);

  const trigger = useCallback((request: T) => {
    if (loading) return;
    setData(undefined);
    setLoading(true);
    setError(undefined);
    fetcher(request)
      .then(data => {
        setData(data);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetcher, loading]);

  return [trigger, data, loading, error];
}
