"use client";

import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/logic/fb";
import { use, useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/login");
    if (!user && !loading && !error) {
      router.push("/login");
    }
  }, [router, user, loading, error]);

  return (
    <>
      {(user && <>{children}</>) ||
        (loading && <div>Loading...</div>) ||
        (error && <div>Error: {error.message}</div>)}
    </>
  );
}
