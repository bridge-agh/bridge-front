import { API_URL_SESSION } from "@/api/session";
import { useFetch } from "@/api/utils";
import { PlayerDirection } from "@/game_engine/gameModels";
import getIdToken from "@/logic/get_id_token";

export const API_URL_SESSION_LOBBY = `${API_URL_SESSION}/lobby`;

// /create

export interface CreateLobbyResponse {
  sessionId: string
}

async function createLobbyFetcher(unused: void): Promise<CreateLobbyResponse> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL_SESSION_LOBBY}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return res.json();
}

export function useCreateLobby() {
  return useFetch(createLobbyFetcher);
}

// /join

export interface JoinLobbyRequest {
  sessionId: string
}

async function joinLobbyFetcher(request: JoinLobbyRequest): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL_SESSION_LOBBY}/join`, {
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

export function useJoinLobby() {
  return useFetch(joinLobbyFetcher);
}

// /force-swap

export interface ForceSwapRequest {
  first: PlayerDirection
  second: PlayerDirection
}

async function forceSwapFetcher(request: ForceSwapRequest): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL_SESSION_LOBBY}/force-swap`, {
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

export function useForceSwap() {
  return useFetch(forceSwapFetcher);
}

// /promote-host

export interface PromoteHostRequest {
  userId: string
}

async function setHostFetcher(request: PromoteHostRequest): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL_SESSION_LOBBY}/set-host`, {
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

export function usePromoteHost() {
  return useFetch(setHostFetcher);
}

// /set-assistant

export interface SetAssistantRequest {
  direction: PlayerDirection
}

async function setAssistantFetcher(request: SetAssistantRequest): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL_SESSION_LOBBY}/set-assistant`, {
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

export function useSetAssistant() {
  return useFetch(setAssistantFetcher);
}

// /ready

interface ReadyRequest {
  ready: boolean
}

async function readyFetcher(request: ReadyRequest): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL_SESSION_LOBBY}/ready`, {
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

export function useReady() {
  return useFetch(readyFetcher);
}

// /kick

interface KickRequest {
  id: string
}

async function kickFetcher(request: KickRequest): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL_SESSION_LOBBY}/kick`, {
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

export function useKick() {
  return useFetch(kickFetcher);
}
