import Link from "next/link";

export default function Header() {
    return (
        <header className="navbar bg-base-300 p-4">
            <div className="flex-1 navbar-title">
                <Link href="/" className="btn btn-ghost normal-case text-2xl">AGH Bridge</Link>
            </div>
            <nav className="navbar-nav gap-2">
                <Link href="/login" className="btn btn-primary uppercase">Sign in</Link>
                <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle bg-neutral-focus w-16 h-16">
                    <span className="w-10 rounded-full">
                        YOU
                    </span>
                </label>
                <ul tabIndex={0} className="mt-2 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52">
                    <li><a>Profile</a></li>
                    <li><a>Settings</a></li>
                    <li><a>Logout</a></li>
                </ul>
                </div>
            </nav>
        </header>
    )
}