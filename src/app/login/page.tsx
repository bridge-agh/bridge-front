import Link from "next/link";

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center my-40">
      <div className="rounded-xl bg-base-300 p-5 flex flex-col justify-start items-start">
        <div className="self-center text-2xl font-bold mb-3">Log in</div>
        <input type="text" placeholder="Email" className="input input-bordered mb-3" />
        <input type="password" placeholder="Password" className="input input-bordered mb-3" />
        <div className="self-stretch flex flex-row justify-between items-start">
          <Link href="/register" className="btn btn-link">Create account</Link>
          <Link href="/home" className="btn btn-primary">Log in</Link>
        </div>
      </div>
    </div>
  )
}
