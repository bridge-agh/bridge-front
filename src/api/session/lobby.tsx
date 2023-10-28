import { API_URL_SESSION } from ".";
import { useFetch, useWebSocketReceive, SWRState, SWRKey } from "..";
import { PlayerDirection } from "@/app/game/gameModels";

export const API_URL_SESSION_LOBBY = `${API_URL_SESSION}/lobby`;

// /create

export interface CreateLobbyRequest {
  hostId: string
}

export interface CreateLobbyResponse {
  sessionId: string
}

async function createLobbyFetcher(request: CreateLobbyRequest): Promise<CreateLobbyResponse> {
  const res = await fetch(`${API_URL_SESSION_LOBBY}/create`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(request)
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return res.json();
}

export function useCreateLobby() {
  return useFetch(createLobbyFetcher);
}

// /join

export interface JoinLobbyRequest {
  userId: string
  sessionId: string
}

async function joinLobbyFetcher(request: JoinLobbyRequest): Promise<void> {
  const res = await fetch(`${API_URL_SESSION_LOBBY}/join`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
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
  sessionId: string
}

async function forceSwapFetcher(request: ForceSwapRequest): Promise<void> {
  const res = await fetch(`${API_URL_SESSION_LOBBY}/force-swap`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(request)
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return Promise.resolve();
}

export function useForceSwap() {
  return useFetch(forceSwapFetcher);
}

// /leave

export interface LeaveLobbyRequest {
  userId: string
}

async function leaveLobbyFetcher(request: LeaveLobbyRequest): Promise<void> {
  const res = await fetch(`${API_URL_SESSION_LOBBY}/leave`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(request)
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return Promise.resolve();
}

export function useLeaveLobby() {
  return useFetch(leaveLobbyFetcher);
}

// /info

export interface GetInfoRequest {
  sessionId: string
}

export interface Player {
  id: string
  ready: boolean
  position: PlayerDirection
}

export interface GetInfoResponse {
  hostId: string
  users: Player[]
  started: boolean
}

export function useGetLobby(request: GetInfoRequest | null | undefined): SWRState<GetInfoResponse> {
  return useWebSocketReceive<GetInfoResponse>(request ? `${API_URL_SESSION_LOBBY}/info?sessionId=${request.sessionId}` : "");
}

// /ready

interface ReadyRequest {
  userId: string
  ready: boolean
}

async function readyFetcher(request: ReadyRequest): Promise<void> {
  const res = await fetch(`${API_URL_SESSION_LOBBY}/ready`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(request)
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return Promise.resolve();
}

export function useReady() {
  return useFetch(readyFetcher);
}
