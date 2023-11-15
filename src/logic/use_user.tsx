import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/logic/fb";

export default function useUser() {
  const [user, loading] = useAuthState(auth);
  return { user, loading };
}
