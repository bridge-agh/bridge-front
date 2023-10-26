import useSWR from "swr";
import { API_URL, useFetch, SWRState, SWRKey } from "..";

export const API_URL_SESSION = `${API_URL}/session`;

// /heartbeat

export interface HeartbeatRequest {
  userId: string
}

async function heartbeatFetcher(request: HeartbeatRequest): Promise<void> {
  const res = await fetch(`${API_URL_SESSION}/heartbeat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return res.json();
}

export function useHeartbeat() {
  return useFetch(heartbeatFetcher);
}

// /find

export interface FindSessionRequest {
  userId: string
}

export interface FindSessionResponse {
  sessionId: string
}

async function findSessionFetcher(request: FindSessionRequest): Promise<FindSessionResponse> {
  const res = await fetch(`${API_URL_SESSION}/find?userId=${request.userId}`);
  if (!res.ok) return Promise.reject(res.statusText);
  return res.json();
}

export function useFindSession(request: SWRKey<FindSessionRequest>): SWRState<FindSessionResponse> {
  const { data, isLoading } = useSWR(request, findSessionFetcher, { refreshInterval: 1000 });
  return { data, loading: isLoading };
}
