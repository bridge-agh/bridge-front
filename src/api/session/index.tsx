import useSWR from "swr";
import { API_URL, useFetch } from "..";

export const API_URL_SESSION = `${API_URL}/session`;

// /heartbeat

interface HeartbeatRequest {
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

interface FindSessionResponse {
  session_id: string
}

async function findSessionFetcher(userId: string): Promise<FindSessionResponse> {
  const res = await fetch(`${API_URL_SESSION}/find?user_id=${userId}`);
  return res.json();
}

export function useFindSession(userId: string|undefined): [FindSessionResponse|undefined, boolean, any] {
  const { data, error, isLoading } = useSWR(userId, findSessionFetcher, { refreshInterval: 1000 });
  return [data, isLoading, error];
}
