import { useFetch, SocketState, useSocket } from "@/api/utils";
import { API_URL } from "@/api";
import getIdToken from "@/logic/get_id_token";
import { PlayerDirection } from "@/app/game/gameModels";

export const API_URL_SESSION = `${API_URL}/session`;

// /info

export interface Player {
  id: string
  ready: boolean
  position: PlayerDirection
}

export interface GetInfoResponse {
  sessionId: string
  hostId: string
  users: Player[]
  started: boolean
}

export function useSessionInfo(): SocketState<GetInfoResponse> {
  return useSocket<GetInfoResponse>(`${API_URL_SESSION}/info`);
}

// /leave

async function leaveSessionFetcher(unused: void): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL_SESSION}/leave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return Promise.resolve();
}

export function useLeaveSession() {
  return useFetch(leaveSessionFetcher);
}
