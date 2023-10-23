import { createContext, useState } from "react";

export const LobbyIdContext = createContext<[string, (lobbyId: string) => void]>(["", () => { }]);

export const LobbyIdProvider = ({ children }: { children: React.ReactNode }) => {
  const [lobbyId, setLobbyId] = useState<string>("");
  return (
    <LobbyIdContext.Provider value={[lobbyId, setLobbyId]}>
      {children}
    </LobbyIdContext.Provider>
  );
};
