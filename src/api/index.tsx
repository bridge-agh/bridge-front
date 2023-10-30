import { API_URL, useFetch } from "@/api/utils";
import getIdToken from "@/logic/get_id_token";

export const API_URL_SESSION = `${API_URL}/session`;

// /heartbeat

async function heartbeatFetcher(ignored: undefined): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL_SESSION}/heartbeat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return res.json();
}

export function useHeartbeat() {
  return useFetch(heartbeatFetcher);
}
