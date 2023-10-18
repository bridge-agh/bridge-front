import useSWR from "swr";
import { API_URL_SESSION } from ".";
import { useFetch, SWRState, SWRKey } from "..";

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
export interface ForceSwapRequest {
  first_user_id: string
  second_user_id: string
  session_id: string
  position: string
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
export interface ChoosePositionRequest {
  user_id: string
  session_id: string
  position: string
}
async function choosePositionFetcher(request: ChoosePositionRequest): Promise<void> {
  const res = await fetch(`${API_URL_SESSION_LOBBY}/choose`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(request)
  });
  if (!res.ok) return Promise.reject(res.statusText);
  return Promise.resolve();
}
export function useChoosePosition() {
  return useFetch(choosePositionFetcher);
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

export interface LobbyUser {
  id: string
  ready: boolean
  position: string
}

export interface GetInfoResponse {
  host_id: string
  users: LobbyUser[]
  ready: boolean[]
  started: boolean
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
