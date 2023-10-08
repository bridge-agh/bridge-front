import useSWR from "swr";
import { API_URL, useFetch, SWRState, SWRKey } from "..";

export const API_URL_SESSION = `${API_URL}/session`;

// /heartbeat

export interface HeartbeatRequest {
  user_id: string
  session_id: string
}

async function heartbeatFetcher(request: HeartbeatRequest): Promise<void> {
  const res = await fetch(`${API_URL_SESSION}/heartbeat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });
  return res.json();
}

export function useHeartbeat() {
  return useFetch(heartbeatFetcher);
}

// /find

export interface FindSessionRequest {
  user_id: string
}

export interface FindSessionResponse {
  session_id: string
}

async function findSessionFetcher(request: FindSessionRequest): Promise<FindSessionResponse> {
  const res = await fetch(`${API_URL_SESSION}/find?user_id=${request.user_id}`);
  return res.json();
}

export function useFindSession(request: SWRKey<FindSessionRequest>): SWRState<FindSessionResponse> {
  const { data, isLoading } = useSWR(request, findSessionFetcher, { refreshInterval: 1000 });
  return { data, loading: isLoading };
}
