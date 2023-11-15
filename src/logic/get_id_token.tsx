import { auth } from "@/logic/fb";

export default function getIdToken(): Promise<string | undefined> {
  let user = auth.currentUser;
  if (user) return user.getIdToken();
  return Promise.resolve(undefined);
}
