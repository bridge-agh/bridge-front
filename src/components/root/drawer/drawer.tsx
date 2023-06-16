"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import ThemeSwitch from "@/components/theme_switch";
import { auth } from "@/logic/fb";

export default function Drawer({ children }: { children: React.ReactNode }) {
  const [user] = useAuthState(auth);

  return (
    <div className="drawer drawer-end">
      <input id="drawer-menu" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side hidden">
        <label className="drawer-overlay h-auto"></label>
        <ul className="menu p-4 w-full bg-base-100 gap-2">
          {!user && <>
            <li>
              <Link href="/register" className="btn uppercase text-neutral-content">
                Register
              </Link>
            </li>
            <li>
              <Link href="/login" className="btn btn-primary uppercase text-primary-content">
                Log in
              </Link>
            </li>
          </>}
          <div className="flex-1 flex flex-col justify-end">
            <li>
              <ThemeSwitch className="btn text-neutral-content" />
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
}
