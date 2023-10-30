import { useCallback, useEffect, useState } from "react";
import getIdToken from "@/logic/get_id_token";

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
  url = url.replace(/^http/, "ws");

  const [authUrl, setAuthUrl] = useState<string | undefined>(undefined);
  const [data, setData] = useState<T | undefined>(undefined);
  const loading = data === undefined;

  useEffect(() => {
    if (!url) return;
    getIdToken().then(token => {
      setAuthUrl(`${url}?access_token=${token}`);
    });
  }, [url]);

  useEffect(() => {
    if (!authUrl) return;
    const socket = new WebSocket(authUrl);
    socket.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };
    return () => {
      socket.close();
    };
  }, [authUrl]);

  return { data, loading };
}
