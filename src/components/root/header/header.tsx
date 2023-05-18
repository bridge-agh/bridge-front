import Link from "next/link";
import DrawerButton from "@/components/root/drawer/drawer_button";
import ThemeSwitch from "@/components/theme_switch";

export default function Header() {
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
        <Link
          href="/login"
          className="hidden xs:inline-flex btn btn-primary uppercase"
        >
          Log in
        </Link>
        <Link href="/register" className="hidden sm:inline-flex btn uppercase">
          Register
        </Link>

        {/* post-login */}
        <div className="hidden md:inline-flex dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle bg-neutral-focus w-16 h-16"
          >
            <span className="w-10 text-neutral-content rounded-full">YOU</span>
          </label>
          <ul
            tabIndex={0}
            className="mt-16 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52"
          >
            <li>
              <a>Profile</a>
            </li>
            <li>
              <ThemeSwitch className="self-stretch" />
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
