import { useCallback, useState } from "react";
import useWebSocket from "react-use-websocket";
import getIdToken from "@/logic/get_id_token";

export interface FetchState<T, U> {
  trigger: (request: T) => Promise<U>;
  data: U | undefined;
  loading: boolean;
}

export interface SocketState<U> {
  data: U | undefined;
  loading: boolean;
}

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

export function useSocket<T>(url: string | undefined): SocketState<T> {
  url = url?.replace(/^http/, "ws");

  const [data, setData] = useState<T | undefined>(undefined);
  const loading = data === undefined;

  const getAuthUrl = useCallback(() => {
    return getIdToken().then(token => {
      return `${url}?access_token=${token}`;
    });
  }, [url]);

  useWebSocket(url ? getAuthUrl : null, {
    shouldReconnect: () => true,
    onMessage: (event) => {
      setData(JSON.parse(event.data));
    },
    reconnectInterval: 500,
  });

  return { data, loading };
}
