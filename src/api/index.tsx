import { useFetch } from "@/api/utils";
import getIdToken from "@/logic/get_id_token";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// /heartbeat

async function heartbeatFetcher(unused: void): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL}/heartbeat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return Promise.resolve();
}

export function useHeartbeat() {
  return useFetch(heartbeatFetcher);
}
