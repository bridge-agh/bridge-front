import { API_URL_SESSION } from "@/api/session";
import { useFetch } from "@/api/utils";
import getIdToken from "@/logic/get_id_token";
import { TrickBid, Card } from "@/game_engine/gameModels";
import { useSessionInfo } from "@/api/session";

export const API_URL_SESSION_GAME = `${API_URL_SESSION}/game`;

// /play

async function playFetcher(request: Card): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL_SESSION_GAME}/play`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(request)
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return Promise.resolve();
}

export function usePlay() {
  return useFetch(playFetcher);
}

// /pass

async function passFetcher(request: void): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL_SESSION_GAME}/pass`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return Promise.resolve();
}

export function usePass() {
  return useFetch(passFetcher);
}

// /double

async function doubleFetcher(request: void): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL_SESSION_GAME}/double`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return Promise.resolve();
}

export function useDouble() {
  return useFetch(doubleFetcher);
}

// /redouble

async function redoubleFetcher(request: void): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL_SESSION_GAME}/redouble`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return Promise.resolve();
}

export function useRedouble() {
  return useFetch(redoubleFetcher);
}

// /bid

async function bidFetcher(request: TrickBid): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL_SESSION_GAME}/bid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(request)
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return Promise.resolve();
}

export function useBid() {
  return useFetch(bidFetcher);
}

// gameState (/session/info)

export function useGameState() {
  const { data, loading } = useSessionInfo();
  return {
    data: data?.gameState,
    loading
  };
}
