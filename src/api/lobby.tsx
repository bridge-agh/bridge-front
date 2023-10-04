import { useState, useCallback } from "react";
import useSWR from "swr";
import { API_URL } from ".";

const ENDPOINT = `${API_URL}/lobby`;

function useFetch<T, U>(fetcher: (request: T) => Promise<U>): [(request: T) => void, U|undefined, boolean, any] {
  const [data, setData] = useState<U|undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(undefined);

  const trigger = useCallback((request: T) => {
    if (loading) return;
    setData(undefined);
    setLoading(true);
    setError(undefined);
    fetcher(request)
      .then(data => {
        setData(data);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetcher, loading]);

  return [trigger, data, loading, error];
}

// /create

interface CreateLobbyRequest {
  host_id: string
}

interface CreateLobbyResponse {
  session_id: string
}

async function createLobbyFetcher(request: CreateLobbyRequest): Promise<CreateLobbyResponse> {
  const res = await fetch(`${ENDPOINT}/create`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(request)
  });
  return res.json();
}

export function useCreateLobby() {
  return useFetch(createLobbyFetcher);
}

// /join

interface JoinLobbyRequest {
  user_id: string
  session_id: string
}

async function joinLobbyFetcher(request: JoinLobbyRequest): Promise<void> {
  const res = await fetch(`${ENDPOINT}/join`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(request)
  });
  return res.json();
}

export function useJoinLobby() {
  return useFetch(joinLobbyFetcher);
}

// /leave

interface LeaveLobbyRequest {
  user_id: string
  session_id: string
}

async function leaveLobbyFetcher(request: LeaveLobbyRequest): Promise<void> {
  const res = await fetch(`${ENDPOINT}/leave`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(request)
  });
  return res.json();
}

export function useLeaveLobby() {
  return useFetch(leaveLobbyFetcher);
}

// /info

interface GetInfoResponse {
  host_id: string
  users: [string]
  ready: [boolean]
  started: boolean
}

async function getLobbyFetcher(session_id: string): Promise<GetInfoResponse> {
  const res = await fetch(`${ENDPOINT}/info?session_id=${session_id}`);
  return res.json();
}

export function useGetLobby(lobbyId: string|null): [GetInfoResponse|undefined, boolean, any] {
  const { data, error, isLoading } = useSWR(lobbyId, getLobbyFetcher, { refreshInterval: 1000 });
  return [data, isLoading, error];
}


// /ready

interface ReadyRequest {
  user_id: string
  session_id: string
}

async function readyFetcher(request: ReadyRequest): Promise<void> {
  const res = await fetch(`${ENDPOINT}/ready`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(request)
  });
  return res.json();
}

export function useReady() {
  return useFetch(readyFetcher);
}
