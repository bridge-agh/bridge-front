import { useState, useCallback, useEffect } from "react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface FetchState<T, U> {
  trigger: (request: T) => Promise<U>;
  data: U | undefined;
  loading: boolean;
}

export interface SWRState<U> {
  data: U | undefined;
  loading: boolean;
}

export type SWRKey<T> = T | null | undefined | (() => T | null | undefined);

export function useFetch<T, U>(fetcher: (request: T) => Promise<U>): FetchState<T, U> {
  const [data, setData] = useState<U | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const trigger = useCallback((request: T) => {
    if (loading) return Promise.reject();
    setData(undefined);
    setLoading(true);
    return fetcher(request)
      .then(data => {
        setData(data);
        return data;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetcher, loading]);

  return { trigger, data, loading };
}

export function useWebSocketReceive<T>(url: string): SWRState<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const socket = new WebSocket(url);
    socket.onmessage = (event) => {
      setData(JSON.parse(event.data));
      setLoading(false);
    };
    return () => {
      socket.close();
    };
  }, [url]);

  return { data, loading };
}
