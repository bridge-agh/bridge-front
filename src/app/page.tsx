import Link from "next/link";

const pages = [
  "/login",
  "/register",
  "/home",
  "/lobby",
  "/game",
  "/results",
  "/assistantPower",
  "/profile"
];

export default function Root() {
  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 lg:col-start-3 lg:col-span-4 xl:col-start-5 xl:col-span-4">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-start">
        <div className="text-4xl font-bold text-center self-stretch mb-2">Debug Navigation</div>
        <div className="text-lg">This is a debug page for navigation.</div>
        {pages.map((page, i) => <Link key={i} href={page} className="btn btn-link text-accent normal-case mt-3">{page}</Link>)}
      </div>
    </div>
  );
}
