import useSWR from "swr";
import { API_URL_SESSION } from ".";
import { useFetch, SWRState, SWRKey } from "..";
import { PlayerDirection } from "@/app/game/gameModels";

export const API_URL_SESSION_LOBBY = `${API_URL_SESSION}/lobby`;

// /create

export interface CreateLobbyRequest {
  host_id: string
}

export interface CreateLobbyResponse {
  session_id: string
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
  user_id: string
  session_id: string
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
  first_position: PlayerDirection
  second_position: PlayerDirection
  session_id: string
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
  user_id: string
  session_id: string
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
  session_id: string
}

export interface Player {
  id: string
  ready: boolean
  position: PlayerDirection
}

export interface GetInfoResponse {
  host_id: string
  users: Player[]
  started: boolean
  version: number
}

async function getLobbyFetcher(request: GetInfoRequest): Promise<GetInfoResponse> {
  const res = await fetch(`${API_URL_SESSION_LOBBY}/info?session_id=${request.session_id}`);
  if (!res.ok) return Promise.reject(res.statusText);
  return res.json();
}

export function useGetLobby(request: SWRKey<GetInfoRequest>): SWRState<GetInfoResponse> {
  const { data, isLoading } = useSWR(request, getLobbyFetcher, { refreshInterval: 1000 });
  return { data, loading: isLoading };
}
export function useForceGetLobby() {
  return useFetch(getLobbyFetcher);
}

// /ready

interface ReadyRequest {
  user_id: string
  session_id: string
}

async function readyFetcher(request: ReadyRequest): Promise<void> {
  const res = await fetch(`${API_URL_SESSION_LOBBY}/ready`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(request)
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return res.json();
}

export function useReady() {
  return useFetch(readyFetcher);
}
