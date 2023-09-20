"use client";

import ThemeSwitch from "@/components/theme_switch";
import { auth } from "@/logic/fb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { closeDrawer } from "./drawer_button";

export default function Drawer({ children }: { children: React.ReactNode }) {
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const router = useRouter();

  const onClickSignOut = useCallback(async () => {
    closeDrawer();
    await signOut();
    router.push("/");
  }, [signOut, router]);

  return (
    <div className="content-height drawer-end">
      <input id="drawer-menu" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side hidden">
        <label className="drawer-overlay h-auto"></label>
        <ul className="menu p-4 w-full bg-base-100 gap-2">
          {!user && (
            <>
              <li className="ms:hidden" onClick={closeDrawer}>
                <Link
                  href="/register"
                  className="btn uppercase text-neutral-content"
                >
                  Register
                </Link>
              </li>
              <li className="ms:hidden" onClick={closeDrawer}>
                <Link
                  href="/login"
                  className="btn btn-primary uppercase text-primary-content"
                >
                  Log in
                </Link>
              </li>
            </>
          )}
          {user && <div className="text-center ms:hidden">{user.email}</div>}
          <div className="flex-1 flex flex-col justify-end gap-2">
            {user && (
              <li
                onClick={onClickSignOut}
              >
                <a className="btn text-primary-content">Logout</a>
              </li>
            )}
            <li>
              <ThemeSwitch className="btn text-neutral-content" />
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
}
