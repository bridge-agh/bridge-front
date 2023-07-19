"use client";

import { ThemeProvider } from "next-themes";
import { LobbyIdProvider } from "@/logic/state/lobby_id";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem={true}>
      <LobbyIdProvider>
        {children}
      </LobbyIdProvider>
    </ThemeProvider>
  );
}
