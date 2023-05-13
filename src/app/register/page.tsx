import Link from "next/link";

export default function Register() {
  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 lg:col-start-3 lg:col-span-4 xl:col-start-5 xl:col-span-4">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-center">
        <div className="text-2xl font-bold mb-4 text-center">
          Create account
        </div>
        <input
          type="text"
          placeholder="Username"
          className="input input-bordered mb-3 self-stretch"
        />
        <input
          type="text"
          placeholder="Email"
          className="input input-bordered mb-3 self-stretch"
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered mb-3 self-stretch"
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="input input-bordered mb-3 self-stretch"
        />
        <div className="self-stretch flex flex-col justify-between items-start mt-2">
          <Link href="/home" className="btn btn-primary self-stretch">
            Create account
          </Link>
          <p className="text-center w-full inline mt-6">
            <span>Already have an acount? </span>
            <Link
              href="/login"
              className="text-secondary hover:text-secondary-focus transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
