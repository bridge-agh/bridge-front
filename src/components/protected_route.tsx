"use client";

import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/logic/fb";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading && !error) {
      router.push("/login");
    }
  }, [user, loading, error, router]);

  if (user) {
    return <>{children}</>;
  }

  if (!loading && error) {
    return <div>Error: {error.message}</div>; 
  } else {
    return <div>Loading...</div>;
  }
};
