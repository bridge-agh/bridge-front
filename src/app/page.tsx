import Link from "next/link";

const pages = [
  '/login',
  '/register',
  '/home',
  '/lobby',
  '/game',
  '/results',
]

export default function Root() {
  return (
    <div className="flex flex-col justify-center items-center my-10">
      <div className="rounded-xl bg-base-300 p-5 flex flex-col justify-start items-start">
        <div className="text-4xl font-bold">Debug Navigation</div>
        <div className="text-lg">This is a debug page for navigation.</div>
        {pages.map((page, i) => <Link key={i} href={page} className="btn btn-link normal-case mt-3">{page}</Link>)}
      </div>
    </div>
  )
}
