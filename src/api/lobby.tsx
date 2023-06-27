import { useState, useCallback } from "react";
import useSWR from "swr";
import { API_URL } from ".";

const ENDPOINT = `${API_URL}/lobby`;

async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

export function useCreateLobby() {
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const createLobby = useCallback((host_id: string) => {
    setLobbyId(null);
    setLoading(true);
    setError(null);
    fetch(`${ENDPOINT}/createLobby`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ host_id })
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText;
        }
      })
      .then(data => {
        setLobbyId(data.lobby_id);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [createLobby, lobbyId, loading, error];
}

export function useJoinLobby() {
  const [joined, setJoined] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const joinLobby = useCallback((lobby_id: string, user_id: string) => {
    setJoined(false);
    setLoading(true);
    setError(null);
    fetch(`${ENDPOINT}/joinLobby`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ lobby_id, user_id })
    })
      .then(res => {
        if (res.ok) {
          setJoined(true);
        } else {
          throw res.statusText;
        }
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [joinLobby, joined, loading, error];
}

interface GetLobbyResponse {
  host_id: string
  users: [string]
}

async function getLobbyFetcher(lobbyId: string): Promise<GetLobbyResponse> {
  const res = await fetch(`${ENDPOINT}/getLobby?lobby_id=${lobbyId}`);
  return res.json();
}

export function useGetLobby(lobbyId: string|null) {
  const { data, error, isLoading } = useSWR(lobbyId, getLobbyFetcher, { refreshInterval: 1000 });
  return [data, isLoading, error];
}

interface FindLobbyResponse {
  lobby_id: string
}

async function findLobbyFetcher(userId: string): Promise<FindLobbyResponse> {
  const res = await fetch(`${ENDPOINT}/findLobby?user_id=${userId}`);
  return res.json();
}

export function useFindLobby(userId: string|null) {
  const { data, error, isLoading } = useSWR(userId, findLobbyFetcher, { revalidateOnMount: true });
  return [data?.lobby_id, isLoading, error];
}
