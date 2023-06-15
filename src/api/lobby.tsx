import { useState, useCallback } from "react";
import useLongPoll from "@/logic/use_long_poll";
import { API_URL } from ".";

export function useCreateLobby() {
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const createLobby = useCallback((host_id: string) => {
    setLobbyId(null);
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/createLobby`, {
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
    fetch(`${API_URL}/joinLobby`, {
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

export function useGetLobby(lobbyId: string) {
  const [lobby, error] = useLongPoll(`${API_URL}/getLobby?lobby_id=${lobbyId}&poll=true`);
  return [lobby, error];
}
