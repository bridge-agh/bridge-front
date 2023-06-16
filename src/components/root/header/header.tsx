"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/logic/fb";
import DrawerButton from "@/components/root/drawer/drawer_button";
import ThemeSwitch from "@/components/theme_switch";

export default function Header() {
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const router = useRouter();

  const onClickSignOut = useCallback(() => {
    signOut();
    router.push("/");
  }, [signOut, router]);

  return (
    <header className="navbar bg-base-300 p-4 header">
      <div className="flex-1 navbar-title">
        <Link href="/" className="btn btn-ghost normal-case text-2xl">
          AGH Bridge
        </Link>
      </div>
      <nav className="navbar-nav gap-2">
        <div className="xs:hidden">
          <DrawerButton />
        </div>

        {/* pre-login */}
        {!user && <>
          <Link
            href="/login"
            className="hidden xs:inline-flex btn btn-primary uppercase"
          >
            Log in
          </Link>
          <Link href="/register" className="hidden sm:inline-flex btn uppercase">
            Register
          </Link>
        </>}

        {/* post-login */}
        {user && <>
          <div>{user.email}</div>
          <div className="hidden md:inline-flex dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle bg-neutral-focus w-16 h-16"
            >
              <span className="w-10 text-neutral-content rounded-full">YOU</span>
            </label>
            <ul
              tabIndex={0}
              className="mt-16 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52 drop-shadow-lg"
            >
              <li>
                <a>Profile</a>
              </li>
              <li >
                <ThemeSwitch />
              </li>
              <li>
                <a onClick={onClickSignOut}>Logout</a>
              </li>
            </ul>
          </div>
        </>}
      </nav>
    </header>
  );
}
