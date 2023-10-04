import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/logic/fb";

export default function useUserUid() {
  const [user, loading, error] = useAuthState(auth);
  const uid = user?.uid || undefined;
  return {uid, loading, error};
}
